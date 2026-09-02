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
const inputPath = arg("--input");

if (!caseId || !inputPath) {
  console.error("Uso: npm run evidence:accept -- --case CASE-######## --input ruta/candidates.json");
  process.exit(1);
}

const caseFile = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(caseFile)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}
if (!fs.existsSync(inputPath)) {
  console.error(`✖ No existe el archivo de candidatos: ${inputPath}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(caseFile, "utf8"));
const payload = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const candidates = Array.isArray(payload.candidates) ? payload.candidates : [];

if (!candidates.length) {
  console.error("✖ No hay candidatos para evaluar.");
  process.exit(1);
}

const claims = new Set((record.claims ?? []).map((c) => c.claim_id));
const allowedRoles = new Set(["DISCOVERY", "PUBLICATION", "CORROBORATION", "CONTEXT"]);
const allowedAssessments = new Set([
  "UNASSESSED",
  "SUPPORTS",
  "PARTIALLY_SUPPORTS",
  "DOES_NOT_SUPPORT",
  "CONTESTS",
  "SUPERSEDED",
]);

const accepted = [];
const pending = [];
const rejected = [];

for (const candidate of candidates) {
  const problems = [];
  if (!claims.has(candidate.claim_id)) problems.push("claim_id no existe en el caso");
  if (!candidate.source_id) problems.push("falta source_id");
  if (!candidate.url_or_reference) problems.push("falta url_or_reference");
  if (!candidate.document_or_record) problems.push("falta document_or_record");
  if (!candidate.relevant_excerpt_or_data) problems.push("falta relevant_excerpt_or_data");
  if (candidate.source_role && !allowedRoles.has(candidate.source_role)) problems.push("source_role inválido");
  if (candidate.assessment && !allowedAssessments.has(candidate.assessment)) problems.push("assessment inválido");

  const assessment = candidate.assessment ?? "UNASSESSED";
  const role = candidate.source_role ?? "CONTEXT";

  if (problems.length) {
    pending.push({ ...candidate, status: "PENDING_REVIEW", problems });
    continue;
  }

  // Search results never become accepted supporting evidence merely because
  // they have a title, URL or snippet. Explicit assessment is mandatory.
  if (assessment === "UNASSESSED") {
    pending.push({ ...candidate, status: "PENDING_REVIEW", problems: ["requiere evaluación editorial explícita"] });
    continue;
  }

  accepted.push({
    evidence_id: candidate.evidence_id ?? null,
    claim_id: candidate.claim_id,
    source_id: candidate.source_id,
    source_role: role,
    document_or_record: candidate.document_or_record,
    url_or_reference: candidate.url_or_reference,
    published_at: candidate.published_at ?? null,
    observed_at: candidate.observed_at ?? new Date().toISOString(),
    relevant_excerpt_or_data: candidate.relevant_excerpt_or_data,
    lineage_id: candidate.lineage_id ?? "LIN-UNKNOWN",
    independence_group: candidate.independence_group ?? "IG-UNKNOWN",
    relationship_type: candidate.relationship_type ?? "UNKNOWN_PROVENANCE",
    assessment,
    accepted_at: new Date().toISOString(),
  });
}

record.evidence = Array.isArray(record.evidence) ? record.evidence : [];
let next = record.evidence.length + 1;
for (const item of accepted) {
  if (!item.evidence_id) {
    item.evidence_id = `EVD-${String(next).padStart(8, "0")}`;
    next += 1;
  }
}
record.evidence.push(...accepted);

record.evidence_acceptance = {
  assessed_at: new Date().toISOString(),
  candidates_received: candidates.length,
  accepted: accepted.length,
  pending_review: pending.length,
  rejected: rejected.length,
  rule: "Un resultado de búsqueda no se convierte en evidencia por relevancia, ranking, título o snippet. La aceptación requiere información documental suficiente y evaluación explícita.",
};

record.workflow = record.workflow ?? {};
record.workflow.evidence = accepted.length ? "REGISTERED_REQUIRES_PROVENANCE_CHECK" : "AWAITING_EVIDENCE_REVIEW";
record.workflow.provenance = "PENDING_CHECK";
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: "La evidencia aceptada todavía debe superar procedencia, contraste, verificación y aprobación editorial humana.",
};

fs.writeFileSync(caseFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");

const out = {
  case_id: caseId,
  accepted,
  pending_review: pending,
  rejected,
};
const outputPath = path.join(path.dirname(inputPath), `${path.basename(inputPath, path.extname(inputPath))}.accepted.json`);
fs.writeFileSync(outputPath, `${JSON.stringify(out, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — EVIDENCE ACCEPTANCE ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Candidatos: ${candidates.length}`);
console.log(`✓ Aceptados: ${accepted.length}`);
console.log(`⚠ Pendientes de revisión: ${pending.length}`);
console.log("⚠ La aceptación no equivale a verificación ni autoriza publicación.");
console.log(`✓ Resultado: ${outputPath}`);
