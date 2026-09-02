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
  console.error("Uso: npm run source:authority -- --case CASE-########");
  process.exit(1);
}

const file = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(file)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(file, "utf8"));
const sources = record.resolved_sources ?? [];
const classifications = [];

for (const source of sources) {
  const nature = String(source.source_nature ?? "").toUpperCase();
  const type = String(source.source_type ?? "").toUpperCase();
  const role = String(source.editorial_role ?? "").toUpperCase();
  const primary = source.primary_evidence_available === "YES";

  let authority_class = "REVIEW_REQUIRED";
  let reason = "No existe información suficiente para clasificar la naturaleza de la evidencia.";

  if (nature === "PRIMARY" && primary) {
    authority_class = "PRIMARY_DIRECT";
    reason = "El registro identifica la fuente como primaria y declara disponibilidad de evidencia primaria.";
  } else if (type.includes("JUDICI") || type.includes("COURT") || type.includes("LEGAL")) {
    authority_class = "OFFICIAL_DIRECT";
    reason = "Fuente jurídica institucional; debe comprobarse el documento concreto y su estado procesal.";
  } else if (role.includes("DISCOVERY") && nature === "SECONDARY") {
    authority_class = "SECONDARY_REPRODUCTION";
    reason = "Fuente secundaria utilizada como pista o reproducción; no sustituye la evidencia primaria.";
  } else if (nature === "DATA_RESEARCH" || nature === "INVESTIGATIVE") {
    authority_class = "SPECIALIST_CONTEXT";
    reason = "Fuente de investigación o análisis; requiere comprobar el soporte documental del claim.";
  } else if (nature === "SECONDARY") {
    authority_class = "SECONDARY_REPRODUCTION";
    reason = "Fuente secundaria; debe rastrearse el origen de la información cuando el claim sea central.";
  } else if (nature === "PRIMARY") {
    authority_class = "OFFICIAL_DIRECT";
    reason = "Fuente primaria registrada, pero la disponibilidad o alcance de evidencia primaria requiere comprobación.";
  }

  classifications.push({
    source_id: source.resolved_source_id,
    source_name: source.source_name,
    authority_class,
    primary_evidence_available: primary,
    reason,
    verification_required: true,
  });
}

record.source_authority = {
  assessed_at: new Date().toISOString(),
  classifications,
  rule: "La autoridad de una fuente no demuestra por sí sola todo el claim. La clasificación es una ayuda para priorizar evidencia y requiere comprobación del documento concreto.",
};
record.workflow = record.workflow ?? {};
record.workflow.source_authority = classifications.length ? "CLASSIFIED_REQUIRES_DOCUMENT_CHECK" : "SOURCE_AUTHORITY_PENDING";
record.publication = { ...(record.publication ?? {}), allowed: false, reason: "La autoridad de las fuentes no equivale a verificación de los claims." };
fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — SOURCE AUTHORITY ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Fuentes clasificadas: ${classifications.length}`);
console.log("⚠ La clasificación no certifica autenticidad, verdad ni suficiencia del claim.");
