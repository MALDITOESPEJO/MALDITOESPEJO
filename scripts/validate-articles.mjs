#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VALIDATION_DIR = path.join(ROOT, "editorial", "validation");

// Secciones v\u00e1lidas: deben coincidir exactamente con VALID_SECTIONS en
// src/data/articles.ts (el frontend es la fuente de verdad del slug real).
// La lista de firmas por secci\u00f3n es orientativa (registro de bylines
// conocidas), no una lista cerrada: MALDITOESPEJO puede tener m\u00e1s de una
// firma por secci\u00f3n. Un autor fuera de esta lista genera un aviso, no un
// error, hasta que exista un registro editorial de firmas autorizado.
const VALID_SECTIONS = new Set([
  "actualidad",
  "politica",
  "economia",
  "sociedad",
  "mundo",
  "tecnologia",
  "cartagena",
  "cultura",
]);

// Roster oficial confirmado por el Director/propietario el 2026-09-04.
// Cultura no es una secci\u00f3n editorial independiente ni una ruta real del
// sitio (no existe /cultura en src/app ni en src/data/sections.ts): el
// contenido cultural se etiqueta como "actualidad", no como "cultura".
const SECTION_AUTHORS = {
  actualidad: "Iria Valc\u00e1rcel Montoro",
  politica: "Bruno Salvatierra Ledesma",
  economia: "Nerea Villacorta Beltr\u00e1n",
  sociedad: "Ariadna Soler Montalb\u00e1n",
  mundo: "Gael Santacruz Ferr\u00e1n",
  tecnologia: "Vera Alc\u00e1ntara Robledo",
  cartagena: "Luc\u00eda Belmonte Navarro",
};

// A partir de esta fecha (inclusive), todo art\u00edculo nuevo debe llevar la
// firma fija de su secci\u00f3n: un desajuste es error, no aviso. Los art\u00edculos
// con fecha anterior son legado publicado antes de esta pol\u00edtica y solo
// generan un aviso, para no romper la validaci\u00f3n de contenido ya vivo.
const AUTHOR_POLICY_EFFECTIVE_DATE = "2026-09-04";

// "approved" es el estado terminal real que usa el frontend (ver
// src/data/articles.ts: solo se publican archivos con status "approved").
// Se mantienen adem\u00e1s los estados del pipeline editorial completo
// (draft/review/verified/published) para casos que s\u00ed atraviesan
// case \u2192 claims \u2192 evidencia \u2192 verificaci\u00f3n \u2192 Publication Gate.
const ALLOWED_STATUS = new Set(["draft", "review", "verified", "published", "approved"]);
// Campos exigidos por el frontend real (src/data/articles.ts) m\u00e1s los
// m\u00ednimos editoriales. 'description' y 'type' son recomendados pero no
// bloquean la validaci\u00f3n: su ausencia se reporta como aviso.
const REQUIRED_FIELDS = ["title", "date", "section", "author", "status"];
const RECOMMENDED_FIELDS = ["description", "type"];

