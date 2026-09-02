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

function clean(text) {
  return text.replace(/\s+/g, " ").trim();
}

function splitClaims(text) {
  return clean(text)
    .split(/(?<=[.!?])\s+(?=[A-ZÁÉÍÓÚÜÑ0-9¿¡"«])/u)
    .map(clean)
    .filter(Boolean)
    .slice(0, 50);
}

function classify(text) {
  const lower = text.toLocaleLowerCase("es-ES");
  if (/\b(según|afirmó|afirma|dijo|declaró|aseguró|indicó|explicó|sostiene)\b/u.test(lower)) return "STATEMENT";
  if (/\b(no se sabe|no está claro|se desconoce|sin confirmar|pendiente|todavía no)\b/u.test(lower)) return "UNKNOWN";
  return "FACT";
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
const reference = typeof input.input_reference === "string" ? clean(input.input_reference) : "";
const inputText = typeof input.input_text === "string" ? clean(input.input_text) : "";
const materialText = inputText || reference;

if (!materialText) {
  console.error("✖ El caso no contiene texto de entrada.");
  process.exit(1);
}

const pieces = splitClaims(materialText);
if (!pieces.length) {
  console.error("✖ No se han podido extraer afirmaciones.");
  process.exit(1);
}

const claims = pieces.map((piece, index) => {
  const type = classify(piece);
  return {
    claim_id: `CLM-${String(index + 1).padStart(8, "0")}`,
    type,
    claim: piece,
    importance: index === 0 && !inputText ? "CENTRAL" : index < 3 ? "IMPORTANT" : "CONTEXTUAL",
    verification_status: "UNASSESSED",
    evidence_required: type === "STATEMENT"
      ? ["direct_or_authoritative_attribution"]
      : ["primary_or_documentary_evidence"],
  };
});

const errors = claims.flatMap((claim) => {
  const result = [];
  if (!TYPES.has(claim.type)) result.push(`${claim.claim_id}: tipo inválido`);
  if (!PRIORITIES.has(claim.importance)) result.push(`${claim.claim_id}: prioridad inválida`);
  if (!STATUSES.has(claim.verification_status)) result.push(`${claim.claim_id}: estado inválido`);
  if (!claim.claim.trim()) result.push(`${claim.claim_id}: afirmación vacía`);
  if (!Array.isArray(claim.evidence_required) || claim.evidence_required.length === 0) result.push(`${claim.claim_id}: falta evidencia requerida`);
  return result;
});

if (errors.length) {
  console.error("✖ Claims inválidos:");
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

record.claims = claims;
record.status = "INVESTIGATING";
record.workflow = { ...(record.workflow ?? {}), claims: "READY_FOR_SOURCE_RESEARCH" };
record.claims_engine = {
  version: "2.0",
  generated_at: new Date().toISOString(),
  mode: "DETERMINISTIC_ATOMIC_DECOMPOSITION",
  input_units: pieces.length,
  note: "Descomposición conservadora. La clasificación no verifica hechos ni añade información que no figure en la entrada.",
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
console.log("✓ Afirmaciones preparadas para investigación documental.");
console.log("⚠ Ninguna afirmación ha sido certificada como verdadera.");
