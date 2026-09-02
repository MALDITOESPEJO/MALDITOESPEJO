#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const args = process.argv;
const i = args.indexOf("--case");
const caseId = i >= 0 ? args[i + 1] : null;
if (!caseId) { console.error("Uso: npm run evidence:prepare -- --case CASE-########"); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
const resultsPath = path.join(CASES_DIR, `${caseId}.web-results.json`);
if (!fs.existsSync(casePath) || !fs.existsSync(resultsPath)) { console.error("✖ Faltan el caso o los resultados web."); process.exit(1); }
const results = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
const candidates = (results.results ?? []).map((item) => ({
  claim_id: item.claim_id,
  source_id: item.resolved_source_id ?? item.source_id ?? null,
  source_role: item.source_role ?? "CONTEXT",
  url_or_reference: item.url,
  document_or_record: item.document_or_record ?? item.title,
  published_at: item.published_at ?? null,
  observed_at: item.retrieved_at ?? null,
  relevant_excerpt_or_data: item.relevant_excerpt_or_data ?? null,
  lineage_id: item.lineage_id ?? "LIN-UNKNOWN",
  independence_group: item.independence_group ?? "IG-UNKNOWN",
  relationship_type: item.relationship_type ?? "UNKNOWN_PROVENANCE",
  assessment: item.assessment ?? "UNASSESSED",
}));
const outputPath = path.join(CASES_DIR, `${caseId}.evidence-candidates.json`);
fs.writeFileSync(outputPath, `${JSON.stringify({ case_id: caseId, candidates }, null, 2)}\n`, "utf8");
console.log(`✓ Candidatos preparados: ${candidates.length}`);
console.log(`✓ Archivo: ${outputPath}`);
console.log("⚠ Preparar candidatos no equivale a aceptarlos como evidencia.");
