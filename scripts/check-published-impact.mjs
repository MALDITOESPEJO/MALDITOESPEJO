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
  console.error("Uso: npm run impact:published -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const calculations = Array.isArray(record.calculations) ? record.calculations : [];
const trace = record.article_traceability?.sentences ?? [];
const impact = record.editorial_impact ?? null;

const changedEvidence = new Set(
  evidence
    .filter((item) => ["SUPERSEDED", "CONTESTS", "RECHECK_REQUIRED", "STALE", "INVALID"].includes(item.assessment) || item.status === "SUPERSEDED")
    .map((item) => item.evidence_id)
    .filter(Boolean),
);

if (!changedEvidence.size && !impact) {
  record.published_article_review = {
    checked_at: new Date().toISOString(),
    status: "NO_IMPACT",
    changed_evidence_ids: [],
    affected_claim_ids: [],
    affected_sentence_ids: [],
    affected_calculation_ids: [],
    recommendation: "No se ha identificado un cambio material documentado que active una revisión automática.",
    human_review_required: false,
  };
  fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
  console.log("MALDITOESPEJO — PUBLISHED ARTICLE REVIEW");
  console.log("Estado: NO_IMPACT");
  process.exit(0);
}

const affectedClaims = new Set();
for (const item of evidence) {
  if (changedEvidence.has(item.evidence_id) && item.claim_id) affectedClaims.add(item.claim_id);
}

const affectedSentences = trace
  .filter((item) => (item.evidence_ids ?? []).some((id) => changedEvidence.has(id)) || (item.claim_ids ?? []).some((id) => affectedClaims.has(id)))
  .map((item) => item.sentence_id)
  .filter(Boolean);

const affectedCalculations = calculations
  .filter((calc) =>
    (calc.input_evidence_ids ?? []).some((id) => changedEvidence.has(id)) ||
    (calc.evidence_ids ?? []).some((id) => changedEvidence.has(id)) ||
    (calc.input_claim_ids ?? []).some((id) => affectedClaims.has(id)),
  )
  .map((calc) => calc.calculation_id)
  .filter(Boolean);

const headlineOrDekAffected = affectedSentences.some((id) => id === "SEN-00000001" || id === "SEN-00000002");
const status = headlineOrDekAffected ? "CORRECTION_REQUIRED" : "REVIEW_REQUIRED";

record.published_article_review = {
  checked_at: new Date().toISOString(),
  status,
  changed_evidence_ids: [...changedEvidence],
  affected_claim_ids: [...affectedClaims],
  affected_sentence_ids: affectedSentences,
  affected_calculation_ids: affectedCalculations,
  recommendation: headlineOrDekAffected
    ? "La evidencia modificada afecta al titular o a la entradilla. Revisión editorial obligatoria antes de mantener la pieza como publicada."
    : "La evidencia modificada afecta a contenido publicado. Revisar los elementos identificados antes de considerar la pieza revalidada.",
  human_review_required: true,
  rule: "Un cambio material en evidencia no se considera resuelto automáticamente; debe propagarse y ser evaluado por un editor.",
};
record.workflow = { ...(record.workflow ?? {}), published_article_review: status };

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — PUBLISHED ARTICLE REVIEW");
console.log(`Caso: ${caseId}`);
console.log(`Evidencias modificadas: ${changedEvidence.size}`);
console.log(`Claims afectados: ${affectedClaims.size}`);
console.log(`Frases afectadas: ${affectedSentences.length}`);
console.log(`Cálculos afectados: ${affectedCalculations.length}`);
console.log(`Estado: ${status}`);
console.log("Decisión editorial: REQUERIDA");

process.exitCode = 2;
