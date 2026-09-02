#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const getArg = (name) => { const i = args.indexOf(name); return i >= 0 ? args[i + 1] : null; };
const caseId = getArg('--case');

if (!caseId) {
  console.error('Uso: npm run scope:guard -- --case CASE-########');
  process.exit(1);
}

const casePath = path.join('editorial', 'cases', `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, 'utf8'));
const scope = record.publishable_scope ?? {};
const approved = new Set(scope.claim_ids ?? record.verification?.verified_claims ?? []);
const assessments = new Map((record.verification?.claims ?? []).map((c) => [c.claim_id, c]));
const dependencies = record.dependencies?.relations ?? [];
const checks = [];

for (const claimId of approved) {
  const assessment = assessments.get(claimId);
  if (!assessment || assessment.status !== 'VERIFIED') {
    checks.push({ claim_id: claimId, status: 'BLOCKED', reason: 'La claim incluida en el alcance no figura como VERIFIED.' });
    continue;
  }
  const deps = dependencies.filter((d) => d.to_claim_id === claimId);
  const badDeps = deps.filter((d) => !approved.has(d.from_claim_id));
  checks.push({
    claim_id: claimId,
    status: badDeps.length ? 'BLOCKED' : 'PASS',
    reason: badDeps.length ? `Dependencias fuera de alcance: ${badDeps.map((d) => d.from_claim_id).join(', ')}` : 'Claim y dependencias dentro del alcance verificado.'
  });
}

const blocked = checks.filter((c) => c.status === 'BLOCKED');
const status = blocked.length ? 'BLOCKED_OUT_OF_SCOPE' : approved.size ? 'PASS' : 'REVIEW_REQUIRED';

record.article_scope_guard = {
  checked_at: new Date().toISOString(),
  status,
  approved_claim_ids: [...approved],
  checks,
  rule: 'Ninguna afirmación factual material del artículo puede quedar fuera del alcance verificado aprobado.',
};
record.workflow = { ...(record.workflow ?? {}), article_scope_guard: status };
record.publication = { ...(record.publication ?? {}), allowed: false };

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
console.log('MALDITOESPEJO — ARTICLE SCOPE GUARD');
console.log(`Caso: ${caseId}`);
console.log(`Claims dentro del alcance: ${approved.size}`);
console.log(`Resultado: ${status}`);
console.log(`Publicación automática: BLOQUEADA`);

if (blocked.length) process.exitCode = 2;
