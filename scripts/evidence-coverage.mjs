#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
if (!caseId) { console.error("Uso: npm run evidence:coverage -- --case CASE-########"); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`✖ No existe el caso: ${caseId}`); process.exit(1); }
let record;
try { record = JSON.parse(fs.readFileSync(casePath, "utf8")); } catch (error) { console.error(`✖ JSON inválido: ${error.message}`); process.exit(1); }

const claims = Array.isArray(record.claims) ? record.claims : [];
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const sufficiency = new Map((record.evidence_sufficiency?.claims ?? []).map((item) => [item.claim_id, item.status]));
const verification = new Map((record.verification?.claims ?? []).map((item) => [item.claim_id, item.status]));
const approved = new Set(record.publishable_scope?.claim_ids ?? record.verification?.verified_claims ?? []);
const coverage = [];

for (const claim of claims) {
  const linked = evidence.filter((item) => item.claim_id === claim.claim_id);
  const sufficientStatus = sufficiency.get(claim.claim_id);
  const verificationStatus = verification.get(claim.claim_id);
  const supporting = linked.filter((item) => item.assessment === "SUPPORTS");
  const partial = linked.filter((item) => item.assessment === "PARTIALLY_SUPPORTS");
  const opposing = linked.filter((item) => item.assessment === "CONTESTS" || item.assessment === "DOES_NOT_SUPPORT");
  let status = "UNCOVERED";
  let reason = "No documentary evidence linked to the claim.";
  if (opposing.length) { status = "CONTESTED"; reason = "Existe evidencia incompatible pendiente."; }
  else if (verificationStatus === "VERIFIED" && sufficientStatus === "SUFFICIENT" && supporting.length) { status = "COVERED"; reason = "El claim tiene evidencia de apoyo suficiente y verificación compatible."; }
  else if (partial.length || sufficientStatus === "PARTIALLY_SUFFICIENT" || verificationStatus === "PARTIALLY_VERIFIED") { status = "PARTIALLY_COVERED"; reason = "Existe apoyo, pero no permite afirmar el claim con alcance completo."; }
  coverage.push({ claim_id: claim.claim_id, importance: claim.importance ?? claim.priority ?? "UNSPECIFIED", status, evidence_ids: linked.map((item) => item.evidence_id), verification_status: verificationStatus ?? "UNASSESSED", sufficiency_status: sufficientStatus ?? "UNASSESSED", in_publishable_scope: approved.has(claim.claim_id), reason });
}

const critical = coverage.filter((item) => ["CENTRAL", "HIGH", "MATERIAL"].includes(String(item.importance).toUpperCase()));
const criticalGaps = critical.filter((item) => ["UNCOVERED", "CONTESTED"].includes(item.status));
const coveredCount = coverage.filter((item) => item.status === "COVERED").length;
const partialCount = coverage.filter((item) => item.status === "PARTIALLY_COVERED").length;
const status = criticalGaps.length ? (criticalGaps.some((item) => item.status === "CONTESTED") ? "CONTESTED_COVERAGE" : "CRITICAL_GAP") : partialCount ? "PARTIALLY_COVERED" : "FULLY_COVERED";

record.evidence_coverage = {
  assessed_at: new Date().toISOString(),
  status,
  claims: coverage,
  totals: { claims: coverage.length, covered: coveredCount, partially_covered: partialCount, critical_gaps: criticalGaps.length },
  critical_gap_claim_ids: criticalGaps.map((item) => item.claim_id),
  publication_rule: criticalGaps.length ? "REDUCE_SCOPE_OR_CONTINUE_INVESTIGATION" : "ONLY_COVERED_CLAIMS_MAY_ENTER_AS_FACTS",
  human_review_required: status !== "FULLY_COVERED",
};
record.workflow = { ...(record.workflow ?? {}), evidence_coverage: status };
record.publication = { allowed: false, reason: criticalGaps.length ? "Existen huecos documentales críticos." : "La cobertura documental no sustituye la aprobación editorial." };
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — EVIDENCE COVERAGE ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Claims: ${coverage.length} | Cubiertos: ${coveredCount} | Parciales: ${partialCount} | Huecos críticos: ${criticalGaps.length}`);
console.log(`Estado: ${status}`);
console.log(status === "FULLY_COVERED" ? "✓ Cobertura completa según los controles disponibles." : "⚠ Revisión o reducción de alcance necesaria.");