function fail(message) { console.error(`X ${message}`); }

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return { data: null, error: "no comienza con un bloque YAML de frontmatter (---)" };
  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closing === -1) return { data: null, error: "no contiene el cierre del frontmatter (---)" };

  const data = {};
  let activeListKey = null;
  for (const [index, line] of lines.slice(1, closing).entries()) {
    if (!line.trim() || line.trim().startsWith("#")) continue;

    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      const [, key, rawValue] = keyMatch;
      const value = rawValue.trim().replace(/^['"]|['"]$/g, "");
      if (value === "") {
        data[key] = [];
        activeListKey = key;
      } else {
        data[key] = value;
        activeListKey = null;
      }
      continue;
    }

    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && activeListKey) {
      data[activeListKey].push(listMatch[1].trim().replace(/^['"]|['"]$/g, ""));
      continue;
    }

    return { data: null, error: `l\u00ednea de frontmatter no reconocida (${index + 2}): ${line}` };
  }
  return { data, error: null };
}

function verificationRecordExists(articleId) {
  return [
    path.join(VALIDATION_DIR, `${articleId}.md`),
    path.join(VALIDATION_DIR, `${articleId}.json`),
  ].some((candidate) => fs.existsSync(candidate));
}

function validateArticle(file) {
  const content = fs.readFileSync(file, "utf8");
  const { data, error } = parseFrontmatter(content);
  const errors = [];
  const warnings = [];
  if (error) return { errors: [error], warnings };

  for (const field of REQUIRED_FIELDS) if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) errors.push(`falta el campo obligatorio '${field}'`);
  for (const field of RECOMMENDED_FIELDS) if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) warnings.push(`falta el campo recomendado '${field}'`);
  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) errors.push(`'date' debe tener formato YYYY-MM-DD (valor: ${data.date})`);
  // Misma normalizaci\u00f3n que aplica el frontend real (src/data/articles.ts):
  // min\u00fasculas + eliminaci\u00f3n de diacr\u00edticos, para que "Mundo", "Tecnolog\u00eda"
  // y "tecnologia" se validen como el mismo slug.
  const normalizedSection = data.section?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (data.section && !VALID_SECTIONS.has(normalizedSection)) errors.push(`secci\u00f3n desconocida '${data.section}' (debe normalizar a una de: ${[...VALID_SECTIONS].join(", ")})`);

  // Normalizamos a NFC antes de comparar: un acento puede venir compuesto
  // (\u00e9 = U+00E9) o descompuesto (e + \u00b4 = U+0065 U+0301); visualmente son
  // id\u00e9nticos pero no coinciden byte a byte si no se normalizan igual.
  const normalizedAuthor = data.author?.normalize("NFC");
  const expectedAuthor = SECTION_AUTHORS[normalizedSection];
  if (expectedAuthor && normalizedAuthor && normalizedAuthor !== expectedAuthor.normalize("NFC")) {
    const isLegacy = data.date && data.date < AUTHOR_POLICY_EFFECTIVE_DATE;
    const message = `la secci\u00f3n '${data.section}' tiene firma fija '${expectedAuthor}', pero este art\u00edculo figura con '${data.author}'`;
    if (isLegacy) warnings.push(`${message} (contenido anterior al ${AUTHOR_POLICY_EFFECTIVE_DATE}: se permite como legado, no bloquea)`);
    else errors.push(message);
  } else if (!expectedAuthor && data.author) {
    warnings.push(`la secci\u00f3n '${data.section}' todav\u00eda no tiene firma fija asignada en el roster oficial`);
  }
  if (data.status && !ALLOWED_STATUS.has(data.status)) errors.push(`estado editorial no permitido '${data.status}'`);

  const articleId = data.id || path.basename(file, path.extname(file));
  if ((data.status === "verified" || data.status === "published") && !verificationRecordExists(articleId)) errors.push(`estado '${data.status}' requiere un expediente de verificaci\u00f3n en editorial/validation/${articleId}.md o .json`);
  if (data.status === "published" || data.status === "approved") warnings.push(`estado '${data.status}': la validaci\u00f3n autom\u00e1tica comprueba estructura; la aprobaci\u00f3n humana y el Publication Gate siguen siendo obligatorios para considerar la pieza publicable bajo el est\u00e1ndar completo`);
  return { errors, warnings };
}

function collectMarkdownFiles(directory) {
  if (!fs.existsSync(directory)) return [];
  const result = [];
  for (const entry of fs.readdirSync(directory, { withFileTypes: true })) {
    const fullPath = path.join(directory, entry.name);
    if (entry.isDirectory()) result.push(...collectMarkdownFiles(fullPath));
    else if (entry.isFile() && entry.name.endsWith(".md")) result.push(fullPath);
  }
  return result;
}

const files = collectMarkdownFiles(ARTICLES_DIR);
if (files.length === 0) { console.error(`X No se encontraron art\u00edculos Markdown en ${path.relative(ROOT, ARTICLES_DIR)}`); process.exit(1); }
let totalErrors = 0, totalWarnings = 0;
console.log("MALDITOESPEJO \u2014 validaci\u00f3n autom\u00e1tica de art\u00edculos");
console.log(`Art\u00edculos encontrados: ${files.length}`);
console.log("");
for (const file of files) {
  const relative = path.relative(ROOT, file);
  const { errors, warnings } = validateArticle(file);
  totalErrors += errors.length; totalWarnings += warnings.length;
  if (errors.length === 0) console.log(`OK ${relative}`);
  else { console.log(`X ${relative}`); for (const error of errors) fail(`  ${error}`); }
  for (const warning of warnings) console.warn(`! ${relative}: ${warning}`);
}
console.log("");
console.log(`Resultado: ${totalErrors === 0 ? "APTO ESTRUCTURALMENTE" : "FALLA DE VALIDACI\u00d3N"}`);
console.log(`Errores: ${totalErrors}`);
console.log(`Avisos: ${totalWarnings}`);
process.exit(totalErrors === 0 ? 0 : 1);
