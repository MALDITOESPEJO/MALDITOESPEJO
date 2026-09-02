#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const GATES_DIR = path.join(ROOT, "editorial", "publication-gates");
const CASES_DIR = path.join(ROOT, "editorial", "cases");

const REQUIRED_APPROVAL_FIELDS = [
  "article",
  "verification_completed",
  "publication_claims",
  "publication_sources_support",
  "material_contradictions_resolved",
  "human_editorial_approval",
];

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return null;
  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closing === -1) return null;
  const data = {};
  for (const line of lines.slice(1, closing)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (!match) continue;
    data[match[1]] = match[2].trim().replace(/^['"]|['"]$/g, "");
  }
  return data;
}

function collectArticles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectArticles(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

function readGate(articleId) {
  const file = path.join(GATES_DIR, `${articleId}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return { __invalid_json: true };
  }
}

function readCase(caseId) {
  if (!caseId) return null;
  const file = path.join(CASES_DIR, `${caseId}.json`);
  if (!fs.existsSync(file)) return null;
  try {
    return JSON.parse(fs.readFileSync(file, "utf8"));
  } catch {
    return null;
  }
}

const articles = collectArticles(ARTICLES_DIR);
let blocked = 0;
let checked = 0;

console.log("MALDITOESPEJO — PUBLICATION GATE");
console.log(`Artículos encontrados: ${articles.length}`);
console.log("");

for (const file of articles) {
  const relative = path.relative(ROOT, file);
  const metadata = parseFrontmatter(fs.readFileSync(file, "utf8"));
  if (!metadata) {
    console.log(`✖ ${relative}: frontmatter inválido`);
    blocked += 1;
    continue;
  }

  if (metadata.status !== "published") {
    console.log(`· ${relative}: no requiere gate de publicación (${metadata.status ?? "sin estado"})`);
    continue;
  }

  checked += 1;
  const articleId = metadata.id || path.basename(file, ".md");
  const gate = readGate(articleId);
  const errors = [];

  if (!gate) {
    errors.push(`falta el registro de aprobación editorial '${articleId}.json'`);
  } else if (gate.__invalid_json) {
    errors.push("el registro de aprobación no contiene JSON válido");
  } else {
    for (const field of REQUIRED_APPROVAL_FIELDS) {
      if (!(field in gate)) errors.push(`falta '${field}'`);
    }
    if (gate.article && gate.article !== relative && gate.article !== articleId) {
      errors.push(`el registro no corresponde al artículo (${gate.article})`);
    }
    if (gate.verification_completed !== true) errors.push("'verification_completed' debe ser true");
    if (!Array.isArray(gate.publication_claims) || gate.publication_claims.length === 0) {
      errors.push("'publication_claims' debe contener al menos una afirmación");
    }
    if (gate.publication_sources_support !== true) errors.push("'publication_sources_support' debe ser true");
    if (gate.material_contradictions_resolved !== true) errors.push("'material_contradictions_resolved' debe ser true");
    if (gate.human_editorial_approval !== true) errors.push("'human_editorial_approval' debe ser true");

    const caseId = metadata.case_id;
    const caseRecord = readCase(caseId);
    if (!caseRecord) {
      errors.push(`no se puede comprobar el caso editorial '${caseId ?? "sin case_id"}'`);
    } else {
      const verified = new Set(caseRecord.verification?.verified_claims ?? []);
      const scope = new Set(caseRecord.publishable_scope?.claim_ids ?? []);
      for (const claimId of gate.publication_claims ?? []) {
        if (!verified.has(claimId)) errors.push(`la afirmación '${claimId}' no consta como VERIFIED en el caso`);
        if (!scope.has(claimId)) errors.push(`la afirmación '${claimId}' no pertenece al alcance publicable del caso`);
      }
    }
  }

  if (errors.length) {
    blocked += 1;
    console.log(`✖ ${relative}`);
    for (const error of errors) console.log(`  - ${error}`);
  } else {
    console.log(`✓ ${relative}: PUBLICACIÓN AUTORIZADA`);
  }
}

console.log("");
console.log(`Artículos publicados comprobados: ${checked}`);
console.log(`Bloqueos: ${blocked}`);
console.log(`Resultado: ${blocked === 0 ? "GATE SUPERADO" : "PUBLICACIÓN BLOQUEADA"}`);
process.exit(blocked === 0 ? 0 : 1);
