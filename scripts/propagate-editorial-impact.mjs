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
  console.error("Uso: npm run impact:propagate -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const claims = Array.isArray(record.claims) ? record.claims : [];
const calculations = Array.isArray(record.calculations) ? record.calculations : [];
const traceSentences = Array.isArray(record.article_traceability?.sentences)
  ? record.article_traceability.sentences
  : [];

const affectedEvidenceIds = new Set();
const reasons = [];

for (const item of evidence) {
  const material = ["SUPERSEDED", "CONTESTS", "DOES_NOT_SUPPORT"].includes(item.assessment)
    || ["SUPERSEDED", "CONTESTED"].includes(item.provenance_status)
    || Boolean(item.supersedes_id)
    || Boolean(item.recheck_required);
  if (material) {
    affectedEvidenceIds.add(item.evidence_id);
    reasons.push({ type: "EVIDENCE", id: item.evidence_id, reason: item.assessment ?? item.provenance_status ?? "MATERIAL_CHANGE" });
  }
}

const affectedClaimIds = new Set();
for (const item of evidence) {
  if (affectedEvidenceIds.has(item.evidence_id) && item.claim_id) affectedClaimIds.add(item.claim_id);
}

const dependencies = Array.isArray(record.claim_dependencies) ? record.claim_dependencies : [];
let changed = true;
while (changed) {
  changed = false;
  for (const dep of dependencies) {
    if (affectedClaimIds.has(dep.depends_on_claim_id) && !affectedClaimIds.has(dep.claim_id)) {
      affectedClaimIds.add(dep.claim_id);
      changed = true;
    }
  }
}

const affectedCalculationIds = new Set();
for (const calc of calculations) {
  const inputClaims = Array.isArray(calc.input_claim_ids) ? calc.input_claim_ids : [];
  const inputEvidence = Array.isArray(calc.input_evidence_ids) ? calc.input_evidence_ids : [];
  if (inputClaims.some((id) => affectedClaimIds.has(id)) || inputEvidence.some((id) => affectedEvidenceIds.has(id))) {
    affectedCalculationIds.add(calc.calculation_id);
  }
}

const affectedSentenceIds = new Set();
for (const sentence of traceSentences) {
  const claimIds = Array.isArray(sentence.claim_ids) ? sentence.claim_ids : [];
  const evidenceIds = Array.isArray(sentence.evidence_ids) ? sentence.evidence_ids : [];
  const calculationIds = Array.isArray(sentence.calculation_ids) ? sentence.calculation_ids : [];
  if (
    claimIds.some((id) => affectedClaimIds.has(id)) ||
    evidenceIds.some((id) => affectedEvidenceIds.has(id)) ||
    calculationIds.some((id) => affectedCalculationIds.has(id))
  ) {
    affectedSentenceIds.add(sentence.sentence_id);
  }
}

const centralClaimId = claims.find((claim) => claim.importance === "CENTRAL")?.claim_id ?? null;
const centralImpact = (centralClaimId && affectedClaimIds.has(centralClaimId))
  || affectedSentenceIds.has("SEN-00000001");

let status = "NO_MATERIAL_IMPACT";
let level = "LEVEL_0";
if (affectedClaimIds.size || affectedEvidenceIds.size) {
  status = "IMPACT_REVIEW_REQUIRED";
  level = affectedClaimIds.size > 1 || affectedCalculationIds.size ? "LEVEL_2" : "LEVEL_1";
}
if (centralImpact) {
  status = "CENTRAL_IMPACT_REVIEW_REQUIRED";
  level = "LEVEL_3";
}
if (centralImpact && record.status === "PUBLISHED") {
  status = "CORRECTION_REVIEW_REQUIRED";
  level = "LEVEL_4";
}

record.editorial_impact = {
  assessed_at: new Date().toISOString(),
  status,
  level,
  affected_evidence_ids: [...affectedEvidenceIds],
  affected_claim_ids: [...affectedClaimIds],
  affected_calculation_ids: [...affectedCalculationIds],
  affected_sentence_ids: [...affectedSentenceIds],
  central_impact: centralImpact,
  reasons,
  rule: "Todo cambio material en evidencia debe propagarse hasta los claims, cálculos y frases dependientes antes de mantener la publicación.",
  human_editorial_review_required: status !== "NO_MATERIAL_IMPACT"
};

record.workflow = {
  ...(record.workflow ?? {}),
  editorial_impact: status
};

if (status !== "NO_MATERIAL_IMPACT") {
  record.publication = {
    ...(record.publication ?? {}),
    allowed: false,
    reason: "Existe impacto documental que requiere revisión editorial antes de continuar."
  };
}

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — EDITORIAL IMPACT PROPAGATION ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Evidencias afectadas: ${affectedEvidenceIds.size}`);
console.log(`Claims afectados: ${affectedClaimIds.size}`);
console.log(`Cálculos afectados: ${affectedCalculationIds.size}`);
console.log(`Frases afectadas: ${affectedSentenceIds.size}`);
console.log(`Impacto central: ${centralImpact ? "SÍ" : "NO"}`);
console.log(`Estado: ${status}`);

if (status !== "NO_MATERIAL_IMPACT") process.exitCode = 2;
