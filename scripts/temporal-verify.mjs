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
  console.error("Uso: npm run temporal:verify -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

let record;
try {
  record = JSON.parse(fs.readFileSync(casePath, "utf8"));
} catch (error) {
  console.error(`✖ JSON inválido: ${error.message}`);
  process.exit(1);
}

const claims = Array.isArray(record.claims) ? record.claims : [];
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const assessments = [];

const temporalWords = /actual|actualmente|hoy|ahora|vigente|en vigor|sigue|todavía|esta semana|este mes|este año|current|today|now|ongoing|still/i;
const datePattern = /\b(20\d{2})(?:-(\d{2}))?(?:-(\d{2}))?\b/g;

function parseDate(value) {
  if (!value) return null;
  const match = String(value).match(/^(\d{4})(?:-(\d{2}))?(?:-(\d{2}))?/);
  if (!match) return null;
  const month = match[2] ?? "01";
  const day = match[3] ?? "01";
  const date = new Date(`${match[1]}-${month}-${day}T00:00:00Z`);
  return Number.isNaN(date.getTime()) ? null : date;
}

function latestDate(items) {
  const dates = items.flatMap((item) => [item.published_at, item.observed_at, item.effective_at, item.valid_to].map(parseDate)).filter(Boolean);
  if (!dates.length) return null;
  return new Date(Math.max(...dates.map((date) => date.getTime())));
}

function claimYears(claim) {
  return [...String(claim.claim ?? "").matchAll(datePattern)].map((match) => Number(match[1]));
}

function hasTemporalData(item) {
  return Boolean(item.published_at || item.observed_at || item.effective_at || item.valid_from || item.valid_to || item.period);
}

for (const claim of claims) {
  const linked = evidence.filter((item) => item.claim_id === claim.claim_id);
  const sensitive = claim.temporal_requirement === true || temporalWords.test(claim.claim ?? "");
  const dates = linked.map((item) => [item.published_at, item.observed_at, item.effective_at, item.valid_from, item.valid_to].filter(Boolean)).flat();
  const years = claimYears(claim);
  const evidenceYears = dates.map((value) => parseDate(value)?.getUTCFullYear()).filter(Boolean);
  const superseded = linked.some((item) => item.assessment === "SUPERSEDED" || item.provenance_status === "SUPERSEDED");
  const noTemporalData = linked.length > 0 && linked.some((item) => !hasTemporalData(item));
  const currentCaseDate = parseDate(record.created_at) ?? new Date();
  const latest = latestDate(linked);

  let status = "TEMPORALLY_UNASSESSED";
  let reason = "No hay suficiente información para evaluar la adecuación temporal.";

  if (!linked.length) {
    status = sensitive ? "TEMPORALLY_UNASSESSED" : "CURRENTLY_SUPPORTED";
    reason = sensitive ? "El claim es temporalmente sensible pero todavía no tiene evidencia vinculada." : "El claim no presenta una exigencia temporal específica y no hay evidencia que revisar.";
  } else if (superseded) {
    status = "SUPERSEDED";
    reason = "Una evidencia vinculada está marcada como sustituida y no debe utilizarse como estado vigente.";
  } else if (noTemporalData && sensitive) {
    status = "TEMPORALLY_UNASSESSED";
    reason = "El claim requiere control temporal y parte de la evidencia carece de información temporal suficiente.";
  } else if (years.length && evidenceYears.length && !years.some((year) => evidenceYears.includes(year))) {
    status = "PARTIALLY_TIME_ALIGNED";
    reason = "Las fechas expresadas por el claim no coinciden plenamente con las fechas disponibles en la evidencia.";
  } else if (sensitive && latest && latest > currentCaseDate) {
    status = "TEMPORALLY_CONTESTED";
    reason = "La evidencia contiene una referencia temporal posterior a la fecha de creación del caso y requiere revisión.";
  } else if (sensitive) {
    status = "CURRENTLY_SUPPORTED";
    reason = "La evidencia contiene información temporal compatible con el alcance del claim.";
  } else if (years.length && evidenceYears.length && years.every((year) => evidenceYears.includes(year))) {
    status = "HISTORICALLY_SUPPORTED";
    reason = "La evidencia cubre el periodo histórico expresado por el claim.";
  } else {
    status = "CURRENTLY_SUPPORTED";
    reason = "No se detecta un desajuste temporal material en la evidencia disponible.";
  }

  assessments.push({
    claim_id: claim.claim_id,
    type: claim.type,
    importance: claim.importance ?? "CENTRAL",
    temporal_requirement: sensitive,
    status,
    reason,
    evidence_ids: linked.map((item) => item.evidence_id).filter(Boolean),
    claim_years: years,
    evidence_years: [...new Set(evidenceYears)],
    latest_evidence_date: latest?.toISOString() ?? null,
    checks: {
      temporal_data_present: linked.length === 0 ? false : linked.every(hasTemporalData),
      explicit_period_match: years.length === 0 || years.some((year) => evidenceYears.includes(year)),
      superseded_evidence: superseded,
    },
  });
}

const current = assessments.filter((item) => item.status === "CURRENTLY_SUPPORTED");
const historical = assessments.filter((item) => item.status === "HISTORICALLY_SUPPORTED");
const partial = assessments.filter((item) => item.status === "PARTIALLY_TIME_ALIGNED");
const contested = assessments.filter((item) => ["STALE_EVIDENCE", "SUPERSEDED", "TEMPORALLY_CONTESTED"].includes(item.status));
const unresolved = assessments.filter((item) => item.status === "TEMPORALLY_UNASSESSED");

record.temporal_verification = {
  assessed_at: new Date().toISOString(),
  status: contested.length ? "REVIEW_REQUIRED" : (current.length || historical.length ? "ASSESSED" : "UNASSESSED"),
  claims: assessments,
  currently_supported_claims: current.map((item) => item.claim_id),
  historically_supported_claims: historical.map((item) => item.claim_id),
  partially_aligned_claims: partial.map((item) => item.claim_id),
  contested_claims: contested.map((item) => item.claim_id),
  unresolved_claims: unresolved.map((item) => item.claim_id),
  rule: "La fecha y el periodo forman parte de la evaluación de la evidencia cuando el claim puede cambiar con el tiempo. Adecuación temporal no equivale a verdad material.",
};

record.workflow = record.workflow ?? {};
record.workflow.temporal_verification = contested.length ? "TEMPORAL_REVIEW_REQUIRED" : "TEMPORAL_ASSESSED";
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: "El control temporal no sustituye la verificación ni la aprobación editorial humana.",
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — TEMPORAL VERIFICATION ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Claims evaluados: ${assessments.length}`);
for (const item of assessments) console.log(`- ${item.claim_id}: ${item.status}`);
console.log(`\nActuales: ${current.length}`);
console.log(`Históricos: ${historical.length}`);
console.log(`Parcialmente alineados: ${partial.length}`);
console.log(`En revisión: ${contested.length}`);
console.log(`Sin evaluar: ${unresolved.length}`);
console.log("El control temporal no equivale a verificación de verdad.");

if (!assessments.length) process.exitCode = 2;
