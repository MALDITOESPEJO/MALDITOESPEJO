#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VALIDATION_DIR = path.join(ROOT, "editorial", "validation");

const VALID_SECTIONS = new Set([
  "actualidad", "politica", "economia", "sociedad", "mundo", "tecnologia",
  "cartagena", "regiondemurcia", "mayores", "cultura",
]);

const SECTION_AUTHORS = {
  actualidad: "Iria Valcárcel Montoro",
  politica: "Bruno Salvatierra Ledesma",
  economia: "Nerea Villacorta Beltrán",
  sociedad: "Ariadna Soler Montalbán",
  mundo: "Gael Santacruz Ferrán",
  tecnologia: "Vera Alcántara Robledo",
  cartagena: "Lucía Belmonte Navarro",
};

const AUTHOR_POLICY_EFFECTIVE_DATE = "2026-09-04";
const FIXED_AUTHOR = "Redacción MALDITOESPEJO";
const FIXED_AUTHOR_EFFECTIVE_DATE = "2026-09-12";
const ALLOWED_STATUS = new Set(["draft", "review", "verified", "published", "approved"]);
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
      const item = listMatch[1].trim();
      data[activeListKey].push(item.replace(/^['"]|['"]$/g, ""));
      continue;
    }

    // Nested YAML under object/list fields is intentionally ignored by this
    // structural validator. Dedicated editorial validators handle semantics.
    if (/^\s+\S/.test(line) && activeListKey) continue;

    return { data: null, error: `línea de frontmatter no reconocida (${index + 2}): ${line}` };
  }
  return { data, error: null };
}

function verificationRecordExists(articleId) {
  return [
    path.join(VALIDATION_DIR, `${articleId}.md`),
    path.join(VALIDATION_DIR, `${articleId}.json`),
  ].some((candidate) => fs.existsSync(candidate));
}

