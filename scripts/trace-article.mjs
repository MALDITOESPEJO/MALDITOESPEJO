#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
if (!caseId) { console.error("Uso: npm run trace:article -- --case CASE-########"); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`✖ No existe el caso: ${caseId}`); process.exit(1); }
const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const articlePath = record.draft?.article_path ? path.join(ROOT, record.draft.article_path) : null;
if (!articlePath || !fs.existsSync(articlePath)) { console.error("✖ No existe el borrador asociado al caso."); process.exit(1); }

const claims = Array.isArray(record.claims) ? record.claims : [];
const approved = new Set(record.publishable_scope?.claim_ids ?? record.verification?.verified_claims ?? []);
const verification = new Map((record.verification?.claims ?? []).map((x) => [x.claim_id, x]));
const evidenceByClaim = new Map();
for (const evidence of record.evidence ?? []) {
  if (!evidenceByClaim.has(evidence.claim_id)) evidenceByClaim.set(evidence.claim_id, []);
  evidenceByClaim.get(evidence.claim_id).push(evidence);
}

const text = fs.readFileSync(articlePath, "utf8");
const body = text.replace(/^---[\s\S]*?---\s*/m, "");
const lines = body.split(/\n+/).map((line) => line.trim()).filter(Boolean);
const trace = [];
let sentenceCounter = 0;
for (const line of lines) {
  if (line.startsWith("## ") || line.startsWith("- ")) continue;
  sentenceCounter += 1;
  const normalized = line.replace(/[^A-Z0-9]/gi, "").toLowerCase();
  const matches = claims.filter((claim) => {
    const claimText = String(claim.claim ?? "").replace(/[^A-Z0-9]/gi, "").toLowerCase();
    return claimText && (normalized.includes(claimText) || claimText.includes(normalized));
  });
  const approvedMatches = matches.filter((claim) => approved.has(claim.claim_id) && verification.get(claim.claim_id)?.status === "VERIFIED");
  const evidenceIds = [...new Set(approvedMatches.flatMap((claim) => (evidenceByClaim.get(claim.claim_id) ?? []).filter((e) => ["SUPPORTS", "PARTIALLY_SUPPORTS"].includes(e.assessment)).map((e) => e.evidence_id)))];
  let status = "UNTRACEABLE";
  if (approvedMatches.length && evidenceIds.length) status = approvedMatches.some((claim) => matches.length === 1 && normalized !== String(claim.claim).replace(/[^A-Z0-9]/gi, "").toLowerCase()) ? "PARTIALLY_TRACEABLE" : "TRACEABLE";
  if (matches.length && !approvedMatches.length) status = "OUT_OF_SCOPE";
  trace.push({ sentence_id: `SEN-${String(sentenceCounter).padStart(8, "0")}`, text: line, claim_ids: approvedMatches.map((x) => x.claim_id), evidence_ids: evidenceIds, traceability_status: status });
}

const critical = trace.filter((item) => item.sentence_id === "SEN-00000001");
const untraceable = trace.filter((item) => ["UNTRACEABLE", "OUT_OF_SCOPE"].includes(item.traceability_status));
const partial = trace.filter((item) => item.traceability_status === "PARTIALLY_TRACEABLE");
const status = untraceable.length ? "REVIEW_REQUIRED" : partial.length ? "PARTIALLY_TRACEABLE" : "TRACEABLE";
record.article_traceability = {
  assessed_at: new Date().toISOString(),
  article_path: path.relative(ROOT, articlePath).replaceAll(path.sep, "/"),
  status,
  sentences: trace,
  summary: { total: trace.length, traceable: trace.filter((x) => x.traceability_status === "TRACEABLE").length, partial: partial.length, untraceable: untraceable.length },
  critical_sentence_review: critical,
  rule: "Toda afirmación factual material debe poder remontarse a claims aprobados y a evidencia documental.",
  human_review_required: untraceable.length > 0 || partial.length > 0,
};
record.workflow = { ...(record.workflow ?? {}), article_traceability: status };
record.publication = { ...(record.publication ?? {}), allowed: false };
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — SENTENCE TRACEABILITY ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Frases analizadas: ${trace.length}`);
console.log(`Trazables: ${record.article_traceability.summary.traceable}`);
console.log(`Parciales: ${partial.length}`);
console.log(`Sin trazabilidad: ${untraceable.length}`);
console.log(`Estado: ${status}`);
console.log("La correspondencia semántica compleja requiere revisión humana.");
if (untraceable.length) process.exitCode = 2;
