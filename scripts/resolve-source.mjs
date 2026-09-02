#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const REGISTRY = path.join(ROOT, "editorial", "sources", "MASTER_SOURCE_REGISTRY_NORMALIZED.csv");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
if (!caseId) {
  console.error("Uso: npm run source:resolve -- --case CASE-########");
  process.exit(1);
}

const caseFile = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(caseFile) || !fs.existsSync(REGISTRY)) {
  console.error("✖ Caso o registro maestro de fuentes no encontrado.");
  process.exit(1);
}

function parseCsvLine(line) {
  const out = [];
  let value = "";
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === "," && !quoted) { out.push(value); value = ""; }
    else value += ch;
  }
  out.push(value);
  return out;
}

function parseCsv(text) {
  const lines = text.split(/\r?\n/).filter(Boolean);
  const headers = parseCsvLine(lines.shift());
  return lines.map((line) => Object.fromEntries(parseCsvLine(line).map((v, i) => [headers[i], v])));
}

function hostOf(value) {
  try { return new URL(value).hostname.toLowerCase().replace(/^www\./, ""); }
  catch { return ""; }
}

const record = JSON.parse(fs.readFileSync(caseFile, "utf8"));
const rows = parseCsv(fs.readFileSync(REGISTRY, "utf8"));
const candidates = record.web_results ?? [];
const resolved = [];
const unresolved = [];

for (const item of candidates) {
  const host = hostOf(item.url ?? item.url_or_reference ?? "");
  const haystack = `${item.source_name ?? ""} ${item.publisher ?? ""} ${item.title ?? ""}`.toLowerCase();
  const matches = rows.filter((row) => {
    const official = hostOf(row.official_domain ?? "");
    const name = (row.source_name ?? "").toLowerCase();
    const institution = (row.institution ?? "").toLowerCase();
    return (official && host === official) || (name && haystack.includes(name)) || (institution && haystack.includes(institution));
  });

  const unique = [...new Map(matches.map((row) => [row.source_id, row])).values()];
  if (unique.length === 1) {
    const source = unique[0];
    resolved.push({
      ...item,
      resolved_source_id: source.source_id,
      source_name: source.source_name,
      institution: source.institution,
      source_type: source.source_type,
      source_nature: source.source_nature,
      authority_level: source.authority_level,
      editorial_role: source.editorial_role,
      primary_evidence_available: source.primary_evidence_available,
      resolution: "EXACT_REGISTRY_MATCH"
    });
  } else {
    unresolved.push({
      ...item,
      resolution: unique.length > 1 ? "AMBIGUOUS_REGISTRY_MATCH" : "NO_REGISTRY_MATCH",
      candidate_source_ids: unique.map((row) => row.source_id)
    });
  }
}

record.source_resolution = {
  resolved_at: new Date().toISOString(),
  registry: path.relative(ROOT, REGISTRY).replaceAll(path.sep, "/"),
  candidates_received: candidates.length,
  resolved: resolved.length,
  unresolved: unresolved.length,
  rule: "Solo se asigna una fuente cuando existe una coincidencia única con el registro maestro. Las coincidencias ambiguas o inexistentes requieren revisión humana."
};
record.resolved_sources = resolved;
record.unresolved_sources = unresolved;
record.workflow = record.workflow ?? {};
record.workflow.sources = resolved.length ? "SOURCES_RESOLVED_REVIEW_REQUIRED" : "SOURCE_RESOLUTION_PENDING";
record.publication = { ...(record.publication ?? {}), allowed: false, reason: "La resolución automática de fuentes no equivale a aceptación de evidencia ni a verificación." };
fs.writeFileSync(caseFile, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — SOURCE RESOLVER");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Candidatos: ${candidates.length}`);
console.log(`✓ Fuentes resueltas: ${resolved.length}`);
console.log(`⚠ Sin resolver/ambiguas: ${unresolved.length}`);
console.log("⚠ La resolución no certifica la evidencia ni la independencia.");
