#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import crypto from "node:crypto";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
if (!caseId) {
  console.error("Uso: npm run web:research -- --case CASE-########");
  process.exit(1);
}

const file = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(file)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(file, "utf8"));
const plans = Array.isArray(record.research_plan) ? record.research_plan : [];
if (!plans.length) {
  console.error("✖ El caso no contiene un research_plan. Ejecuta primero research:plan.");
  process.exit(1);
}

const queries = [];
for (const plan of plans) {
  for (const question of plan.search_questions ?? []) {
    queries.push({
      claim_id: plan.claim_id,
      priority: plan.priority,
      query: question,
    });
  }
}

const queryHash = crypto.createHash("sha256").update(JSON.stringify(queries)).digest("hex").slice(0, 12).toUpperCase();
record.web_research = {
  generated_at: new Date().toISOString(),
  status: "SEARCH_PLAN_READY",
  query_set_id: `QRY-${queryHash}`,
  queries,
  evidence_imported: 0,
  note: "Este comando prepara consultas documentales. La recuperación web y la aceptación de evidencias requieren una capa de búsqueda/revisión que no debe simular resultados.",
};
record.workflow = record.workflow ?? {};
record.workflow.sources = "WEB_RESEARCH_PLAN_READY";
record.workflow.evidence = "AWAITING_DOCUMENTARY_RETRIEVAL";
record.publication = {
  ...(record.publication ?? {}),
  allowed: false,
  reason: "La investigación web ha generado un plan de búsqueda, pero todavía no se ha incorporado evidencia documental aceptada.",
};

fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — WEB EVIDENCE ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Consultas preparadas: ${queries.length}`);
console.log(`✓ Lote de consultas: QRY-${queryHash}`);
console.log("⚠ No se han inventado resultados ni evidencias.");
console.log("⚠ El caso sigue sin estar listo para publicación.");
