#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const BLOCKING = new Set(["PENDING", "UNKNOWN", "CONTESTED", "RECHECK_REQUIRED", "INSUFFICIENT"]);
const PARTIAL = "PARTIALLY_VERIFIED";

function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
if (!caseId || !/^CASE-\d{8}$/.test(caseId)) { console.error("Uso: npm run uncertainty:propagate -- --case CASE-########"); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`✖ No existe el caso: ${caseId}`); process.exit(1); }
let record;
try { record = JSON.parse(fs.readFileSync(casePath, "utf8")); } catch (error) { console.error(`✖ Caso JSON inválido: ${error.message}`); process.exit(1); }

const claims = Array.isArray(record.claims) ? record.claims : [];
const verification = new Map((record.verification?.claims ?? []).map((item) => [item.claim_id, item.status]));
for (const claim of claims) if (!verification.has(claim.claim_id) && claim.verification_status) verification.set(claim.claim_id, claim.verification_status);
const relations = Array.isArray(record.claim_dependencies) ? record.claim_dependencies : Array.isArray(record.dependencies?.relations) ? record.dependencies.relations : [];
const bySource = new Map();
for (const relation of relations) {
  const from = relation.from_claim_id ?? relation.depends_on ?? relation.source_claim_id;
  const to = relation.to_claim_id ?? relation.claim_id ?? relation.dependent_claim_id;
  if (!from || !to) continue;
  if (!bySource.has(from)) bySource.set(from, []);
  bySource.get(from).push({ claim_id: to, type: relation.type ?? relation.dependency_type ?? "UNSPECIFIED" });
}

const impacted = new Map();
const queue = [];
for (const claim of claims) {
  const status = verification.get(claim.claim_id);
  if (BLOCKING.has(status) || status === PARTIAL) queue.push({ claim_id: claim.claim_id, status, depth: 0, root: claim.claim_id });
}
while (queue.length) {
  const current = queue.shift();
  for (const dependent of bySource.get(current.claim_id) ?? []) {
    const key = `${dependent.claim_id}:${current.root}`;
    if (impacted.has(key)) continue;
    const inherited = BLOCKING.has(current.status) ? "RECHECK_REQUIRED" : "PARTIALLY_VERIFIED";
    const item = { claim_id: dependent.claim_id, depends_on: current.claim_id, root_dependency: current.root, dependency_type: dependent.type, inherited_status: inherited, depth: current.depth + 1, review_required: true };
    impacted.set(key, item);
    queue.push({ claim_id: dependent.claim_id, status: inherited, depth: current.depth + 1, root: current.root });
  }
}

const affectedClaimIds = [...new Set([...impacted.values()].map((item) => item.claim_id))];
const affectedCentral = claims.filter((claim) => affectedClaimIds.includes(claim.claim_id) && ["CENTRAL", "HIGH", "MATERIAL"].includes(claim.importance ?? claim.priority)).map((claim) => claim.claim_id);
const centralVerified = new Set(record.verification?.verified_claims ?? []);
for (const claimId of affectedClaimIds) centralVerified.delete(claimId);

record.uncertainty_propagation = {
  version: "1.0",
  assessed_at: new Date().toISOString(),
  status: impacted.size ? (affectedCentral.length ? "MATERIAL_REVIEW_REQUIRED" : "UNCERTAINTY_PROPAGATED") : "STABLE",
  impacted_claims: [...impacted.values()],
  affected_claim_ids: affectedClaimIds,
  affected_central_claims: affectedCentral,
  publishable_verified_claims_after_propagation: [...centralVerified],
  headline_review_required: affectedCentral.length > 0,
  dek_review_required: affectedCentral.length > 0,
  rule: "Una afirmación derivada no puede superar el estado de certeza de las afirmaciones de las que depende.",
};
record.workflow = { ...(record.workflow ?? {}), uncertainty_propagation: record.uncertainty_propagation.status };
record.publication = { allowed: false, reason: "La propagación de incertidumbre requiere revisar el alcance antes de cualquier aprobación editorial." };
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — CLAIM DEPENDENCY & UNCERTAINTY PROPAGATION ENGINE");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Dependencias: ${relations.length}`);
console.log(`✓ Claims afectados: ${affectedClaimIds.length}`);
console.log(`✓ Claims centrales afectados: ${affectedCentral.length}`);
console.log(`✓ Estado: ${record.uncertainty_propagation.status}`);
console.log("⚠ La propagación activa revisión; no declara por sí sola que una afirmación sea falsa.");
