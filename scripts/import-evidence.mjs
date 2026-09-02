#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const importPath = arg("--input");
if (!importPath) {
  console.error("Uso: npm run evidence:import -- --input ruta/evidencias.json");
  process.exit(1);
}

const absolute = path.resolve(ROOT, importPath);
if (!fs.existsSync(absolute)) {
  console.error(`✖ No existe el archivo: ${importPath}`);
  process.exit(1);
}

let payload;
try {
  payload = JSON.parse(fs.readFileSync(absolute, "utf8"));
} catch (error) {
  console.error(`✖ JSON inválido: ${error.message}`);
  process.exit(1);
}

if (!/^CASE-\d{8}$/.test(payload.case_id) || !Array.isArray(payload.evidence)) {
  console.error("✖ El archivo debe contener case_id válido y un array evidence.");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${payload.case_id}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${payload.case_id}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
record.evidence = Array.isArray(record.evidence) ? record.evidence : [];
const existingIds = new Set(record.evidence.map((item) => item.evidence_id));
const claims = new Set((record.claims ?? []).map((claim) => claim.claim_id));

for (const item of payload.evidence) {
  const required = ["claim_id", "source_id", "document_or_record", "url_or_reference", "assessment"];
  const missing = required.filter((key) => !item[key]);
  if (missing.length) {
    console.error(`✖ Evidencia incompleta. Faltan: ${missing.join(", ")}`);
    process.exit(1);
  }
  if (!claims.has(item.claim_id)) {
    console.error(`✖ La afirmación no existe en el caso: ${item.claim_id}`);
    process.exit(1);
  }
}

let next = record.evidence.length + 1;
for (const item of payload.evidence) {
  const seed = JSON.stringify({ case_id: payload.case_id, ...item, imported_at: new Date().toISOString() });
  let evidenceId;
  do {
    evidenceId = `EVD-${String(next++).padStart(8, "0")}`;
  } while (existingIds.has(evidenceId));
  existingIds.add(evidenceId);
  record.evidence.push({
    evidence_id: evidenceId,
    ...item,
    imported_at: new Date().toISOString(),
    import_fingerprint: crypto.createHash("sha256").update(seed).digest("hex").slice(0, 16).toUpperCase(),
  });
}

record.workflow = record.workflow ?? {};
record.workflow.evidence = "REGISTERED";
record.workflow.provenance = "PENDING_CHECK";
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: "La evidencia ha sido incorporada, pero todavía debe pasar por procedencia, contraste, verificación y aprobación editorial.",
};
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — EVIDENCE IMPORT");
console.log(`✓ Caso: ${payload.case_id}`);
console.log(`✓ Evidencias incorporadas: ${payload.evidence.length}`);
console.log("✓ Siguiente paso: provenance → contrast → verify.");
console.log("⚠ Importar evidencia no equivale a verificarla.");
