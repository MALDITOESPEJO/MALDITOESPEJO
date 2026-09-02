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
if (!caseId || !/^CASE-\d{8}$/.test(caseId)) {
  console.error("Uso: npm run research:plan -- --case CASE-########");
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

if (!Array.isArray(record.claims) || record.claims.length === 0) {
  console.error("✖ El caso todavía no contiene claims. Ejecuta primero el Claims Engine.");
  process.exit(1);
}

const targetsFor = (claim) => {
  if (claim.type === "STATEMENT") return ["DIRECT_STATEMENT", "PRIMARY_DOCUMENT"];
  if (claim.type === "CONTEXT") return ["OFFICIAL_DATA", "SPECIALIST_CONTEXT"];
  if (claim.type === "UNKNOWN" || claim.type === "PENDING") return ["PRIMARY_DOCUMENT", "OFFICIAL_DATA"];
  return ["PRIMARY_DOCUMENT", "OFFICIAL_DATA", "INDEPENDENT_CORROBORATION"];
};

const plans = record.claims.map((claim) => ({
  claim_id: claim.claim_id,
  priority: claim.importance ?? "IMPORTANT",
  evidence_required: Array.isArray(claim.evidence_required) ? claim.evidence_required : ["documentary_evidence"],
  source_targets: targetsFor(claim),
  search_questions: [
    `¿Qué documento, registro o declaración de primera mano respalda: ${claim.claim}?`,
    "¿La fuente es actual y corresponde al hecho concreto?",
    "¿Existe una fuente independiente que permita contrastarlo?",
  ],
  status: "PENDING_RESEARCH",
}));

record.research_plan = {
  version: "1.0",
  generated_at: new Date().toISOString(),
  mode: "DETERMINISTIC_SOURCE_TARGETING",
  plans,
  rule: "Encontrar una fuente no equivale a aceptar la evidencia ni a verificar el claim.",
};
record.workflow = { ...(record.workflow ?? {}), sources: "RESEARCH_PLAN_READY" };
record.status = "INVESTIGATING";
record.publication = {
  allowed: false,
  reason: "Existe un plan de investigación, pero todavía no existe evidencia aceptada y verificada.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — SOURCE RESEARCH ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Claims planificados: ${plans.length}`);
console.log("✓ Estado: INVESTIGATING");
console.log("✓ Plan de búsqueda documental creado.");
console.log("⚠ Ninguna fuente ha sido aceptada como evidencia todavía.");
