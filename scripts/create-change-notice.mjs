#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const NOTICES_DIR = path.join(ROOT, "editorial", "change-notices");
function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
if (!caseId) { console.error("Uso: npm run notice:create -- --case CASE-########"); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`✖ No existe el caso: ${caseId}`); process.exit(1); }
const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const review = record.published_article_review;
const impact = record.editorial_impact;
if (!review && !impact) { console.error("✖ No existe una revisión de impacto que justifique un aviso."); process.exit(2); }
const status = review?.status ?? impact?.status;
let changeType = status === "CORRECTION_REQUIRED" || status === "CORRECTION_REVIEW_REQUIRED" ? "CORRECTION" : status === "NO_IMPACT" ? null : "UPDATE";
if (!changeType) { console.error("✖ No procede crear un aviso para un caso sin impacto."); process.exit(2); }
fs.mkdirSync(NOTICES_DIR, { recursive: true });
const ids = fs.readdirSync(NOTICES_DIR).map((name) => /^NOTICE-(\d{8})\.json$/.exec(name)?.[1]).filter(Boolean).map(Number);
const next = (Math.max(0, ...ids) + 1).toString().padStart(8, "0");
const noticeId = `NOTICE-${next}`;
const articleId = record.article_id ?? record.draft?.article_path ?? caseId;
const previousVersion = record.article_version?.current_version ?? record.version?.current ?? "v1";
const message = changeType === "CORRECTION"
  ? "Esta información ha sido corregida tras una revisión editorial."
  : "Esta información ha sido actualizada tras una revisión editorial.";
const notice = {
  notice_id: noticeId,
  article_id: articleId,
  correction_id: null,
  change_type: changeType,
  status: "DRAFT",
  published_at: null,
  message,
  reason: null,
  previous_version: previousVersion,
  new_version: null,
  approved_by: null,
  approved_at: null,
  affected_claim_ids: review?.affected_claim_ids ?? impact?.affected_claim_ids ?? [],
  affected_evidence_ids: review?.changed_evidence_ids ?? impact?.affected_evidence_ids ?? [],
  affected_sentence_ids: review?.affected_sentence_ids ?? impact?.affected_sentence_ids ?? [],
  created_at: new Date().toISOString()
};
const out = path.join(NOTICES_DIR, `${noticeId}.json`);
fs.writeFileSync(out, `${JSON.stringify(notice, null, 2)}\n`, "utf8");
console.log(`Aviso creado: ${noticeId}`);
console.log(`Tipo: ${changeType}`);
console.log("Estado: DRAFT — requiere decisión y aprobación editorial.");
