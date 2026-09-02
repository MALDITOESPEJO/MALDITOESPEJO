#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
if (!caseId) { console.error("Uso: npm run independence:enforce -- --case CASE-########"); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`✖ No existe el caso: ${caseId}`); process.exit(1); }
let record;
try { record = JSON.parse(fs.readFileSync(casePath, "utf8")); } catch (error) { console.error(`✖ JSON inválido: ${error.message}`); process.exit(1); }

const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const groups = new Map();
for (const item of evidence) {
  const group = item.independence_group || "IG-UNKNOWN";
  if (!groups.has(group)) groups.set(group, []);
  groups.get(group).push(item);
}

const findings = [];
const nonIndependentEvidence = new Set();
for (const [group, items] of groups) {
  if (group === "IG-UNKNOWN" || group === "UNKNOWN") {
    findings.push({ type: "UNKNOWN_INDEPENDENCE", independence_group: group, evidence_ids: items.map((item) => item.evidence_id), action: "DO_NOT_COUNT_AS_INDEPENDENT_CORROBORATION" });
    continue;
  }
  if (items.length < 2) continue;
  const reproductive = items.some((item) => ["REPRODUCES", "QUOTES", "DERIVED_FROM", "AGGREGATES"].includes(item.relationship_type));
  const sameLineage = new Set(items.map((item) => item.lineage_id || "LIN-UNKNOWN")).size === 1;
  if (reproductive || sameLineage) {
    for (const item of items.slice(1)) nonIndependentEvidence.add(item.evidence_id);
    findings.push({ type: "SHARED_PROVENANCE", independence_group: group, evidence_ids: items.map((item) => item.evidence_id), action: "COUNT_AS_ONE_EVIDENCE_LINE_FOR_CORROBORATION" });
  }
}

const independentCandidates = evidence.filter((item) => item.relationship_type === "INDEPENDENT_OBSERVATION" && item.independence_group && item.independence_group !== "IG-UNKNOWN");
const status = findings.some((item) => item.type === "UNKNOWN_INDEPENDENCE") ? "UNKNOWN_INDEPENDENCE" : findings.length ? "SHARED_PROVENANCE" : independentCandidates.length ? "INDEPENDENCE_ESTABLISHED" : "UNKNOWN_INDEPENDENCE";

record.source_independence = {
  assessed_at: new Date().toISOString(),
  status,
  findings,
  independent_candidates: independentCandidates.map((item) => item.evidence_id),
  excluded_from_independent_count: [...nonIndependentEvidence],
  rule: "Las reproducciones, citas, agregaciones o evidencias del mismo linaje no crean corroboración independiente.",
  human_review_required: findings.length > 0 || independentCandidates.length > 0,
};
record.workflow = { ...(record.workflow ?? {}), source_independence: status === "INDEPENDENCE_ESTABLISHED" ? "ASSESSED_REVIEW_REQUIRED" : "NO_INDEPENDENT_CORROBORATION_COUNTED" };
record.publication = { allowed: false, reason: "La independencia de las fuentes no sustituye la verificación ni la aprobación editorial." };
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — SOURCE INDEPENDENCE ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Líneas de evidencia: ${groups.size}`);
console.log(`Hallazgos: ${findings.length}`);
console.log(`Candidatos independientes: ${independentCandidates.length}`);
console.log(`Evidencias no contadas como independientes: ${nonIndependentEvidence.size}`);
console.log(`Estado: ${status}`);
