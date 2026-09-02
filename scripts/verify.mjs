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
const sufficiencyClaims = new Map((record.evidence_sufficiency?.claims ?? []).map((item) => [item.claim_id, item]));
const temporalClaims = new Map((record.temporal_verification?.claims ?? []).map((item) => [item.claim_id, item]));
const centralClaims = claims.filter((claim) => claim.importance === "CENTRAL" || !claim.importance);
const assessments = [];

function hasTemporalData(item) {
  return Boolean(item.published_at || item.observed_at || item.effective_at);
}

function temporalRequirementMissing(claim, linked) {
  if (!linked.length) return false;
  const temporalSensitive = claim.temporal_requirement === true || /actual|actualmente|hoy|ahora|vigente|current|today|now/i.test(claim.claim ?? "");
  return temporalSensitive && linked.some((item) => !hasTemporalData(item));
}

for (const claim of claims) {
  const linked = evidence.filter((item) => item.claim_id === claim.claim_id);
  const supporting = linked.filter((item) => item.assessment === "SUPPORTS");
  const incompleteEvidence = linked.filter((item) => !item.source_id || !item.document_or_record || !item.evidence_id);
  const provenanceUnknown = linked.some((item) => item.provenance_status === "UNKNOWN" || !item.provenance_status);
  const temporalMissing = temporalRequirementMissing(claim, linked);
  const contrast = contrastClaims.get(claim.claim_id);
  const sufficiency = sufficiencyClaims.get(claim.claim_id);
  const temporal = temporalClaims.get(claim.claim_id);
  const materialConflict = Boolean(record.contradictions?.items?.some((item) => item.claim_id === claim.claim_id && item.material));

  let status = "INSUFFICIENT";
  let reason = "No existe evidencia suficiente vinculada a la afirmación.";

  if (materialConflict || contrast?.result === "CONTESTED" || sufficiency?.status === "CONTESTED" || temporal?.status === "TEMPORALLY_CONTESTED") {
    status = "CONTESTED";
    reason = "Existe una contradicción material, documental o temporal no resuelta.";
  } else if (incompleteEvidence.length) {
    status = "RECHECK_REQUIRED";
    reason = "La evidencia vinculada no conserva todos los datos documentales necesarios.";
  } else if (temporal?.status === "STALE_EVIDENCE" || temporal?.status === "SUPERSEDED") {
    status = "RECHECK_REQUIRED";
    reason = "La evidencia temporalmente relevante está desactualizada o ha sido sustituida.";
  } else if (temporal?.status === "PARTIALLY_TIME_ALIGNED" || temporal?.status === "TEMPORALLY_UNASSESSED") {
    status = "RECHECK_REQUIRED";
    reason = "La adecuación temporal de la evidencia no está completamente establecida.";
  } else if (temporalMissing) {
    status = "RECHECK_REQUIRED";
    reason = "La afirmación requiere control temporal y la evidencia no conserva información temporal suficiente.";
  } else if (centralClaims.includes(claim) && provenanceUnknown && linked.length > 0) {
    status = "RECHECK_REQUIRED";
    reason = "La procedencia de la evidencia central es desconocida o incompleta.";
  } else if (sufficiency?.status === "INSUFFICIENT") {
    status = "RECHECK_REQUIRED";
    reason = "La evaluación documental considera insuficiente el respaldo del claim.";
  } else if (sufficiency?.status === "PARTIALLY_SUFFICIENT" || contrast?.result === "PARTIALLY_SUPPORTED") {
    status = "PARTIALLY_VERIFIED";
    reason = "La evidencia solo respalda parcialmente la afirmación.";
  } else if (contrast?.result === "INSUFFICIENT") {
    status = "INSUFFICIENT";
    reason = "El contraste considera insuficiente el respaldo disponible.";
  } else if (!supporting.length) {
    status = "INSUFFICIENT";
    reason = "No existe evidencia evaluada como SUPPORTS.";
  } else if (sufficiency?.status === "SUFFICIENT" && ["CURRENTLY_SUPPORTED", "HISTORICALLY_SUPPORTED", undefined].includes(temporal?.status)) {
    status = "VERIFIED";
    reason = "La evidencia es documentalmente suficiente, temporalmente compatible y no consta un conflicto material pendiente.";
  } else {
    status = "VERIFIED";
    reason = "Existe evidencia de apoyo, trazabilidad documental y no consta un conflicto material pendiente.";
  }

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
    evidence_ids: linked.map((item) => item.evidence_id).filter(Boolean),
    sufficiency_status: sufficiency?.status ?? "UNASSESSED",
    temporal_status: temporal?.status ?? "UNASSESSED",
  });
}

