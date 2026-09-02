#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const CORRECTIONS_DIR = path.join(ROOT, "editorial", "corrections");

function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
if (!caseId) { console.error("Uso: npm run correction:create -- --case CASE-########"); process.exit(1); }

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`✖ No existe el caso: ${caseId}`); process.exit(1); }
const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const review = record.published_article_review;
const impact = record.editorial_impact;
const reviewStatus = review?.status;
const impactStatus = impact?.status;
const allowed = ["REVIEW_REQUIRED", "CORRECTION_REQUIRED"].includes(reviewStatus)
  || ["IMPACT_REVIEW_REQUIRED", "CENTRAL_IMPACT_REVIEW_REQUIRED", "CORRECTION_REVIEW_REQUIRED"].includes(impactStatus);
if (!allowed) {
  console.error("✖ No existe un impacto publicado que requiera crear un registro de corrección/revisión.");
  process.exit(2);
}

fs.mkdirSync(CORRECTIONS_DIR, { recursive: true });
const existing = fs.readdirSync(CORRECTIONS_DIR).filter((name) => /^COR-\d{8}\.json$/.test(name));
const next = existing.reduce((max, name) => Math.max(max, Number(name.slice(4, 12))), 0) + 1;
const correctionId = `COR-${String(next).padStart(8, "0")}`;

const changedEvidence = review?.changed_evidence_ids ?? impact?.affected_evidence_ids ?? [];
const affectedClaims = review?.affected_claim_ids ?? impact?.affected_claim_ids ?? [];
const affectedSentences = review?.affected_sentence_ids ?? impact?.affected_sentence_ids ?? [];
const affectedCalculations = review?.affected_calculation_ids ?? impact?.affected_calculation_ids ?? [];
const articleId = record.article?.id ?? record.id ?? record.draft?.article_path ?? caseId;

const correction = {
  correction_id: correctionId,
  article_id: articleId,
  case_id: caseId,
  article_version_before: record.article?.version ?? record.version ?? "v1",
  article_version_after: null,
  trigger_evidence_ids: [...new Set(changedEvidence.filter(Boolean))],
  affected_claim_ids: [...new Set(affectedClaims.filter(Boolean))],
  affected_sentence_ids: [...new Set(affectedSentences.filter(Boolean))],
  affected_calculation_ids: [...new Set(affectedCalculations.filter(Boolean))],
  decision: null,
  decision_reason: "",
  public_notice_required: Boolean(affectedSentences.includes("SEN-00000001") || affectedSentences.includes("SEN-00000002")),
  status: "DRAFT",
  approved_by: null,
  approved_at: null,
  applied_at: null,
  notes: "Creado automáticamente a partir del impacto detectado. La decisión editorial debe ser humana."
};

const out = path.join(CORRECTIONS_DIR, `${correctionId}.json`);
fs.writeFileSync(out, `${JSON.stringify(correction, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — CORRECTION RECORD");
console.log(`Caso: ${caseId}`);
console.log(`Registro: ${correctionId}`);
console.log(`Evidencias desencadenantes: ${correction.trigger_evidence_ids.length}`);
console.log(`Claims afectados: ${correction.affected_claim_ids.length}`);
console.log(`Frases afectadas: ${correction.affected_sentence_ids.length}`);
console.log("Decisión editorial: PENDIENTE");
