#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "editorial", "corrections");
const decisions = new Set(["CORRECTION", "UPDATE", "NO_CHANGE", "WITHDRAW"]);
const statuses = new Set(["DRAFT", "REVIEW", "APPROVED", "APPLIED", "CLOSED"]);
const errors = [];

if (!fs.existsSync(DIR)) {
  console.log("MALDITOESPEJO — CORRECTION RECORD VALIDATION");
  console.log("Sin directorio de correcciones: PASS");
  process.exit(0);
}

for (const name of fs.readdirSync(DIR).filter((x) => x.endsWith(".json"))) {
  const file = path.join(DIR, name);
  let record;
  try { record = JSON.parse(fs.readFileSync(file, "utf8")); }
  catch { errors.push(`${name}: JSON inválido`); continue; }
  if (!/^COR-\d{8}$/.test(record.correction_id ?? "")) errors.push(`${name}: correction_id inválido`);
  if (!record.article_id) errors.push(`${name}: falta article_id`);
  if (!record.case_id) errors.push(`${name}: falta case_id`);
  if (!statuses.has(record.status)) errors.push(`${name}: status inválido`);
  if (record.decision !== null && !decisions.has(record.decision)) errors.push(`${name}: decision inválida`);
  const trigger = Array.isArray(record.trigger_evidence_ids) ? record.trigger_evidence_ids : [];
  if (record.decision === "CORRECTION" && trigger.length === 0) errors.push(`${name}: CORRECTION requiere trigger_evidence_ids`);
  if (record.status === "APPROVED" || record.status === "APPLIED" || record.status === "CLOSED") {
    if (!record.decision) errors.push(`${name}: ${record.status} requiere decisión editorial`);
    if (!record.approved_by || !record.approved_at) errors.push(`${name}: ${record.status} requiere aprobación humana y fecha`);
  }
  if (record.status === "APPLIED" || record.status === "CLOSED") {
    if (!record.article_version_before || !record.article_version_after) errors.push(`${name}: ${record.status} requiere versiones anterior y posterior`);
    if (!record.applied_at) errors.push(`${name}: ${record.status} requiere applied_at`);
  }
  if (record.status === "DRAFT" && record.decision && !record.decision_reason) errors.push(`${name}: una decisión en DRAFT requiere explicación`);
}

console.log("MALDITOESPEJO — CORRECTION RECORD VALIDATION");
console.log(`Registros revisados: ${fs.readdirSync(DIR).filter((x) => x.endsWith(".json")).length}`);
if (errors.length) {
  console.error(`Errores: ${errors.length}`);
  for (const error of errors) console.error(`✖ ${error}`);
  process.exit(1);
}
console.log("Estado: PASS");
