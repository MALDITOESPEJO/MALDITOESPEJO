#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VALIDATION_DIR = path.join(ROOT, "editorial", "validation");

const REQUIRED_FIELDS = [
  ["article_id", ["article_id"]],
  ["publication sources", ["publication_sources", "publication sources"]],
  ["claim-to-evidence", ["claim_to_evidence", "claim-to-evidence", "claim-to-evidence-assessment", "claim_to_evidence_assessment"]],
  ["temporal check", ["temporal_check", "temporal check"]],
  ["corroboration", ["corroboration", "corroboration_contradiction_check"]],
  ["contradiction", ["contradiction", "corroboration_contradiction_check"]],
  ["interpretation risks", ["interpretation_risks", "interpretation risks"]],
  ["unresolved", ["unresolved_points", "unresolved"]],
  ["human approval", ["human_approval", "human_approval_status", "human_editorial_approval", "human approval"]],
];

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

function readVerificationRecord(articleId) {
  const candidates = [
    path.join(VALIDATION_DIR, `${articleId}.md`),
    path.join(VALIDATION_DIR, `${articleId}.json`),
  ];
  for (const recordPath of candidates) {
    if (!fs.existsSync(recordPath)) continue;
    const raw = fs.readFileSync(recordPath, "utf8");
    try {
      return { path: recordPath, data: JSON.parse(raw), text: raw.toLowerCase() };
    } catch {
      return { path: recordPath, data: null, text: raw.toLowerCase() };
    }
  }
  return null;
}

function hasField(record, aliases) {
  if (record.data && typeof record.data === "object") {
    return aliases.some((key) => Object.prototype.hasOwnProperty.call(record.data, key));
  }
  return aliases.some((key) => record.text.includes(`"${key.toLowerCase()}"`));
}

const articles = collectMarkdownFiles(ARTICLES_DIR);
const errors = [];
const checked = [];

for (const articleFile of articles) {
  const content = fs.readFileSync(articleFile, "utf8");
  const data = parseFrontmatter(content);
  if (!data || !["verified", "published"].includes(data.status)) continue;

  const articleId = data.id || path.basename(articleFile, path.extname(articleFile));
  const record = readVerificationRecord(articleId);
  if (!record) {
    errors.push(`${articleId}: falta el expediente en .md o .json`);
    continue;
  }

  if (record.data === null && record.path.endsWith(".json")) {
    errors.push(`${articleId}: expediente JSON inválido`);
    continue;
  }

  for (const [label, aliases] of REQUIRED_FIELDS) {
    if (!hasField(record, aliases)) {
      errors.push(`${articleId}: el expediente no documenta '${label}'`);
    }
  }

  const recordArticleId = record.data?.article_id;
  if (recordArticleId && recordArticleId !== articleId) {
    errors.push(`${articleId}: el expediente identifica article_id '${recordArticleId}'`);
  } else if (!recordArticleId && !record.text.includes(articleId.toLowerCase())) {
    errors.push(`${articleId}: el expediente no identifica correctamente el article_id`);
  }

  checked.push(articleId);
}

console.log("MALDITOESPEJO — validación automática de expedientes de verificación");
console.log(`Artículos que requieren expediente: ${checked.length + errors.filter((e) => e.includes("falta el expediente")).length}`);
console.log(`Expedientes comprobados: ${checked.length}`);

if (errors.length) {
  for (const error of errors) console.error(`✖ ${error}`);
  console.log(`Resultado: FALLA DE VALIDACIÓN (${errors.length} errores)`);
  process.exit(1);
}

console.log("Resultado: EXPEDIENTES ESTRUCTURALMENTE COMPLETOS");
process.exit(0);
