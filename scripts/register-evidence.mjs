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
const claimId = arg("--claim");
const sourceId = arg("--source");
const document = arg("--document");
const role = arg("--role") ?? "PUBLICATION";
const assessment = arg("--assessment") ?? "UNASSESSED";
const lineage = arg("--lineage") ?? "LIN-UNKNOWN";
const independence = arg("--independence") ?? "IG-UNKNOWN";

if (!caseId || !claimId || !document || !sourceId) {
  console.error("Uso: npm run evidence -- --case CASE-######## --claim CLM-######## --source SRC-######## --document \"documento\" [--role PUBLICATION] [--lineage LIN-########] [--independence IG-########]");
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
  console.error(`✖ Caso JSON inválido: ${error.message}`);
  process.exit(1);
}

if (!Array.isArray(record.claims) || !record.claims.some((claim) => claim.claim_id === claimId)) {
  console.error(`✖ No existe el claim ${claimId} en ${caseId}.`);
  process.exit(1);
}

const validRoles = new Set(["DISCOVERY", "PUBLICATION", "CORROBORATION", "CONTEXT"]);
const validAssessments = new Set(["UNASSESSED", "SUPPORTS", "PARTIALLY_SUPPORTS", "DOES_NOT_SUPPORT", "CONTESTS", "SUPERSEDED"]);
if (!validRoles.has(role)) {
  console.error(`✖ Rol de fuente inválido: ${role}`);
  process.exit(1);
}
if (!validAssessments.has(assessment)) {
  console.error(`✖ Evaluación inválida: ${assessment}`);
  process.exit(1);
}

const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const next = evidence.length + 1;
const evidenceId = `EVD-${String(next).padStart(8, "0")}`;

if (evidence.some((item) => item.evidence_id === evidenceId)) {
  console.error(`✖ Ya existe ${evidenceId}.`);
  process.exit(1);
}

record.evidence = [
  ...evidence,
  {
    evidence_id: evidenceId,
    claim_id: claimId,
    source_id: sourceId,
    source_role: role,
    document_or_record: document,
    observed_at: new Date().toISOString(),
    published_at: null,
    evidence_role: role === "CORROBORATION" ? "INDEPENDENT_CORROBORATION_CANDIDATE" : "CLAIM_SUPPORT",
    provenance_status: "UNKNOWN",
    independence_group: independence,
    lineage_id: lineage,
    assessment,
  },
];

record.workflow = { ...(record.workflow ?? {}), evidence: "REGISTERED" };
record.status = "INVESTIGATING";
record.publication = {
  allowed: false,
  reason: "Registrar evidencia no equivale a completar la verificación.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — EVIDENCE ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Claim: ${claimId}`);
console.log(`✓ Evidencia registrada: ${evidenceId}`);
console.log(`✓ Evaluación: ${assessment}`);
console.log("⚠ La evidencia queda registrada, pero la verificación final sigue pendiente.");
