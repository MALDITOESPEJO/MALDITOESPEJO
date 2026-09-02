#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const i = args.indexOf('--case');
const caseId = i >= 0 ? args[i + 1] : null;
if (!caseId) {
  console.error('Uso: npm run scope -- --case CASE-########');
  process.exit(1);
}

const casePath = path.join('editorial', 'cases', `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, 'utf8'));
const assessments = record.verification?.claims ?? [];
const verified = new Set(record.verification?.verified_claims ?? []);
const dependencies = record.dependencies?.relations ?? [];

const excluded = [];
const candidates = [];

for (const claim of assessments) {
  if (claim.status !== 'VERIFIED' || !verified.has(claim.claim_id)) {
    excluded.push({ claim_id: claim.claim_id, reason: `Estado de verificación: ${claim.status}` });
    continue;
  }

  const deps = dependencies.filter((d) => d.to_claim_id === claim.claim_id);
  const unresolved = deps.filter((d) => !verified.has(d.from_claim_id));
  if (unresolved.length) {
    excluded.push({ claim_id: claim.claim_id, reason: 'Depende de afirmaciones no verificadas.' });
    continue;
  }

  candidates.push(claim.claim_id);
}

const central = assessments.filter((c) => c.importance === 'CENTRAL' || !c.importance);
const centralVerified = central.filter((c) => candidates.includes(c.claim_id));
const centralBlocked = central.filter((c) => !candidates.includes(c.claim_id));

let coherence = 'REQUIRES_EDITORIAL_REVIEW';
let status = 'NONE';
let recommendation = 'NO PUBLICAR TODAVÍA';

if (candidates.length > 0) {
  status = centralBlocked.length === 0 ? 'AVAILABLE' : 'PARTIAL';
  if (centralBlocked.length === 0) {
    coherence = 'CENTRAL_SCOPE_VERIFIED';
    recommendation = 'Puede pasar a revisión editorial, sujeto a los demás controles.';
  } else {
    coherence = 'CENTRAL_CLAIM_BLOCKED';
    recommendation = 'Requiere revisión humana para determinar si el subconjunto verificado constituye una noticia coherente sin alterar el sentido.';
  }
}

record.publishable_scope = {
  status,
  claim_ids: candidates,
  excluded_claims: excluded,
  central_claims: central.map((c) => c.claim_id),
  central_verified: centralVerified.map((c) => c.claim_id),
  central_blocked: centralBlocked.map((c) => c.claim_id),
  coherence,
  recommendation,
  evaluated_at: new Date().toISOString(),
};

record.workflow = { ...(record.workflow ?? {}), scope: status === 'NONE' ? 'NO_PUBLISHABLE_SCOPE' : 'SCOPE_DEFINED' };
record.publication = { ...(record.publication ?? {}), allowed: false };

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
console.log('MALDITOESPEJO — PUBLISHABLE SCOPE ENGINE');
console.log(`Caso: ${caseId}`);
console.log(`Claims candidatas: ${candidates.length}`);
console.log(`Claims excluidas: ${excluded.length}`);
console.log(`Estado: ${status}`);
console.log(`Coherencia: ${coherence}`);
console.log(`Recomendación: ${recommendation}`);
