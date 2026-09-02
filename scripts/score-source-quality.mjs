#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
if (!caseId) {
  console.error("Uso: npm run source:quality -- --case CASE-########");
  process.exit(1);
}

const file = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(file)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(file, "utf8"));
const candidates = Array.isArray(record.web_candidates) ? record.web_candidates : [];

if (!candidates.length) {
  console.error("✖ No hay candidatos web. Ejecuta primero web:search y web:import.");
  process.exit(1);
}

const officialPatterns = [
  /\.gov(?:\.|\/)/i,
  /\.gob\./i,
  /\.eu(?:\.|\/)/i,
  /\.int(?:\.|\/)/i,
  /\.mil(?:\.|\/)/i,
];

function score(candidate) {
  const url = candidate.url_or_reference ?? candidate.url ?? "";
  const publisher = candidate.publisher ?? "";
  const title = candidate.title ?? "";
  const excerpt = candidate.relevant_excerpt_or_data ?? candidate.excerpt ?? "";
  let points = 0;
  const reasons = [];

  if (officialPatterns.some((pattern) => pattern.test(url))) {
    points += 3;
    reasons.push("dominio institucional reconocible");
  }
  if (publisher) {
    points += 1;
    reasons.push("editor identificado");
  }
  if (title) {
    points += 1;
    reasons.push("documento o página identificable");
  }
  if (excerpt) {
    points += 2;
    reasons.push("contenido relevante disponible");
  }
  if (candidate.published_at) {
    points += 1;
    reasons.push("fecha de publicación disponible");
  }
  if (candidate.source_role === "PUBLICATION" || candidate.source_role === "CORROBORATION") {
    points += 1;
    reasons.push("rol documental declarado");
  }

  let classification = "UNKNOWN";
  if (!url || !title) classification = "REJECTED";
  else if (points >= 7) classification = "HIGH_QUALITY_CANDIDATE";
  else if (points >= 4) classification = "MEDIUM_QUALITY_CANDIDATE";
  else if (points >= 2) classification = "LOW_QUALITY_CANDIDATE";

  return { points, classification, reasons };
}

record.source_quality = {
  assessed_at: new Date().toISOString(),
  candidates: candidates.map((candidate) => ({
    candidate_id: candidate.candidate_id ?? null,
    claim_id: candidate.claim_id ?? null,
    ...score(candidate),
  })),
  rule: "La calidad de la fuente determina la aptitud del candidato para evaluación documental; no determina la verdad de la afirmación.",
};

record.workflow = record.workflow ?? {};
record.workflow.source_quality = "ASSESSED";
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: "La calidad de las fuentes ha sido evaluada, pero todavía deben aceptarse evidencias, comprobar procedencia, contrastarse las afirmaciones y completar la verificación.",
};

fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, "utf8");

const counts = {};
for (const item of record.source_quality.candidates) {
  counts[item.classification] = (counts[item.classification] ?? 0) + 1;
}

console.log("MALDITOESPEJO — SOURCE QUALITY ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Candidatos evaluados: ${candidates.length}`);
for (const [classification, count] of Object.entries(counts)) {
  console.log(`  ${classification}: ${count}`);
}
console.log("⚠ La puntuación no verifica afirmaciones ni autoriza publicación.");
