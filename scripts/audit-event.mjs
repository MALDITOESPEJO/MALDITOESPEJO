#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const AUDIT_DIR = path.join(ROOT, "editorial", "audit");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
const stage = arg("--stage");
const eventType = arg("--event") ?? "STAGE_COMPLETED";
const status = arg("--status") ?? "INFO";
const detailsRaw = arg("--details") ?? "{}";

if (!caseId || !stage) {
  console.error("Uso: node scripts/audit-event.mjs --case CASE-######## --stage <stage> [--event <type>] [--status <status>] [--details <json>]");
  process.exit(1);
}

if (!/^CASE-\d{8}$/.test(caseId)) {
  console.error(`Caso inválido: ${caseId}`);
  process.exit(1);
}

const allowedStatuses = new Set(["PASS", "FAIL", "BLOCKED", "REVIEW_REQUIRED", "INFO"]);
if (!allowedStatuses.has(status)) {
  console.error(`Estado de auditoría inválido: ${status}`);
  process.exit(1);
}

let details;
try {
  details = JSON.parse(detailsRaw);
} catch {
  console.error("--details debe contener JSON válido.");
  process.exit(1);
}

fs.mkdirSync(AUDIT_DIR, { recursive: true });
const file = path.join(AUDIT_DIR, `${caseId}.jsonl`);
const previous = fs.existsSync(file) ? fs.readFileSync(file, "utf8") : "";
const lines = previous.split(/\r?\n/).filter(Boolean);
const sequence = lines.length + 1;
const eventId = `AUDIT-${String(sequence).padStart(8, "0")}`;
const previousHash = lines.length ? crypto.createHash("sha256").update(lines.at(-1), "utf8").digest("hex") : null;

const event = {
  event_id: eventId,
  sequence,
  timestamp: new Date().toISOString(),
  case_id: caseId,
  stage,
  event_type: eventType,
  status,
  actor: "SYSTEM",
  previous_event_hash: previousHash,
  details,
};

fs.appendFileSync(file, `${JSON.stringify(event)}\n`, "utf8");
console.log(`✓ ${eventId} registrado en ${path.relative(ROOT, file)}`);
