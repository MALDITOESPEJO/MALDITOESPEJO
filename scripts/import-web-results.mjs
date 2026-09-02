#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const inputPath = arg("--input");
if (!inputPath) {
  console.error("Uso: npm run web:import -- --input ruta/resultados.json");
  process.exit(1);
}

const absolute = path.resolve(ROOT, inputPath);
if (!fs.existsSync(absolute)) {
  console.error(`✖ No existe el archivo: ${inputPath}`);
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(absolute, "utf8"));
} catch (error) {
  console.error(`✖ JSON inválido: ${error.message}`);
  process.exit(1);
}

if (!payload.case_id || !/^CASE-\d{8}$/.test(payload.case_id) || !Array.isArray(payload.results)) {
  console.error("✖ Resultado web inválido: requiere case_id CASE-######## y results[].");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${payload.case_id}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${payload.case_id}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const claims = new Set((record.claims ?? []).map((claim) => claim.claim_id));
const valid = [];
const rejected = [];

for (const item of payload.results) {
  const required = item && item.claim_id && item.url && item.title && item.source_name;
  if (!required || !claims.has(item.claim_id)) {
    rejected.push({ item, reason: "claim_id inexistente o campos obligatorios ausentes" });
    continue;
  }
  valid.push({
    claim_id: item.claim_id,
    url: item.url,
    title: item.title,
    source_name: item.source_name,
    published_at: item.published_at ?? null,
    snippet: item.snippet ?? null,
    document_or_record: item.document_or_record ?? null,
    source_role: item.source_role ?? "UNASSESSED",
    relationship_type: item.relationship_type ?? "UNKNOWN_PROVENANCE",
    lineage_id: item.lineage_id ?? "LIN-UNKNOWN",
    independence_group: item.independence_group ?? "IG-UNKNOWN",
    acceptance: "CANDIDATE_REQUIRES_EDITORIAL_ASSESSMENT"
  });
}

record.web_research = {
  ...(record.web_research ?? {}),
  imported_at: new Date().toISOString(),
  research_run_id: payload.research_run_id ?? null,
  provider: payload.provider ?? null,
  status: valid.length ? "RESULTS_IMPORTED" : "NO_VALID_RESULTS",
  result_count: valid.length,
  rejected_count: rejected.length
};
record.web_results = valid;
record.web_results_rejected = rejected;
record.workflow = record.workflow ?? {};
record.workflow.evidence = valid.length ? "CANDIDATE_EVIDENCE_AVAILABLE" : "AWAITING_DOCUMENTARY_RETRIEVAL";
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: "Los resultados web importados son candidatos documentales y requieren evaluación antes de convertirse en evidencia aceptada."
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — WEB RESULTS IMPORT");
console.log(`✓ Caso: ${payload.case_id}`);
console.log(`✓ Resultados aceptados como candidatos: ${valid.length}`);
console.log(`✓ Resultados rechazados: ${rejected.length}`);
console.log("⚠ Ningún resultado ha sido certificado automáticamente como evidencia.");
