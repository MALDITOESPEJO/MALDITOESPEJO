#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const DIR = path.join(process.cwd(), "editorial", "recovery", "failures");
if (!fs.existsSync(DIR)) { console.log("MALDITOESPEJO — FAILURE RECORDS\nNo hay registros."); process.exit(0); }
const files = fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).sort();
const allowed = new Set(["FAILED", "WAITING_RECOVERY", "RECOVERED", "BLOCKED"]);
let errors = 0;
for (const file of files) {
  let r;
  try { r = JSON.parse(fs.readFileSync(path.join(DIR, file), "utf8")); } catch { console.error(`✖ ${file}: JSON inválido`); errors++; continue; }
  const required = ["failure_id", "run_id", "case_id", "stage", "status", "timestamp", "attempt", "error_type", "message"];
  for (const key of required) if (!(key in r)) { console.error(`✖ ${file}: falta ${key}`); errors++; }
  if (!/^FAIL-\d{8}$/.test(r.failure_id ?? "")) { console.error(`✖ ${file}: failure_id inválido`); errors++; }
  if (!/^CASE-\d{8}$/.test(r.case_id ?? "")) { console.error(`✖ ${file}: case_id inválido`); errors++; }
  if (!allowed.has(r.status)) { console.error(`✖ ${file}: estado inválido`); errors++; }
  if (!Number.isInteger(r.attempt) || r.attempt < 1) { console.error(`✖ ${file}: attempt inválido`); errors++; }
}
console.log(`Registros comprobados: ${files.length}`);
console.log(`Errores: ${errors}`);
console.log(`Resultado: ${errors ? "FAIL" : "PASS"}`);
process.exit(errors ? 1 : 0);
