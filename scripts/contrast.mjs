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
  console.error("Uso: npm run contrast -- --case CASE-########");
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

const claims = Array.isArray(record.claims) ? record.claims : [];
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const contradictions = [];
const assessments = [];

for (const claim of claims) {
  const linked = evidence.filter((item) => item.claim_id === claim.claim_id);
  const supporting = linked.filter((item) => item.assessment === "SUPPORTS");
  const partial = linked.filter((item) => item.assessment === "PARTIALLY_SUPPORTS");
  const opposing = linked.filter((item) => item.assessment === "CONTESTS" || item.assessment === "DOES_NOT_SUPPORT");
  const independentCandidates = linked.filter((item) => item.relationship_type === "INDEPENDENT_OBSERVATION");

  const result = opposing.length
    ? "CONTESTED"
    : supporting.length
      ? "SUPPORTED"
      : partial.length
        ? "PARTIALLY_SUPPORTED"
        : "INSUFFICIENT";

  const material = opposing.length > 0;
  if (material) {
    contradictions.push({
      claim_id: claim.claim_id,
      material: true,
      status: "UNRESOLVED",
      evidence_ids: opposing.map((item) => item.evidence_id),
    });
  }

  assessments.push({
    claim_id: claim.claim_id,
    result,
    supporting_evidence: supporting.map((item) => item.evidence_id),
    partial_evidence: partial.map((item) => item.evidence_id),
    opposing_evidence: opposing.map((item) => item.evidence_id),
    independent_candidates: independentCandidates.map((item) => item.evidence_id),
  });
}

record.contrast = {
  assessed_at: new Date().toISOString(),
  claims: assessments,
  material_contradiction_found: contradictions.length > 0,
};
record.contradictions = {
  material_conflict_found: contradictions.length > 0,
  status: contradictions.length > 0 ? "UNRESOLVED" : "NO_MATERIAL_CONTRADICTION_IDENTIFIED",
  items: contradictions,
};
record.workflow = {
  ...(record.workflow ?? {}),
  contrast: contradictions.length > 0 ? "CONFLICT_REQUIRES_REVIEW" : "CONTRAST_ASSESSED",
};
record.status = contradictions.length > 0 ? "CONTESTED" : "INVESTIGATING";
record.publication = {
  allowed: false,
  reason: contradictions.length > 0
    ? "Existe una contradicción material pendiente de resolución."
    : "El contraste no sustituye la verificación ni la aprobación editorial.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — CONTRAST ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Claims evaluados: ${assessments.length}`);
console.log(`Contradicciones materiales: ${contradictions.length}`);
for (const item of assessments) console.log(`- ${item.claim_id}: ${item.result}`);
if (contradictions.length) {
  console.log("\n✖ CASO EN CONFLICTO: requiere revisión antes de avanzar.");
} else {
  console.log("\n✓ Contraste estructural completado.");
}
console.log("⚠ El contraste no declara por sí solo que un claim sea verdadero.");
