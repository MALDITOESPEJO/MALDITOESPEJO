#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VALIDATION_DIR = path.join(ROOT, "editorial", "validation");

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return null;
  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closing === -1) return null;
  const data = {};
  for (const line of lines.slice(1, closing)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (match) data[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return data;
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

function normalize(value) {
  return value.trim().toLowerCase().replace(/\s+/g, " ");
}

function validateRecord(articleFile) {
  const article = fs.readFileSync(articleFile, "utf8");
  const data = parseFrontmatter(article);
  if (!data || !["verified", "published"].includes(data.status)) return null;

  const articleId = data.id || path.basename(articleFile, path.extname(articleFile));
  const recordPath = path.join(VALIDATION_DIR, `${articleId}.md`);
  if (!fs.existsSync(recordPath)) {
    return { articleId, errors: [`falta el expediente ${path.relative(ROOT, recordPath)}`] };
  }

  const record = fs.readFileSync(recordPath, "utf8");
  const lower = record.toLowerCase();
  const errors = [];

  if (!lower.includes("## 3.") || !lower.includes("afirmación") || !lower.includes("evidencia") || !lower.includes("evaluación")) {
    errors.push("la sección de afirmaciones no contiene una tabla reconocible de afirmación, evidencia y evaluación");
  }

  const requiredValues = [
    ["article_id", articleId],
    ["title", data.title],
    ["description", data.description],
  ];

  for (const [label, value] of requiredValues) {
    if (!value || !lower.includes(normalize(value))) {
      errors.push(`no se encuentra en el expediente la trazabilidad de '${label}'`);
    }
  }

  const tableStart = lower.indexOf("| afirmación |");
  if (tableStart >= 0) {
    const tableEnd = lower.indexOf("\n\n", tableStart);
    const table = lower.slice(tableStart, tableEnd >= 0 ? tableEnd : undefined);
    const rows = table.split(/\r?\n/).filter((line) => line.trim().startsWith("|") && !line.includes("---"));
    if (rows.length < 2) errors.push("la tabla de afirmaciones no contiene ninguna fila de evidencia");
    for (const row of rows.slice(1)) {
      const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
      if (cells.length >= 3 && cells.some((cell) => !cell)) {
        errors.push("existe una fila de afirmación con campos vacíos");
      }
    }
  }

  return { articleId, errors };
}

const articles = collectMarkdownFiles(ARTICLES_DIR);
let required = 0;
let checked = 0;
const errors = [];

for (const articleFile of articles) {
  const result = validateRecord(articleFile);
  if (!result) continue;
  required += 1;
  if (result.errors.length === 0) checked += 1;
  for (const error of result.errors) errors.push(`${result.articleId}: ${error}`);
}

console.log("MALDITOESPEJO — trazabilidad automática afirmación → evidencia");
console.log(`Artículos que requieren trazabilidad: ${required}`);
console.log(`Artículos comprobados correctamente: ${checked}`);

if (errors.length) {
  for (const error of errors) console.error(`✖ ${error}`);
  console.log(`Resultado: FALLA DE TRAZABILIDAD (${errors.length} errores)`);
  process.exit(1);
}

console.log("Resultado: TRAZABILIDAD ESTRUCTURAL SUPERADA");
process.exit(0);
