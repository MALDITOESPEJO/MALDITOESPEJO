#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const DIR = path.join(ROOT, "editorial", "change-notices");
const allowedTypes = new Set(["UPDATE", "CORRECTION", "WITHDRAW"]);
const allowedStatuses = new Set(["DRAFT", "APPROVED", "PUBLISHED", "SUPERSEDED", "WITHDRAWN"]);
if (!fs.existsSync(DIR)) { console.log("No hay avisos públicos registrados."); process.exit(0); }
const files = fs.readdirSync(DIR).filter((x) => x.endsWith(".json"));
const errors = [];
for (const file of files) {
  const p = path.join(DIR, file);
  let n;
  try { n = JSON.parse(fs.readFileSync(p, "utf8")); } catch { errors.push(`${file}: JSON inválido`); continue; }
  if (!/^NOTICE-\d{8}$/.test(n.notice_id ?? "")) errors.push(`${file}: notice_id inválido`);
  if (!n.article_id) errors.push(`${file}: falta article_id`);
  if (!allowedTypes.has(n.change_type)) errors.push(`${file}: change_type inválido`);
  if (!allowedStatuses.has(n.status)) errors.push(`${file}: status inválido`);
  if (!n.message) errors.push(`${file}: falta message`);
  if (n.status === "APPROVED" || n.status === "PUBLISHED") {
    if (!n.approved_by || !n.approved_at) errors.push(`${file}: un aviso aprobado/publicado requiere aprobación humana y fecha`);
  }
  if (n.status === "PUBLISHED" && !n.published_at) errors.push(`${file}: un aviso publicado requiere published_at`);
  if (n.change_type === "CORRECTION" && (!Array.isArray(n.affected_evidence_ids) || n.affected_evidence_ids.length === 0)) errors.push(`${file}: CORRECTION requiere evidencia afectada`);
  if (n.change_type !== "CORRECTION" && n.reason === null) { /* reason may be supplied by editor before publication */ }
}
console.log("MALDITOESPEJO — PUBLIC CHANGE NOTICE VALIDATION");
console.log(`Avisos revisados: ${files.length}`);
console.log(`Errores: ${errors.length}`);
for (const error of errors) console.error(`✖ ${error}`);
if (errors.length) process.exit(1);
console.log("✓ Avisos estructuralmente válidos.");
