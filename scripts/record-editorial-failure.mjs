#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const FAILURES_DIR = path.join(ROOT, "editorial", "recovery", "failures");
fs.mkdirSync(FAILURES_DIR, { recursive: true });

function arg(name, fallback = null) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : fallback; }
const caseId = arg("--case");
const stage = arg("--stage");
const message = arg("--message");
const errorType = arg("--type", "UNKNOWN");
const checkpoint = arg("--checkpoint", "none");
const runId = arg("--run-id", `RUN-${new Date().toISOString().replace(/\D/g, "").slice(0, 14)}-${crypto.randomBytes(3).toString("hex")}`);
const attempt = Number(arg("--attempt", "1"));

if (!/^CASE-\d{8}$/.test(caseId ?? "") || !stage || !message) {
  console.error("Uso: node scripts/record-editorial-failure.mjs --case CASE-######## --stage STAGE --message \"...\" [--type TYPE] [--checkpoint NAME] [--attempt N] [--run-id RUN]");
  process.exit(1);
}
if (!fs.existsSync(path.join(CASES_DIR, `${caseId}.json`))) {
  console.error(`✖ No existe el caso ${caseId}`);
  process.exit(1);
}
const existing = fs.readdirSync(FAILURES_DIR).filter((f) => /^FAIL-\d{8}\.json$/.test(f));
const next = existing.length ? Math.max(...existing.map((f) => Number(f.slice(5, 13)))) + 1 : 1;
const failureId = `FAIL-${String(next).padStart(8, "0")}`;
const record = {
  failure_id: failureId,
  run_id: runId,
  case_id: caseId,
  stage,
  status: "WAITING_RECOVERY",
  timestamp: new Date().toISOString(),
  attempt,
  error_type: errorType,
  message,
  checkpoint,
  next_action: `retry:${stage}`,
  recovered_at: null
};
fs.writeFileSync(path.join(FAILURES_DIR, `${failureId}.json`), `${JSON.stringify(record, null, 2)}\n`);
console.log(`✓ Registrado ${failureId} (${caseId}) en checkpoint ${checkpoint}`);
