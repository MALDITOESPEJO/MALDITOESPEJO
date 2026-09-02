#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORRECTIONS_DIR = path.join(ROOT, "editorial", "corrections");

function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
const correctionId = arg("--correction");
const reason = arg("--reason");

if (!caseId || !correctionId || !reason) {
  console.error("Uso: npm run version:create -- --case CASE-######## --correction COR-######## --reason UPDATE|CORRECTION|WITHDRAWAL");
  process.exit(1);
}

const correctionPath = path.join(CORRECTIONS_DIR, `${correctionId}.json`);
const casePath = path.join(ROOT, "editorial", "cases", `${caseId}.json`);
if (!fs.existsSync(correctionPath) || !fs.existsSync(casePath)) {
  console.error("✖ Caso o registro de corrección inexistente.");
  process.exit(1);
}

const correction = JSON.parse(fs.readFileSync(correctionPath, "utf8"));
const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
if (correction.article_id === undefined || correction.article_id !== (record.draft?.article_id ?? record.article_id)) {
  console.error("✖ El article_id del registro no coincide con el caso.");
  process.exit(1);
}
if (!["UPDATE", "CORRECTION", "WITHDRAWAL"].includes(reason)) {
  console.error("✖ Motivo de versión no permitido.");
  process.exit(1);
}
if (correction.status !== "APPROVED") {
  console.error("✖ La corrección debe estar APPROVED antes de crear una nueva versión.");
  process.exit(1);
}

const articleId = correction.article_id;
const existing = fs.existsSync(CORRECTIONS_DIR)
  ? fs.readdirSync(CORRECTIONS_DIR).filter((name) => name.endsWith(".json")).map((name) => JSON.parse(fs.readFileSync(path.join(CORRECTIONS_DIR, name), "utf8"))).filter((x) => x.article_id === articleId && /^v\d+$/.test(x.version))
  : [];
const nextNumber = existing.reduce((max, x) => Math.max(max, Number(x.version.slice(1))), 0) + 1;
const previousVersion = existing.length ? `v${Math.max(...existing.map((x) => Number(x.version.slice(1))))}` : "v1";
const version = `v${nextNumber}`;

const versionRecord = {
  article_id: articleId,
  version,
  previous_version: existing.length ? previousVersion : null,
  created_at: new Date().toISOString(),
  published_at: null,
  status: "DRAFT",
  change_reason: reason,
  correction_id: correctionId,
  source_case_id: caseId,
  notes: "Versión creada como registro histórico. La aplicación al contenido publicado requiere revisión y Publication Gate."
};

fs.mkdirSync(CORRECTIONS_DIR, { recursive: true });
const versionPath = path.join(CORRECTIONS_DIR, `${articleId}-${version}.json`);
fs.writeFileSync(versionPath, `${JSON.stringify(versionRecord, null, 2)}\n`, "utf8");
console.log(`Versión creada: ${articleId} ${version}`);
console.log(`Anterior: ${versionRecord.previous_version ?? "ninguna"}`);
console.log("Estado: DRAFT");
console.log("El contenido publicado NO ha sido modificado automáticamente.");
