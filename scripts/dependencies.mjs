#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const TYPES = new Set(["DIRECT", "DERIVED", "CONDITIONAL", "CONTEXTUAL", "EDITORIAL"]);

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
if (!caseId || !/^CASE-\d{8}$/.test(caseId)) {
  console.error("Uso: npm run dependencies -- --case CASE-########");
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
  console.error(`✖ Caso JSON inválido: ${error.message}`);
  process.exit(1);
}

const claims = Array.isArray(record.claims) ? record.claims : [];
if (!claims.length) {
  console.error("✖ El caso no contiene claims. Ejecuta primero el Claims Engine.");
  process.exit(1);
}

// Dependencies are deliberately explicit. The engine never guesses that two claims
// depend on each other merely because they appear in the same story.
const existing = Array.isArray(record.claim_dependencies) ? record.claim_dependencies : [];
const valid = [];
const errors = [];
const claimIds = new Set(claims.map((claim) => claim.claim_id));

for (const dependency of existing) {
  const from = dependency.from_claim_id;
  const to = dependency.to_claim_id;
  const type = dependency.type;
  if (!claimIds.has(from)) errors.push(`${from ?? "?"}: claim origen inexistente`);
  if (!claimIds.has(to)) errors.push(`${to ?? "?"}: claim destino inexistente`);
  if (!TYPES.has(type)) errors.push(`${from ?? "?"} → ${to ?? "?"}: tipo de dependencia inválido`);
  if (from === to) errors.push(`${from}: dependencia consigo misma`);
  if (from && to && TYPES.has(type) && claimIds.has(from) && claimIds.has(to) && from !== to) {
    valid.push({ from_claim_id: from, to_claim_id: to, type });
  }
}

// Detect directed cycles using DFS.
const graph = new Map();
for (const claimId of claimIds) graph.set(claimId, []);
for (const dependency of valid) graph.get(dependency.from_claim_id).push(dependency.to_claim_id);

const visiting = new Set();
const visited = new Set();
const cycles = [];
function dfs(node, trail = []) {
  if (visiting.has(node)) {
    const start = trail.indexOf(node);
    cycles.push([...trail.slice(start), node]);
    return;
  }
  if (visited.has(node)) return;
  visiting.add(node);
  for (const next of graph.get(node) ?? []) dfs(next, [...trail, node]);
  visiting.delete(node);
  visited.add(node);
}
for (const claimId of claimIds) dfs(claimId);

const blockingStatuses = new Set(["PENDING", "UNKNOWN", "CONTESTED", "RECHECK_REQUIRED"]);
const affected = [];
for (const dependency of valid) {
  const source = claims.find((claim) => claim.claim_id === dependency.from_claim_id);
  if (source && blockingStatuses.has(source.verification_status)) {
    affected.push({
      claim_id: dependency.to_claim_id,
      depends_on: dependency.from_claim_id,
      dependency_type: dependency.type,
      reason: `Depende de ${dependency.from_claim_id}, cuyo estado es ${source.verification_status}.`,
      review_required: true,
    });
  }
}

record.claim_dependencies = valid;
record.dependency_analysis = {
  version: "1.0",
  analyzed_at: new Date().toISOString(),
  explicit_only: true,
  dependency_count: valid.length,
  affected_claims: [...new Map(affected.map((item) => [item.claim_id, item])).values()],
  cycles,
  status: cycles.length ? "REVIEW_REQUIRED" : affected.length ? "DEPENDENCY_REVIEW_REQUIRED" : "ASSESSED",
  rule: "Las dependencias no se infieren por proximidad temática. Una afirmación derivada no puede superar el estado de certeza de sus dependencias.",
};

record.workflow = {
  ...(record.workflow ?? {}),
  dependencies: record.dependency_analysis.status,
};

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

if (errors.length) {
  console.error("✖ Dependencias inválidas:");
  errors.forEach((error) => console.error(`  - ${error}`));
  process.exit(1);
}

console.log("MALDITOESPEJO — CLAIM DEPENDENCY ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Dependencias analizadas: ${valid.length}`);
console.log(`✓ Claims afectados por estados pendientes/bloqueantes: ${affected.length}`);
console.log(`✓ Ciclos detectados: ${cycles.length}`);
console.log(`✓ Estado: ${record.dependency_analysis.status}`);
console.log("⚠ El motor identifica impacto de revisión; no determina la verdad de los claims.");
