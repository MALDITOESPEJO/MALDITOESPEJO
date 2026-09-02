#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
const caseId = arg("--case");
if (!caseId) { console.error("Uso: npm run contradictions -- --case CASE-########"); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`✖ No existe el caso: ${caseId}`); process.exit(1); }
let record;
try { record = JSON.parse(fs.readFileSync(casePath, "utf8")); } catch (error) { console.error(`✖ JSON inválido: ${error.message}`); process.exit(1); }

const claims = Array.isArray(record.claims) ? record.claims : [];
const evidence = Array.isArray(record.evidence) ? record.evidence : [];
const dependencyRelations = Array.isArray(record.dependencies?.relations) ? record.dependencies.relations : [];
const contrastClaims = Array.isArray(record.contrast?.claims) ? record.contrast.claims : [];
const items = [];
const affectedClaims = new Set();

for (const assessment of contrastClaims) {
  const opposing = Array.isArray(assessment.opposing_evidence) ? assessment.opposing_evidence : [];
  if (!opposing.length) continue;
  const linked = evidence.filter((item) => item.claim_id === assessment.claim_id);
  const supporting = linked.filter((item) => item.assessment === "SUPPORTS");
  const material = opposing.length > 0;
  affectedClaims.add(assessment.claim_id);
  items.push({
    claim_id: assessment.claim_id,
    conflict_type: "FACTUAL_OR_DOCUMENTARY",
    material,
    evidence_for: supporting.map((item) => item.evidence_id),
    evidence_against: opposing,
    status: "MATERIAL_CONFLICT_REQUIRES_RECHECK",
    action: "RECHECK_SOURCE_AUTHORITY_PROVENANCE_TEMPORALITY_AND_DOCUMENTARY_SUPPORT",
  });
}

// Propagate only through explicitly declared dependency links; do not block unrelated claims.
const propagated = new Set(affectedClaims);
let changed = true;
while (changed) {
  changed = false;
  for (const relation of dependencyRelations) {
    const parent = relation.parent_claim_id ?? relation.depends_on ?? relation.source_claim_id;
    const child = relation.child_claim_id ?? relation.claim_id ?? relation.dependent_claim_id;
    if (parent && child && propagated.has(parent) && !propagated.has(child)) { propagated.add(child); changed = true; }
  }
}

const centralClaims = claims.filter((claim) => claim.importance === "CENTRAL" || claim.priority === "CENTRAL").map((claim) => claim.claim_id);
const centralAffected = centralClaims.filter((id) => propagated.has(id));
const materialConflict = items.some((item) => item.material);

record.contradiction_resolution = {
  assessed_at: new Date().toISOString(),
  status: materialConflict ? "MATERIAL_CONFLICT_REQUIRES_RECHECK" : "NO_CONFLICT",
  conflicts: items,
  directly_affected_claim_ids: [...affectedClaims],
  dependency_affected_claim_ids: [...propagated].filter((id) => !affectedClaims.has(id)),
  central_claims_affected: centralAffected,
  publication_scope_action: materialConflict ? "EXCLUDE_AFFECTED_UNTIL_RECHECK" : "NO_CHANGE",
  human_review_required: materialConflict,
  rule: "Un conflicto afecta a los claims relacionados; no bloquea automáticamente afirmaciones independientes.",
};

record.workflow = { ...(record.workflow ?? {}), contradiction_resolution: materialConflict ? "RECHECK_REQUIRED" : "NO_CONFLICT" };
if (materialConflict) record.status = "RECHECK_REQUIRED";
record.publication = { allowed: false, reason: materialConflict ? "Existe un conflicto que requiere nueva comprobación." : "La resolución de contradicciones no sustituye la verificación ni la aprobación editorial." };
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");
console.log("MALDITOESPEJO — CONTRADICTION RESOLUTION ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Conflictos detectados: ${items.length}`);
console.log(`Claims afectados: ${affectedClaims.size}`);
console.log(`Claims afectados por dependencia: ${[...propagated].filter((id) => !affectedClaims.has(id)).length}`);
console.log(`Claims centrales afectados: ${centralAffected.length}`);
console.log(materialConflict ? "✖ RECHECK_REQUIRED: la publicación queda bloqueada hasta nueva comprobación." : "✓ No se han detectado conflictos que requieran reducción del alcance.");
