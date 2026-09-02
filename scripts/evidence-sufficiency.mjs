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
  console.error("Uso: npm run evidence:sufficiency -- --case CASE-########");
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
const authorities = record.source_authority?.sources ?? record.source_authority?.items ?? [];
const authorityBySource = new Map(authorities.map((item) => [item.source_id, item]));
const dependencies = Array.isArray(record.dependencies?.relations) ? record.dependencies.relations : [];

const assessed = [];
const blocking = [];

function linkedEvidence(claimId) {
  return evidence.filter((item) => item.claim_id === claimId);
}

function temporalMissing(claim, linked) {
  if (!linked.length) return false;
  const sensitive = claim.temporal_requirement === true || /actual|actualmente|hoy|ahora|vigente|current|today|now/i.test(claim.claim ?? "");
  return sensitive && linked.some((item) => !item.published_at && !item.observed_at && !item.effective_at);
}

function hasKnownProvenance(linked) {
  return linked.every((item) => item.provenance_status && item.provenance_status !== "UNKNOWN" && item.lineage_id && item.lineage_id !== "LIN-UNKNOWN");
}

function hasDocumentaryIdentity(linked) {
  return linked.every((item) => item.source_id && item.evidence_id && item.document_or_record && item.url_or_reference);
}

function sourceAuthorityAdequate(claim, linked) {
  if (!linked.length) return false;
  const classified = linked.map((item) => authorityBySource.get(item.source_id)).filter(Boolean);
  if (!classified.length) return true;
  if (claim.type === "FACT" && (claim.importance === "CENTRAL" || !claim.importance)) {
    return classified.some((item) => ["PRIMARY_DIRECT", "OFFICIAL_DIRECT", "DIRECT_STATEMENT"].includes(item.classification));
  }
  return classified.some((item) => !["REVIEW_REQUIRED", "UNRESOLVED"].includes(item.classification));
}

function dependenciesResolved(claimId) {
  const related = dependencies.filter((item) => item.claim_id === claimId || item.from_claim_id === claimId || item.source_claim_id === claimId);
  if (!related.length) return true;
  const verified = new Set(record.verification?.verified_claims ?? []);
  return related.every((item) => {
    const dependencyId = item.depends_on_claim_id ?? item.to_claim_id ?? item.dependency_claim_id;
    return !dependencyId || verified.has(dependencyId);
  });
}

for (const claim of claims) {
  const linked = linkedEvidence(claim.claim_id);
  const supporting = linked.filter((item) => item.assessment === "SUPPORTS");
  const partial = linked.filter((item) => item.assessment === "PARTIALLY_SUPPORTS");
  const contesting = linked.filter((item) => ["CONTESTS", "DOES_NOT_SUPPORT"].includes(item.assessment));
  const materialConflict = Boolean(record.contradictions?.items?.some((item) => item.claim_id === claim.claim_id && item.material));
  const temporal = temporalMissing(claim, linked);
  const provenance = hasKnownProvenance(linked);
  const documentary = hasDocumentaryIdentity(linked);
  const authority = sourceAuthorityAdequate(claim, linked);
  const dependencyOk = dependenciesResolved(claim.claim_id);

  let status = "UNASSESSED";
  let reason = "Todavía no existe información suficiente para evaluar la suficiencia documental.";

  if (!linked.length) {
    status = "UNASSESSED";
    reason = "No hay evidencia documental vinculada al claim.";
  } else if (materialConflict || contesting.length) {
    status = "CONTESTED";
    reason = "Existe evidencia contradictoria o una contradicción material pendiente.";
  } else if (!documentary) {
    status = "INSUFFICIENT";
    reason = "La evidencia no conserva una identificación documental completa.";
  } else if (!provenance) {
    status = "INSUFFICIENT";
    reason = "La procedencia de una o más evidencias no está suficientemente documentada.";
  } else if (temporal) {
    status = "INSUFFICIENT";
    reason = "La afirmación requiere control temporal y falta información temporal suficiente.";
  } else if (!authority) {
    status = "INSUFFICIENT";
    reason = "La autoridad de las fuentes identificadas no es suficiente para el alcance de la afirmación.";
  } else if (!dependencyOk) {
    status = "INSUFFICIENT";
    reason = "El claim depende de otra afirmación que todavía no está verificada.";
  } else if (supporting.length > 0) {
    status = "SUFFICIENT";
    reason = "Existe evidencia documental de apoyo, con procedencia y autoridad compatibles con el alcance del claim.";
  } else if (partial.length > 0) {
    status = "PARTIALLY_SUFFICIENT";
    reason = "La evidencia respalda solo una parte concreta de la afirmación.";
  } else {
    status = "INSUFFICIENT";
    reason = "No existe evidencia evaluada como respaldo suficiente.";
  }

  // A direct statement can establish the statement itself, but not its underlying truth.
  if (claim.type === "STATEMENT" && supporting.length > 0 && status === "SUFFICIENT") {
    reason = "La evidencia es suficiente para atribuir la declaración identificada; no demuestra por sí sola la verdad del contenido de esa declaración.";
  }

  const item = {
    claim_id: claim.claim_id,
    type: claim.type,
    importance: claim.importance ?? "CENTRAL",
    status,
    reason,
    evidence_ids: linked.map((item) => item.evidence_id).filter(Boolean),
    checks: {
      documentary_identity: documentary,
      provenance_known: provenance,
      source_authority_adequate: authority,
      temporal_requirement_satisfied: !temporal,
      dependencies_resolved: dependencyOk,
      supporting_evidence: supporting.length > 0,
      partial_support: partial.length > 0,
      contradiction_present: contesting.length > 0 || materialConflict,
    },
  };
  assessed.push(item);

  if (["INSUFFICIENT", "CONTESTED"].includes(status) && (claim.importance === "CENTRAL" || claim.type === "FACT")) {
    blocking.push(claim.claim_id);
  }
}

const sufficient = assessed.filter((item) => item.status === "SUFFICIENT");
const partial = assessed.filter((item) => item.status === "PARTIALLY_SUFFICIENT");
const contested = assessed.filter((item) => item.status === "CONTESTED");

record.evidence_sufficiency = {
  assessed_at: new Date().toISOString(),
  status: sufficient.length ? "ASSESSMENT_AVAILABLE" : "NO_SUFFICIENT_EVIDENCE",
  claims: assessed,
  sufficient_claims: sufficient.map((item) => item.claim_id),
  partially_sufficient_claims: partial.map((item) => item.claim_id),
  blocking_claims: blocking,
  contested_claims: contested.map((item) => item.claim_id),
  rule: "La suficiencia se determina por claim. EVIDENCIA ENCONTRADA no equivale a EVIDENCIA SUFICIENTE y la suficiencia no equivale a verdad material.",
};

record.workflow = record.workflow ?? {};
record.workflow.evidence_sufficiency = sufficient.length ? "SUFFICIENCY_ASSESSED" : "NO_SUFFICIENT_EVIDENCE";
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: "La suficiencia documental no sustituye la verificación ni la aprobación editorial humana.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — EVIDENCE SUFFICIENCY ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Claims evaluados: ${assessed.length}`);
for (const item of assessed) console.log(`- ${item.claim_id}: ${item.status}`);
console.log(`\nSuficientes: ${sufficient.length}`);
console.log(`Parcialmente suficientes: ${partial.length}`);
console.log(`Contestados: ${contested.length}`);
console.log(`Bloqueantes: ${blocking.length}`);
console.log("La suficiencia no equivale a verdad ni autoriza publicación.");

if (!assessed.length) process.exitCode = 2;