const verifiedClaims = assessments.filter((item) => item.status === "VERIFIED");
const blocking = assessments.filter((item) =>
  ["CONTESTED", "RECHECK_REQUIRED", "INSUFFICIENT"].includes(item.status) &&
  (item.importance === "CENTRAL" || item.type === "FACT" || item.type === "STATEMENT")
);

const allCentralVerified = centralClaims.length > 0 && centralClaims.every((claim) => {
  const assessment = assessments.find((item) => item.claim_id === claim.claim_id);
  return assessment?.status === "VERIFIED";
});

const hasPublishableScope = verifiedClaims.length > 0;
const hasMaterialContest = blocking.some((item) => item.status === "CONTESTED");

let verificationStatus;
if (allCentralVerified && !blocking.length) {
  verificationStatus = "VERIFIED";
} else if (hasPublishableScope) {
  verificationStatus = "PARTIALLY_VERIFIED";
} else if (hasMaterialContest) {
  verificationStatus = "CONTESTED";
} else {
  verificationStatus = "RECHECK_REQUIRED";
}

record.verification = {
  assessed_at: new Date().toISOString(),
  status: verificationStatus,
  completed: hasPublishableScope,
  claims: assessments,
  verified_claims: verifiedClaims.map((item) => item.claim_id),
  blocking_claims: blocking.map((item) => item.claim_id),
  human_approval: false,
};

record.publishable_scope = {
  status: hasPublishableScope ? "AVAILABLE" : "NONE",
  claim_ids: verifiedClaims.map((item) => item.claim_id),
  rule: "Solo pueden publicarse como hechos las afirmaciones con estado VERIFIED. Las demás quedan fuera del alcance factual de la pieza y no pueden presentarse como hechos verificados.",
};

record.workflow = {
  ...(record.workflow ?? {}),
  verification: verificationStatus,
};

if (verificationStatus === "VERIFIED") {
  record.status = "VERIFIED";
} else if (verificationStatus === "PARTIALLY_VERIFIED") {
  record.status = "EDITOR_REVIEW";
} else if (verificationStatus === "CONTESTED") {
  record.status = "CONTESTED";
} else {
  record.status = "RECHECK_REQUIRED";
}

record.publication = {
  allowed: false,
  reason: hasPublishableScope
    ? "Existe un alcance de afirmaciones verificadas que puede convertirse en una pieza limitada, pero requiere controles finales y aprobación editorial humana."
    : "No existe un alcance factual verificado suficiente para redactar una pieza publicable.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — VERIFICATION ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Claims evaluados: ${assessments.length}`);
for (const item of assessments) console.log(`- ${item.claim_id}: ${item.status}`);
console.log(`\nEstado de verificación: ${verificationStatus}`);
console.log(`Claims verificadas publicables: ${verifiedClaims.length}`);
console.log(`Alcance publicable: ${hasPublishableScope ? "DISPONIBLE" : "NINGUNO"}`);
console.log("Aprobación humana: PENDIENTE");
console.log("Publicación: BLOQUEADA");

if (!hasPublishableScope) process.exitCode = 2;
