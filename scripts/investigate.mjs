#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const DEFAULT_INTAKE = path.join(ROOT, "editorial", "radars", "daily-news-editorial-intake.json");

function usage() {
  console.log(`MALDITOESPEJO — CASE ENGINE\n\nUso:\n  npm run investigate -- --title "Título de la pista"\n  npm run investigate -- --input ruta/al/archivo.txt\n  npm run investigate -- --json ruta/al/entrada.json\n  npm run investigate -- --intake INTAKE-YYYYMMDDHHMMSS-001\n\nEl comando crea un caso en estado INPUT. No realiza investigación web por sí mismo y nunca certifica una noticia.`);
}

function getArg(name) {
  const index = process.argv.indexOf(name);
  return index >= 0 ? process.argv[index + 1] : null;
}

if (process.argv.includes("--help") || process.argv.includes("-h")) {
  usage();
  process.exit(0);
}

const title = getArg("--title");
const inputPath = getArg("--input");
const jsonPath = getArg("--json");
const intakeId = getArg("--intake");

const modes = [Boolean(title), Boolean(inputPath), Boolean(jsonPath), Boolean(intakeId)].filter(Boolean).length;
if (modes !== 1) {
  usage();
  process.exit(1);
}

let input = {};

if (title) {
  input = { input_type: "news_lead", input_reference: title };
} else if (inputPath) {
  const absolute = path.resolve(ROOT, inputPath);
  if (!fs.existsSync(absolute)) {
    console.error(`✖ No existe la entrada: ${inputPath}`);
    process.exit(1);
  }
  input = {
    input_type: "document",
    input_reference: path.relative(ROOT, absolute),
    input_text: fs.readFileSync(absolute, "utf8"),
  };
} else if (jsonPath) {
  const absolute = path.resolve(ROOT, jsonPath);
  if (!fs.existsSync(absolute)) {
    console.error(`✖ No existe la entrada JSON: ${jsonPath}`);
    process.exit(1);
  }
  try {
    input = JSON.parse(fs.readFileSync(absolute, "utf8"));
  } catch (error) {
    console.error(`✖ JSON de entrada inválido: ${error.message}`);
    process.exit(1);
  }
} else {
  if (!fs.existsSync(DEFAULT_INTAKE)) {
    console.error(`✖ No existe la cola de intake: ${path.relative(ROOT, DEFAULT_INTAKE)}`);
    process.exit(1);
  }
  let intake;
  try {
    intake = JSON.parse(fs.readFileSync(DEFAULT_INTAKE, "utf8"));
  } catch (error) {
    console.error(`✖ Intake JSON inválido: ${error.message}`);
    process.exit(1);
  }
  if (!Array.isArray(intake.items)) {
    console.error("✖ La cola de intake no contiene items válidos.");
    process.exit(1);
  }
  const item = intake.items.find(candidate => candidate.intake_id === intakeId);
  if (!item) {
    console.error(`✖ No se encontró el intake: ${intakeId}`);
    process.exit(1);
  }
  if (item.status !== "PENDING_EDITORIAL_REVIEW") {
    console.error(`✖ El intake ${intakeId} no está pendiente de revisión editorial: ${item.status}`);
    process.exit(1);
  }
  input = {
    input_type: "news_radar_intake",
    input_reference: intakeId,
    intake_source: path.relative(ROOT, DEFAULT_INTAKE),
    radar_execution_id: intake.radar_execution_id || null,
    intake: item,
  };
}

const fingerprint = crypto
  .createHash("sha256")
  .update(JSON.stringify(input))
  .digest("hex")
  .slice(0, 8)
  .toUpperCase();

const existing = fs.existsSync(CASES_DIR)
  ? fs.readdirSync(CASES_DIR).filter((name) => /^CASE-\d{8}\.json$/.test(name))
  : [];

if (intakeId) {
  for (const name of existing) {
    const existingPath = path.join(CASES_DIR, name);
    try {
      const existingCase = JSON.parse(fs.readFileSync(existingPath, "utf8"));
      if (existingCase?.input?.input_type === "news_radar_intake" && existingCase?.input?.input_reference === intakeId) {
        console.error(`✖ El intake ${intakeId} ya originó el caso ${existingCase.case_id}.`);
        process.exit(1);
      }
    } catch {
      // A malformed historical case is handled by the existing case validators.
    }
  }
}

const numbers = existing.map((name) => Number(name.slice(5, 13))).filter(Number.isFinite);
const nextNumber = (numbers.length ? Math.max(...numbers) : 0) + 1;
const caseId = `CASE-${String(nextNumber).padStart(8, "0")}`;

const caseRecord = {
  case_id: caseId,
  created_at: new Date().toISOString(),
  status: "INPUT",
  input_fingerprint: fingerprint,
  input,
  workflow: {
    claims: "PENDING",
    sources: "PENDING",
    evidence: "PENDING",
    provenance: "PENDING",
    contradictions: "PENDING",
    verification: "PENDING",
    draft: "PENDING",
    validation: "PENDING",
    editorial_gate: "PENDING",
  },
  publication: {
    allowed: false,
    reason: "El caso acaba de entrar en el sistema y todavía no ha sido investigado y verificado.",
  },
};

fs.mkdirSync(CASES_DIR, { recursive: true });
const output = path.join(CASES_DIR, `${caseId}.json`);
fs.writeFileSync(output, `${JSON.stringify(caseRecord, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — CASE ENGINE");
console.log(`✓ Caso creado: ${caseId}`);
console.log(`✓ Estado: INPUT`);
console.log(`✓ Huella de entrada: ${fingerprint}`);
console.log(`✓ Archivo: ${path.relative(ROOT, output)}`);
console.log("⚠ El caso no está verificado y no puede publicarse.");
