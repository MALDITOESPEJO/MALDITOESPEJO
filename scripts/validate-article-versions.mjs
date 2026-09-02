#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CORRECTIONS_DIR = path.join(ROOT, "editorial", "corrections");
const VERSION_RE = /^v([1-9][0-9]*)$/;
const validChangeReasons = new Set(["INITIAL_PUBLICATION", "UPDATE", "CORRECTION", "WITHDRAWAL", "NO_CHANGE"]);
const validStatuses = new Set(["DRAFT", "PUBLISHED", "WITHDRAWN", "SUPERSEDED"]);

const errors = [];
const warnings = [];
const versions = [];

function readJsonFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir).filter((name) => name.endsWith(".json")).map((name) => {
    const file = path.join(dir, name);
    try { return { file, data: JSON.parse(fs.readFileSync(file, "utf8")) }; }
    catch { errors.push(`${name}: JSON inválido.`); return null; }
  }).filter(Boolean);
}

for (const { file, data } of readJsonFiles(CORRECTIONS_DIR)) {
  if (!data.article_id || !data.version) continue;
  versions.push({ ...data, file: path.relative(ROOT, file) });
}

const byArticle = new Map();
for (const version of versions) {
  for (const field of ["article_id", "version", "previous_version", "created_at", "status", "change_reason"]) {
    if (version[field] === undefined || version[field] === null || version[field] === "") errors.push(`${version.file}: falta ${field}.`);
  }
  if (!VERSION_RE.test(String(version.version))) errors.push(`${version.file}: versión inválida: ${version.version}.`);
  if (version.previous_version !== null && version.previous_version !== undefined && !VERSION_RE.test(String(version.previous_version))) errors.push(`${version.file}: previous_version inválida.`);
  if (!validChangeReasons.has(version.change_reason)) errors.push(`${version.file}: change_reason inválido.`);
  if (!validStatuses.has(version.status)) errors.push(`${version.file}: status inválido.`);
  if (version.change_reason === "CORRECTION" && !version.correction_id) errors.push(`${version.file}: CORRECTION requiere correction_id.`);
  if (!byArticle.has(version.article_id)) byArticle.set(version.article_id, []);
  byArticle.get(version.article_id).push(version);
}

for (const [articleId, list] of byArticle) {
  list.sort((a, b) => Number(String(a.version).slice(1)) - Number(String(b.version).slice(1)));
  const seen = new Set();
  list.forEach((version, index) => {
    if (seen.has(version.version)) errors.push(`${version.file}: versión duplicada ${version.version} para ${articleId}.`);
    seen.add(version.version);
    const expectedPrevious = index === 0 ? null : list[index - 1].version;
    if (version.previous_version !== expectedPrevious) errors.push(`${version.file}: previous_version debe ser ${expectedPrevious ?? "null"}.`);
    if (index === 0 && version.change_reason !== "INITIAL_PUBLICATION") warnings.push(`${version.file}: la primera versión no está marcada INITIAL_PUBLICATION.`);
    if (version.change_reason === "INITIAL_PUBLICATION" && version.version !== "v1") errors.push(`${version.file}: INITIAL_PUBLICATION solo puede ser v1.`);
  });
}

console.log("MALDITOESPEJO — ARTICLE VERSION VALIDATION");
console.log(`Artículos con versiones registradas: ${byArticle.size}`);
console.log(`Versiones revisadas: ${versions.length}`);
console.log(`Errores: ${errors.length}`);
console.log(`Avisos: ${warnings.length}`);
for (const error of errors) console.error(`✖ ${error}`);
for (const warning of warnings) console.warn(`⚠ ${warning}`);

process.exitCode = errors.length ? 1 : 0;
