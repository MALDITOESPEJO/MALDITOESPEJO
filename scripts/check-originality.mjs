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
  console.error("Uso: npm run originality -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const articlePath = record.draft?.article_path ? path.join(ROOT, record.draft.article_path) : null;
if (!articlePath || !fs.existsSync(articlePath)) {
  console.error("✖ No existe el borrador generado para comprobar.");
  process.exit(2);
}

const article = fs.readFileSync(articlePath, "utf8");
const verifiedIds = new Set(record.publishable_scope?.claim_ids ?? []);
const assessments = new Map((record.verification?.claims ?? []).map((item) => [item.claim_id, item]));
const claims = (record.claims ?? []).filter((claim) => verifiedIds.has(claim.claim_id) && assessments.get(claim.claim_id)?.status === "VERIFIED");

const body = article.replace(/^---[\s\S]*?---\s*/m, "");
const lines = body.split(/\r?\n/).map((line) => line.trim()).filter((line) => line && !line.startsWith("##") && !line.startsWith("- "));

const sentenceResults = [];
for (const sentence of lines) {
  const supporting = claims.filter((claim) => sentence.includes(claim.claim));
  sentenceResults.push({
    text: sentence,
    claim_ids: supporting.map((claim) => claim.claim_id),
    status: supporting.length ? "TRACED" : "UNTRACED",
  });
}

const untraced = sentenceResults.filter((item) => item.status === "UNTRACED");
const originalityStatus = untraced.length ? "ORIGINALITY_BLOCKED" : "ORIGINALITY_CLEAR";

record.originality = {
  assessed_at: new Date().toISOString(),
  status: originalityStatus,
  similarity_status: "NOT_ASSESSABLE",
  sentence_traceability: sentenceResults,
  untraced_sentences: untraced.map((item) => item.text),
  rule: "Toda frase factual generada automáticamente debe poder vincularse a una o más afirmaciones verificadas.",
};
record.workflow = { ...(record.workflow ?? {}), originality: originalityStatus };
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: originalityStatus === "ORIGINALITY_CLEAR"
    ? "La trazabilidad de las frases del borrador está superada; todavía requiere control final de originalidad semántica y aprobación editorial humana."
    : "Existen frases del borrador que no pueden vincularse automáticamente a afirmaciones verificadas.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — ORIGINALITY / TRACEABILITY CHECK");
console.log(`Caso: ${caseId}`);
console.log(`Frases comprobadas: ${sentenceResults.length}`);
console.log(`Frases trazadas: ${sentenceResults.length - untraced.length}`);
console.log(`Frases sin trazabilidad: ${untraced.length}`);
console.log(`Resultado: ${originalityStatus}`);
console.log("Comparación de similitud: NO EVALUABLE SIN TEXTO DE REFERENCIA LOCAL");

if (untraced.length) process.exitCode = 2;
