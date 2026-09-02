#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const TYPES = new Set(["FACT", "STATEMENT", "CONTEXT", "UNKNOWN", "PENDING"]);
const PRIORITIES = new Set(["CENTRAL", "IMPORTANT", "CONTEXTUAL", "SECONDARY"]);
const STATUSES = new Set(["UNASSESSED", "INVESTIGATING", "SUPPORTED", "CONTESTED", "UNSUPPORTED", "UNKNOWN"]);

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
if (!caseId) {
  console.error("Uso: npm run claims -- --case CASE-########");
  process.exit(1);
}

if (!/^CASE-\d{8}$/.test(caseId)) {
  console.error("✖ Identificador de caso inválido.");
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

const input = record.input ?? {};
const reference = typeof input.input_reference === "string" ? input.input_reference.trim() : "";
if (!reference) {
  console.error("✖ El caso no contiene input_reference.");
  process.exit(1);
}

// This first executable version deliberately performs deterministic claim extraction only.
// It never invents facts or upgrades a statement to a fact.
const claims = [
  {
    claim_id: "CLM-00000001",
    type: "FACT",
    claim: reference,
    importance: "CENTRAL",
    verification_status: "UNASSESSED",
    evidence_required: ["source_primary_or_documentary_evidence"],
  },
];

const errors = claims.flatMap((claim) => {
  const result = [];
  if (!TYPES.has(claim.type)) result.push(`${claim.claim_id}: tipo inválido`);
  if (!PRIORITIES.has(claim.importance)) result.push(`${claim.claim_id}: prioridad inválida`);
  if (!STATUSES.has(claim.verification_status)) result.push(`${claim.claim_id}: estado inválido`);
  if (!claim.claim.trim()) result.push(`${claim.claim_id}: afirmación vacía`);
  if (!Array.isArray(claim.evidence_required) || claim.evidence_required.length === 0) {
    result.push(`${claim.claim_id}: falta evidencia requerida`);
  }
  return result;
});

if (errors.length) {
  console.error("✖ Claims inválidos:");
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

record.claims = claims;
record.status = "INVESTIGATING";
record.workflow = {
  ...(record.workflow ?? {}),
  claims: "READY_FOR_SOURCE_RESEARCH",
};
record.claims_engine = {
  version: "1.0",
  generated_at: new Date().toISOString(),
  mode: "DETERMINISTIC_INTAKE",
  note: "Extracción inicial conservadora. Requiere investigación documental; no constituye verificación factual.",
};
record.publication = {
  allowed: false,
  reason: "Las afirmaciones todavía no han sido verificadas documentalmente.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — CLAIMS ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Claims creados: ${claims.length}`);
console.log("✓ Estado: INVESTIGATING");
console.log("✓ Investigación documental pendiente.");
console.log("⚠ Ninguna afirmación ha sido certificada como verdadera.");
