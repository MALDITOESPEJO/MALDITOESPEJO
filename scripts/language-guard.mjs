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
if (!caseId) {
  console.error("Uso: npm run language:guard -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const claims = Array.isArray(record.claims) ? record.claims : [];
const assessments = new Map((record.verification?.claims ?? []).map((item) => [item.claim_id, item]));
const scope = new Set(record.publishable_scope?.claim_ids ?? record.verification?.verified_claims ?? []);
const draftPath = record.draft?.article_path ? path.join(ROOT, record.draft.article_path) : null;

if (!draftPath || !fs.existsSync(draftPath)) {
  console.error("✖ No existe un borrador generado para revisar.");
  process.exit(2);
}

const text = fs.readFileSync(draftPath, "utf8");
const findings = [];

const riskyPatterns = [
  { id: "ATTRIBUTION_LOSS", re: /\b(según|afirmó|afirma|sostiene|señala|indicó|indicaron|dijo|declaró)\b[^\n]{0,160}\b(ocurri[oó]|es|son|caus[oó]|demuestra|confirma)\b/i, severity: "REVIEW_REQUIRED" },
  { id: "CERTAINTY_INFLATION", re: /\b(podría|podrían|posiblemente|aparentemente|presuntamente|no está confirmado|se investiga|no hay datos suficientes)\b[^\n]{0,120}\b(es|son|ocurri[oó]|caus[oó]|demuestra|confirmado)\b/i, severity: "REVIEW_REQUIRED" },
  { id: "CAUSALITY", re: /\b(caus[oó]|provoc[oó]|provoca|provocará|debido a|por culpa de|como consecuencia directa de)\b/i, severity: "REVIEW_REQUIRED" },
  { id: "UNRESOLVED_CERTAINTY", re: /\b(no se sabe|pendiente|sin confirmar|no confirmado|en investigación|se desconoce)\b[^\n]{0,100}\b(es|son|ocurri[oó]|ocurrió|caus[oó])\b/i, severity: "REVIEW_REQUIRED" }
];

for (const pattern of riskyPatterns) {
  if (pattern.re.test(text)) {
    findings.push({ rule: pattern.id, status: pattern.severity, message: "Posible transformación de atribución, certeza o causalidad. Revisión humana necesaria." });
  }
}

const excluded = claims.filter((claim) => !scope.has(claim.claim_id));
const excludedFactTexts = excluded
  .filter((claim) => ["UNKNOWN", "PENDING", "INFERENCE", "STATEMENT"].includes(claim.type))
  .map((claim) => claim.claim);

for (const claimText of excludedFactTexts) {
  const normalized = claimText.trim().toLowerCase();
  if (normalized && text.toLowerCase().includes(normalized)) {
    findings.push({ rule: "OUT_OF_SCOPE_LANGUAGE", status: "REVIEW_REQUIRED", message: `Una afirmación fuera del alcance aparece literalmente en el borrador: ${claimText}` });
  }
}

const scopeClaims = claims.filter((claim) => scope.has(claim.claim_id));
for (const claim of scopeClaims) {
  if (assessments.get(claim.claim_id)?.status !== "VERIFIED") {
    findings.push({ rule: "SCOPE_STATUS_MISMATCH", status: "BLOCKED_FACT_STATEMENT_LEAK", message: `El claim ${claim.claim_id} figura en el alcance pero no está VERIFIED.` });
  }
}

let status = "PASS";
if (findings.some((item) => item.status === "BLOCKED_FACT_STATEMENT_LEAK")) status = "BLOCKED_FACT_STATEMENT_LEAK";
else if (findings.length) status = "REVIEW_REQUIRED";
else if (claims.some((claim) => claim.type === "STATEMENT" && scope.has(claim.claim_id))) status = "PASS_WITH_ATTRIBUTION";

record.language_guard = {
  checked_at: new Date().toISOString(),
  status,
  findings,
  checked_claim_ids: [...scope],
  rule: "La forma de expresar una afirmación no puede aumentar su certeza ni eliminar su atribución respecto de la evidencia registrada.",
  human_review_required: status !== "PASS"
};
record.workflow = { ...(record.workflow ?? {}), language_guard: status };
record.publication = {
  allowed: false,
  reason: "El control de lenguaje no sustituye la aprobación editorial humana ni el Publication Gate."
};
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — LANGUAGE & FACT / STATEMENT GUARD");
console.log(`Caso: ${caseId}`);
console.log(`Estado: ${status}`);
console.log(`Hallazgos: ${findings.length}`);
console.log(`Claims en alcance revisados: ${scope.size}`);
console.log("Publicación: BLOQUEADA HASTA APROBACIÓN");

if (status === "BLOCKED_FACT_STATEMENT_LEAK") process.exit(2);
