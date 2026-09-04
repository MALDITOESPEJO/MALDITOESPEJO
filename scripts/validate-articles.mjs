#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VALIDATION_DIR = path.join(ROOT, "editorial", "validation");

// Secciones vÃ¡lidas: deben coincidir exactamente con VALID_SECTIONS en
// src/data/articles.ts (el frontend es la fuente de verdad del slug real).
// La lista de firmas por secciÃ³n es orientativa (registro de bylines
// conocidas), no una lista cerrada: MALDITOESPEJO puede tener mÃ¡s de una
// firma por secciÃ³n. Un autor fuera de esta lista genera un aviso, no un
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

const KNOWN_BYLINES = new Set([
  "Clara ValdÃ©s Moreno",
  "Ãlvaro Serrano Vidal",
  "Marta Robles Ferrer",
  "Elena Campos Navarro",
  "Daniel Ortega Salvat",
  "LucÃ­a MartÃ­n Vega",
  "Ariadna Soler MontalbÃ¡n",
  "Bruno Salvatierra Ledesma",
  "Gael Santacruz FerrÃ¡n",
  "Iria ValcÃ¡rcel Montoro",
  "LucÃ­a Belmonte Navarro",
  "Marina Torres Salcedo",
  "Nerea Villacorta BeltrÃ¡n",
  "Vera AlcÃ¡ntara Robledo",
]);

// "approved" es el estado terminal real que usa el frontend (ver
// src/data/articles.ts: solo se publican archivos con status "approved").
// Se mantienen ademÃ¡s los estados del pipeline editorial completo
// (draft/review/verified/published) para casos que sÃ­ atraviesan
// case -> claims -> evidencia -> verificaciÃ³n -> Publication Gate.
const ALLOWED_STATUS = new Set(["draft", "review", "verified", "published", "approved"]);
// Campos exigidos por el frontend real (src/data/articles.ts) mÃ¡s los
// mÃ­nimos editoriales. 'description' y 'type' son recomendados pero no
// bloquean la validaciÃ³n: su ausencia se reporta como aviso.
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

    return { data: null, error: `lÃ­nea de frontmatter no reconocida (${index + 2}): ${line}` };
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
  // Misma normalizaciÃ³n que aplica el frontend real (src/data/articles.ts):
  // minÃºsculas + eliminaciÃ³n de diacrÃ­ticos, para que "Mundo", "TecnologÃ­a"
  // y "tecnologia" se validen como el mismo slug.
  const normalizedSection = data.section?.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "");
  if (data.section && !VALID_SECTIONS.has(normalizedSection)) errors.push(`secciÃ³n desconocida '${data.section}' (debe normalizar a una de: ${[...VALID_SECTIONS].join(", ")})`);
  if (data.author && !KNOWN_BYLINES.has(data.author)) warnings.push(`firma no registrada en el listado de bylines conocidas: '${data.author}'`);
  if (data.status && !ALLOWED_STATUS.has(data.status)) errors.push(`estado editorial no permitido '${data.status}'`);

  const articleId = data.id || path.basename(file, path.extname(file));
  if ((data.status === "verified" || data.status === "published") && !verificationRecordExists(articleId)) errors.push(`estado '${data.status}' requiere un expediente de verificaciÃ³n en editorial/validation/${articleId}.md o .json`);
  if (data.status === "published" || data.status === "approved") warnings.push(`estado '${data.status}': la validaciÃ³n automÃ¡tica comprueba estructura; la aprobaciÃ³n humana y el Publication Gate siguen siendo obligatorios para considerar la pieza publicable bajo el estÃ¡ndar completo`);
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
if (files.length === 0) { console.error(`X No se encontraron artÃ­culos Markdown en ${path.relative(ROOT, ARTICLES_DIR)}`); process.exit(1); }
let totalErrors = 0, totalWarnings = 0;
console.log("MALDITOESPEJO â€” validaciÃ³n automÃ¡tica de artÃ­culos");
console.log(`ArtÃ­culos encontrados: ${files.length}`);
console.log("");
for (const file of files) {
  const relative = path.relative(ROOT, file);
  const { errors, warnings } = validateArticle(file);
  totalErrors += errors.length; totalWarnings += warnings.length;
  if (errors.length === 0) console.log(`OK  ${relative}`);
  else { console.log(`X   ${relative}`); for (const error of errors) fail(`  ${error}`); }
  for (const warning of warnings) console.warn(`!   ${relative}: ${warning}`);
}
console.log("");
console.log(`Resultado: ${totalErrors === 0 ? "APTO ESTRUCTURALMENTE" : "FALLA DE VALIDACIÃ“N"}`);
console.log(`Errores: ${totalErrors}`);
console.log(`Avisos: ${totalWarnings}`);
process.exit(totalErrors === 0 ? 0 : 1);