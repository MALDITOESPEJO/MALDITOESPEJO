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
  console.error("Uso: npm run provenance -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

let record;
try {
  record = JSON.parse(fs.readFileSync(casePath, "utf8"));
} catch (error) {
  console.error(`✖ JSON inválido: ${error.message}`);
  process.exit(1);
}

const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const errors = [];
const warnings = [];
const lineages = new Map();
const independence = new Map();

const validRelationships = new Set([
  "ORIGINAL",
  "REPRODUCES",
  "QUOTES",
  "DERIVED_FROM",
  "AGGREGATES",
  "ENRICHES",
  "INDEPENDENT_OBSERVATION",
  "UNKNOWN_PROVENANCE",
]);

for (const item of evidence) {
  if (!item.evidence_id || !item.claim_id || !item.source_id || !item.document_or_record) {
    errors.push(`Evidencia incompleta: ${item.evidence_id ?? "SIN_ID"}`);
  }
  if (!item.lineage_id) errors.push(`Sin lineage_id: ${item.evidence_id}`);
  if (!item.independence_group) errors.push(`Sin independence_group: ${item.evidence_id}`);
  if (!validRelationships.has(item.relationship_type ?? "UNKNOWN_PROVENANCE")) {
    errors.push(`relationship_type inválido: ${item.evidence_id}`);
  }

  const lineage = item.lineage_id ?? "LIN-UNKNOWN";
  const group = item.independence_group ?? "IG-UNKNOWN";
  if (!lineages.has(lineage)) lineages.set(lineage, []);
  lineages.get(lineage).push(item);
  if (!independence.has(group)) independence.set(group, []);
  independence.get(group).push(item);
}

for (const [group, items] of independence) {
  const sources = new Set(items.map((item) => item.source_id));
  if (group === "IG-UNKNOWN" || group === "UNKNOWN") {
    warnings.push(`${group}: no se puede evaluar independencia sustantiva.`);
  } else if (sources.size > 1) {
    warnings.push(`${group}: ${sources.size} fuentes comparten grupo de independencia; requieren evaluación editorial antes de contarlas como corroboración independiente.`);
  }
}

for (const [lineage, items] of lineages) {
  const relationships = new Set(items.map((item) => item.relationship_type ?? "UNKNOWN_PROVENANCE"));
  if (lineage === "LIN-UNKNOWN") warnings.push("Existe evidencia con procedencia desconocida.");
  if (relationships.has("REPRODUCES") || relationships.has("QUOTES") || relationships.has("DERIVED_FROM")) {
    warnings.push(`${lineage}: contiene evidencia reproductora o derivada; no debe contarse automáticamente como independiente.`);
  }
}

console.log("MALDITOESPEJO — PROVENANCE ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Evidencias examinadas: ${evidence.length}`);
console.log(`Líneas de procedencia: ${lineages.size}`);
console.log(`Grupos de independencia: ${independence.size}`);

if (warnings.length) {
  console.log("\nADVERTENCIAS:");
  for (const warning of warnings) console.log(`- ${warning}`);
}

if (errors.length) {
  console.error("\nERRORES:");
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log("\n✓ Consistencia estructural de procedencia superada.");
console.log("⚠ El resultado no declara verdadera la evidencia ni resuelve por sí solo la independencia editorial.");
