#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VALIDATION_DIR = path.join(ROOT, "editorial", "validation");

const SECTION_AUTHORS = {
  "Actualidad": "Clara Valdés Moreno",
  "Política": "Álvaro Serrano Vidal",
  "Economía": "Marta Robles Ferrer",
  "Sociedad": "Elena Campos Navarro",
  "Mundo": "Daniel Ortega Salvat",
  "Tecnología": "Lucía Martín Vega",
};

const ALLOWED_STATUS = new Set(["draft", "review", "verified", "published"]);
const REQUIRED_FIELDS = [
  "title",
  "description",
  "date",
  "section",
  "author",
  "type",
  "status",
];

function fail(message) {
  console.error(`✖ ${message}`);
}

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") {
    return { data: null, error: "no comienza con un bloque YAML de frontmatter (---)" };
  }

  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closing === -1) {
    return { data: null, error: "no contiene el cierre del frontmatter (---)" };
  }

  const data = {};
  for (const [index, line] of lines.slice(1, closing).entries()) {
    if (!line.trim() || line.trim().startsWith("#")) continue;
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) {
      return {
        data: null,
        error: `línea de frontmatter no reconocida (${index + 2}): ${line}`,
      };
    }

    const [, key, rawValue] = match;
    const value = rawValue.trim().replace(/^['"]|['"]$/g, "");
    data[key] = value;
  }

  return { data, error: null };
}

function verificationRecordExists(articleId) {
  const candidates = [
    path.join(VALIDATION_DIR, `${articleId}.md`),
    path.join(VALIDATION_DIR, `${articleId}.json`),
  ];
  return candidates.some((candidate) => fs.existsSync(candidate));
}

function validateArticle(file) {
  const content = fs.readFileSync(file, "utf8");
  const { data, error } = parseFrontmatter(content);
  const errors = [];
  const warnings = [];

  if (error) {
    errors.push(error);
    return { errors, warnings };
  }

  for (const field of REQUIRED_FIELDS) {
    if (!data[field]) errors.push(`falta el campo obligatorio '${field}'`);
  }

  if (data.date && !/^\d{4}-\d{2}-\d{2}$/.test(data.date)) {
    errors.push(`'date' debe tener formato YYYY-MM-DD (valor: ${data.date})`);
  }

  if (data.section && !SECTION_AUTHORS[data.section]) {
    errors.push(`sección desconocida '${data.section}'`);
  }

  if (data.section && data.author && SECTION_AUTHORS[data.section]) {
    const expected = SECTION_AUTHORS[data.section];
    if (data.author !== expected) {
      errors.push(
        `autor incompatible con la sección: '${data.section}' requiere '${expected}', pero figura '${data.author}'`
      );
    }
  }

  if (data.status && !ALLOWED_STATUS.has(data.status)) {
    errors.push(`estado editorial no permitido '${data.status}'`);
  }

  const articleId = data.id || path.basename(file, path.extname(file));
  if ((data.status === "verified" || data.status === "published") && !verificationRecordExists(articleId)) {
    errors.push(
      `estado '${data.status}' requiere un expediente de verificación en editorial/validation/${articleId}.md o .json`
    );
  }

  if (data.status === "published") {
    warnings.push(
      "estado 'published': la validación automática comprueba estructura y existencia del expediente; la aprobación humana y el Publication Gate siguen siendo obligatorios"
    );
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
  console.error(`✖ No se encontraron artículos Markdown en ${path.relative(ROOT, ARTICLES_DIR)}`);
  process.exit(1);
}

let totalErrors = 0;
let totalWarnings = 0;

console.log("MALDITOESPEJO — validación automática de artículos");
console.log(`Artículos encontrados: ${files.length}`);
console.log("");

for (const file of files) {
  const relative = path.relative(ROOT, file);
  const { errors, warnings } = validateArticle(file);
  totalErrors += errors.length;
  totalWarnings += warnings.length;

  if (errors.length === 0) console.log(`✓ ${relative}`);
  else {
    console.log(`✖ ${relative}`);
    for (const error of errors) fail(`  ${error}`);
  }

  for (const warning of warnings) console.warn(`⚠ ${relative}: ${warning}`);
}

console.log("");
console.log(`Resultado: ${totalErrors === 0 ? "APTO ESTRUCTURALMENTE" : "FALLA DE VALIDACIÓN"}`);
console.log(`Errores: ${totalErrors}`);
console.log(`Avisos: ${totalWarnings}`);

process.exit(totalErrors === 0 ? 0 : 1);
