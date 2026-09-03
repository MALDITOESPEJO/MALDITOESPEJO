#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const VALIDATION_DIR = path.join(ROOT, "editorial", "validation");
const REQUIRED_MARKERS = [
  "article_id",
  "publication sources",
  "claim-to-evidence",
  "temporal check",
  "corroboration",
  "contradiction",
  "interpretation risks",
  "unresolved",
  "human approval",
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

function findVerificationRecord(articleId) {
  const candidates = [
    path.join(VALIDATION_DIR, `${articleId}.md`),
    path.join(VALIDATION_DIR, `${articleId}.json`),
  ];
  return candidates.find((candidate) => fs.existsSync(candidate)) || null;
}

const articles = collectMarkdownFiles(ARTICLES_DIR);
const errors = [];
const checked = [];

for (const articleFile of articles) {
  const content = fs.readFileSync(articleFile, "utf8");
  const data = parseFrontmatter(content);
  if (!data || !["verified", "published"].includes(data.status)) continue;

  const articleId = data.id || path.basename(articleFile, path.extname(articleFile));
  const recordPath = findVerificationRecord(articleId);
  if (!recordPath) {
    errors.push(`${articleId}: falta el expediente ${path.relative(ROOT, path.join(VALIDATION_DIR, `${articleId}.{md,json}`))}`);
    continue;
  }

  const record = fs.readFileSync(recordPath, "utf8").toLowerCase();
  for (const marker of REQUIRED_MARKERS) {
    if (!record.includes(marker.toLowerCase())) {
      errors.push(`${articleId}: el expediente no documenta '${marker}'`);
    }
  }

  if (!record.includes(articleId.toLowerCase())) {
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