function validateArticle(file, knownSlugs) {
  const content = fs.readFileSync(file, "utf8");
  const { data, error } = parseFrontmatter(content);
  const errors = [];
  const warnings = [];
  if (error) return { errors: [error], warnings };

  const legacyDate = typeof data.date === "string"
    ? data.date
    : typeof data.publishedAt === "string"
      ? data.publishedAt.slice(0, 10)
      : null;
  const legacySchema = typeof data.publishedAt === "string" && Array.isArray(data.author);

  for (const field of REQUIRED_FIELDS) {
    if (legacySchema && ["date", "author", "status"].includes(field)) continue;
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      errors.push(`falta el campo obligatorio '${field}'`);
    }
  }
  for (const field of RECOMMENDED_FIELDS) {
    if (!data[field] || (Array.isArray(data[field]) && data[field].length === 0)) {
      warnings.push(`falta el campo recomendado '${field}'`);
    }
  }
  if (legacySchema) {
    warnings.push("esquema histórico detectado (publishedAt/author.name): se valida sin exigir el frontmatter editorial moderno");
  }

  if (legacyDate && !/^\d{4}-\d{2}-\d{2}$/.test(legacyDate)) {
    errors.push(`'date' debe tener formato YYYY-MM-DD (valor: ${legacyDate})`);
  }

  const normalizedSection = typeof data.section === "string"
    ? data.section.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/\s+/g, "")
    : null;
  if (typeof data.section === "string" && !VALID_SECTIONS.has(normalizedSection)) {
    errors.push(`sección desconocida '${data.section}' (debe normalizar a una de: ${[...VALID_SECTIONS].join(", ")})`);
  }

  const normalizedAuthor = typeof data.author === "string" ? data.author.normalize("NFC") : null;
  const isFixedAuthorEra = typeof legacyDate === "string" && legacyDate >= FIXED_AUTHOR_EFFECTIVE_DATE;
  if (!legacySchema && isFixedAuthorEra) {
    if (normalizedAuthor && normalizedAuthor !== FIXED_AUTHOR.normalize("NFC")) {
      errors.push(`todo artículo a partir del ${FIXED_AUTHOR_EFFECTIVE_DATE} debe llevar la autoría fija '${FIXED_AUTHOR}', pero este artículo figura con '${data.author}'`);
    }
  } else if (!legacySchema) {
    const expectedAuthor = normalizedSection ? SECTION_AUTHORS[normalizedSection] : null;
    if (expectedAuthor && normalizedAuthor && normalizedAuthor !== expectedAuthor.normalize("NFC")) {
      const isLegacy = typeof legacyDate === "string" && legacyDate < AUTHOR_POLICY_EFFECTIVE_DATE;
      const message = `la sección '${data.section}' tenía firma fija '${expectedAuthor}', pero este artículo figura con '${data.author}'`;
      warnings.push(isLegacy
        ? `${message} (contenido anterior al ${AUTHOR_POLICY_EFFECTIVE_DATE}: se permite como legado, no bloquea)`
        : `${message} (contenido de la ventana 2026-09-04/2026-09-12, roster ya sustituido: se permite como legado, no bloquea)`);
    } else if (!expectedAuthor && data.author) {
      warnings.push(`la sección '${data.section}' no tenía firma fija asignada en el roster de esa época`);
    }
  }

  if (data.status && !ALLOWED_STATUS.has(data.status)) errors.push(`estado editorial no permitido '${data.status}'`);

  const ownSlug = path.basename(file, path.extname(file));
  if (Array.isArray(data.related_articles)) {
    for (const relatedSlug of data.related_articles) {
      if (relatedSlug === ownSlug) warnings.push(`related_articles incluye el propio artículo ('${relatedSlug}'), se omitirá en pantalla`);
      else if (!knownSlugs.has(relatedSlug)) warnings.push(`related_articles referencia un slug que no existe ('${relatedSlug}'); el frontend lo omite en silencio, pero probablemente sea un error de tecleo`);
    }
    if (data.related_articles.length > 4) warnings.push(`related_articles tiene ${data.related_articles.length} elementos; el frontend solo muestra los primeros 4`);
  }

  const articleId = typeof data.id === "string" && data.id ? data.id : path.basename(file, path.extname(file));
  const requiresVerification = !legacySchema && typeof legacyDate === "string" && legacyDate >= FIXED_AUTHOR_EFFECTIVE_DATE;
  if (requiresVerification && (data.status === "verified" || data.status === "published") && !verificationRecordExists(articleId)) {
    errors.push(`estado '${data.status}' requiere un expediente de verificación en editorial/validation/${articleId}.md o .json`);
  }
  if (data.status === "published" || data.status === "approved") {
    warnings.push(`estado '${data.status}': la validación automática comprueba estructura; la aprobación humana y el Publication Gate siguen siendo obligatorios para considerar la pieza publicable bajo el estándar completo`);
  }
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
if (files.length === 0) {
  console.error(`X No se encontraron artículos Markdown en ${path.relative(ROOT, ARTICLES_DIR)}`);
  process.exit(1);
}
const knownSlugs = new Set(files.map((file) => path.basename(file, path.extname(file))));
let totalErrors = 0;
let totalWarnings = 0;
console.log("MALDITOESPEJO — validación automática de artículos");
console.log(`Artículos encontrados: ${files.length}`);
console.log("");
for (const file of files) {
  const relative = path.relative(ROOT, file);
  const { errors, warnings } = validateArticle(file, knownSlugs);
  totalErrors += errors.length;
  totalWarnings += warnings.length;
  if (errors.length === 0) console.log(`OK ${relative}`);
  else {
    console.log(`X ${relative}`);
    for (const error of errors) fail(`  ${error}`);
  }
  for (const warning of warnings) console.warn(`! ${relative}: ${warning}`);
}
console.log("");
console.log(`Resultado: ${totalErrors === 0 ? "APTO ESTRUCTURALMENTE" : "FALLA DE VALIDACIÓN"}`);
console.log(`Errores: ${totalErrors}`);
console.log(`Avisos: ${totalWarnings}`);
process.exit(totalErrors === 0 ? 0 : 1);
