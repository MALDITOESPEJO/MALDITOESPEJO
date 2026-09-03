#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const AUDIT_DIR = path.join(ROOT, "editorial", "audit");

if (!fs.existsSync(AUDIT_DIR)) {
  console.log("MALDITOESPEJO — AUDIT LOG VALIDATOR");
  console.log("No existen logs de auditoría todavía.");
  process.exit(0);
}

const files = fs.readdirSync(AUDIT_DIR).filter((name) => /^CASE-\d{8}\.jsonl$/.test(name));
let errors = 0;
let events = 0;

for (const name of files) {
  const file = path.join(AUDIT_DIR, name);
  const lines = fs.readFileSync(file, "utf8").split(/\r?\n/).filter(Boolean);
  let previousHash = null;

  for (let i = 0; i < lines.length; i += 1) {
    let event;
    try { event = JSON.parse(lines[i]); } catch { errors += 1; console.log(`✖ ${name}:${i + 1}: JSON inválido`); continue; }
    events += 1;

    const expectedSequence = i + 1;
    if (event.sequence !== expectedSequence) { errors += 1; console.log(`✖ ${name}:${i + 1}: sequence inválida`); }
    if (event.event_id !== `AUDIT-${String(expectedSequence).padStart(8, "0")}`) { errors += 1; console.log(`✖ ${name}:${i + 1}: event_id inválido`); }
    if (event.case_id !== name.replace(/\.jsonl$/, "")) { errors += 1; console.log(`✖ ${name}:${i + 1}: case_id no coincide`); }
    if (!event.timestamp || Number.isNaN(Date.parse(event.timestamp))) { errors += 1; console.log(`✖ ${name}:${i + 1}: timestamp inválido`); }

    if (event.previous_event_hash !== previousHash) {
      errors += 1;
      console.log(`✖ ${name}:${i + 1}: cadena hash rota`);
    }

    previousHash = crypto.createHash("sha256").update(lines[i], "utf8").digest("hex");
  }
}

console.log(`Logs comprobados: ${files.length}`);
console.log(`Eventos comprobados: ${events}`);
console.log(`Errores: ${errors}`);
console.log(`Resultado: ${errors === 0 ? "AUDITORÍA ÍNTEGRA" : "AUDITORÍA INVÁLIDA"}`);
process.exit(errors === 0 ? 0 : 1);
