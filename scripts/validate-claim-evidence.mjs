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
  return String(value ?? "").trim().toLowerCase().replace(/\s+/g, " ");
}

function findVerificationRecord(articleId) {
  for (const ext of [".md", ".json"]) {
    const candidate = path.join(VALIDATION_DIR, `${articleId}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function validateJsonRecord(recordPath, articleId) {
  const errors = [];
  let record;
  try {
    record = JSON.parse(fs.readFileSync(recordPath, "utf8"));
  } catch {
    errors.push("el expediente JSON no contiene JSON válido");
    return errors;
  }

  if (record.article_id !== articleId) errors.push("article_id del expediente no coincide con el artículo");
  if (!Array.isArray(record.publication_sources) || record.publication_sources.length === 0) errors.push("faltan publication_sources");
  if (!String(record.claim_to_evidence_assessment ?? "").trim()) errors.push("falta claim_to_evidence_assessment");
  if (!String(record.temporal_check ?? "").trim()) errors.push("falta temporal_check");
  if (!String(record.corroboration_contradiction_check ?? "").trim()) errors.push("falta corroboration_contradiction_check");
  if (!Array.isArray(record.interpretation_risks)) errors.push("falta interpretation_risks");
  if (!Array.isArray(record.unresolved_points)) errors.push("falta unresolved_points");
  if (!String(record.human_approval_status ?? "").trim()) errors.push("falta human_approval_status");

  return errors;
}

function validateMarkdownRecord(recordPath, articleId, data) {
  const record = fs.readFileSync(recordPath, "utf8");
  const lower = record.toLowerCase();
  const errors = [];

  if (!lower.includes("## 3.") || !lower.includes("afirmación") || !lower.includes("evidencia") || !lower.includes("evaluación")) {
    errors.push("la sección de afirmaciones no contiene una tabla reconocible de afirmación, evidencia y evaluación");
  }

  for (const [label, value] of [["article_id", articleId], ["title", data.title], ["description", data.description]]) {
    if (!value || !lower.includes(normalize(value))) errors.push(`no se encuentra en el expediente la trazabilidad de '${label}'`);
  }

  const tableStart = lower.indexOf("| afirmación |");
  if (tableStart >= 0) {
    const tableEnd = lower.indexOf("\n\n", tableStart);
    const table = lower.slice(tableStart, tableEnd >= 0 ? tableEnd : undefined);
    const rows = table.split(/\r?\n/).filter((line) => line.trim().startsWith("|") && !line.includes("---"));
    if (rows.length < 2) errors.push("la tabla de afirmaciones no contiene ninguna fila de evidencia");
    for (const row of rows.slice(1)) {
      const cells = row.split("|").slice(1, -1).map((cell) => cell.trim());
      if (cells.length >= 3 && cells.some((cell) => !cell)) errors.push("existe una fila de afirmación con campos vacíos");
    }
  }

  return errors;
}

function validateRecord(articleFile) {
  const article = fs.readFileSync(articleFile, "utf8");
  const data = parseFrontmatter(article);
  if (!data || !["verified", "published"].includes(data.status)) return null;

  const articleId = data.id || path.basename(articleFile, path.extname(articleFile));
  const recordPath = findVerificationRecord(articleId);
  if (!recordPath) return { articleId, errors: [`falta el expediente de verificación para ${articleId}`] };

  const errors = path.extname(recordPath).toLowerCase() === ".json"
    ? validateJsonRecord(recordPath, articleId)
    : validateMarkdownRecord(recordPath, articleId, data);
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
