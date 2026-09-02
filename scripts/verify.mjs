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
  console.error("Uso: npm run verify -- --case CASE-########");
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
const contrastClaims = new Map((record.contrast?.claims ?? []).map((item) => [item.claim_id, item]));
const centralClaims = claims.filter((claim) => claim.importance === "CENTRAL" || !claim.importance);
const assessments = [];

for (const claim of claims) {
  const linked = evidence.filter((item) => item.claim_id === claim.claim_id);
  const supporting = linked.filter((item) => item.assessment === "SUPPORTS");
  const incompleteEvidence = linked.filter((item) => !item.source_id || !item.document_or_record);
  const provenanceUnknown = linked.some((item) => item.provenance_status === "UNKNOWN" || !item.provenance_status);
  const contrast = contrastClaims.get(claim.claim_id);
  const materialConflict = Boolean(record.contradictions?.items?.some((item) => item.claim_id === claim.claim_id && item.material));

  let status = "INSUFFICIENT";
  let reason = "No existe evidencia suficiente vinculada a la afirmación.";

  // Contradictions and incomplete documentary records always take precedence.
  if (materialConflict || contrast?.result === "CONTESTED") {
    status = "CONTESTED";
    reason = "Existe una contradicción material no resuelta.";
  } else if (incompleteEvidence.length) {
    status = "RECHECK_REQUIRED";
    reason = "La evidencia vinculada no conserva todos los datos documentales necesarios.";
  } else if (centralClaims.includes(claim) && provenanceUnknown && linked.length > 0) {
    status = "RECHECK_REQUIRED";
    reason = "La procedencia de la evidencia central es desconocida o incompleta.";
  } else if (contrast?.result === "PARTIALLY_SUPPORTED") {
    status = "PARTIALLY_VERIFIED";
    reason = "La evidencia solo respalda parcialmente la afirmación.";
  } else if (contrast?.result === "INSUFFICIENT") {
    status = "INSUFFICIENT";
    reason = "El contraste considera insuficiente el respaldo disponible.";
  } else if (!supporting.length) {
    status = "INSUFFICIENT";
    reason = "No existe evidencia evaluada como SUPPORTS.";
  } else {
    status = "VERIFIED";
    reason = "Existe evidencia de apoyo, trazabilidad documental y no consta un conflicto material pendiente.";
  }

  // Claims explicitly marked UNKNOWN/PENDING are never promoted to verified facts.
  if (["UNKNOWN", "PENDING"].includes(claim.type)) {
    status = status === "CONTESTED" ? status : "INSUFFICIENT";
    reason = "La afirmación está marcada como UNKNOWN/PENDING y no puede convertirse automáticamente en un hecho verificado.";
  }

  assessments.push({
    claim_id: claim.claim_id,
    type: claim.type,
    importance: claim.importance ?? "CENTRAL",
    status,
    reason,
    evidence_ids: linked.map((item) => item.evidence_id),
  });
}

const blocking = assessments.filter((item) =>
  ["CONTESTED", "RECHECK_REQUIRED", "INSUFFICIENT"].includes(item.status) &&
  (item.importance === "CENTRAL" || item.type === "FACT" || item.type === "STATEMENT")
);

const allCentralVerified = centralClaims.length > 0 && centralClaims.every((claim) => {
  const assessment = assessments.find((item) => item.claim_id === claim.claim_id);
  return assessment?.status === "VERIFIED";
});

const verificationStatus = blocking.length
  ? blocking.some((item) => item.status === "CONTESTED") ? "CONTESTED" : "RECHECK_REQUIRED"
  : allCentralVerified ? "VERIFIED" : "INSUFFICIENT";

record.verification = {
  assessed_at: new Date().toISOString(),
  status: verificationStatus,
  completed: verificationStatus === "VERIFIED",
  claims: assessments,
  blocking_claims: blocking.map((item) => item.claim_id),
  human_approval: false,
};

record.workflow = {
  ...(record.workflow ?? {}),
  verification: verificationStatus,
};

if (verificationStatus === "VERIFIED") {
  record.status = "VERIFIED";
} else if (verificationStatus === "CONTESTED") {
  record.status = "CONTESTED";
} else {
  record.status = "RECHECK_REQUIRED";
}

record.publication = {
  allowed: false,
  reason: "La verificación automática no sustituye la revisión ni la aprobación editorial humana.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — VERIFICATION ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Claims evaluados: ${assessments.length}`);
for (const item of assessments) console.log(`- ${item.claim_id}: ${item.status}`);
console.log(`\nEstado de verificación: ${verificationStatus}`);
console.log("Aprobación humana: PENDIENTE");
console.log("Publicación: BLOQUEADA");

if (verificationStatus !== "VERIFIED") process.exitCode = 2;
