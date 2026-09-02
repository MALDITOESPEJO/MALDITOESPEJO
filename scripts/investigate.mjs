#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");

function usage() {
  console.log(`MALDITOESPEJO — CASE ENGINE\n\nUso:\n  npm run investigate -- --title "Título de la pista"\n  npm run investigate -- --input ruta/al/archivo.txt\n  npm run investigate -- --json ruta/al/entrada.json\n\nEl comando crea un caso en estado INPUT. No realiza investigación web por sí mismo y nunca certifica una noticia.`);
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

if (!title && !inputPath && !jsonPath) {
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
} else {
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
