#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const dir = path.resolve('editorial/migration/certifications');
let blocked = 0;
let checked = 0;

if (!fs.existsSync(dir)) {
  console.log('No legacy certifications found. Migration remains open.');
  process.exit(0);
}

for (const file of fs.readdirSync(dir).filter((f) => f.endsWith('.json')).sort()) {
  checked += 1;
  const full = path.join(dir, file);
  let record;
  try { record = JSON.parse(fs.readFileSync(full, 'utf8')); }
  catch { console.error(`✖ ${file}: invalid JSON`); blocked += 1; continue; }

  const errors = [];
  for (const field of ['article','migration_status','claims_reconstructed','evidence_mapped','verification_completed','human_editorial_approval']) {
    if (!(field in record)) errors.push(`missing '${field}'`);
  }
  if (record.migration_status === 'CERTIFIED') {
    for (const field of ['claims_reconstructed','evidence_mapped','verification_completed','human_editorial_approval']) {
      if (record[field] !== true) errors.push(`CERTIFIED requires '${field}' = true`);
    }
    if (!record.publication_gate_id) errors.push('CERTIFIED requires publication_gate_id');
    if (!record.audit_event_id) errors.push('CERTIFIED requires audit_event_id');
  }
  if (record.migration_status === 'LEGACY_UNREVIEWED' || record.migration_status === 'LEGACY_IN_REVIEW') {
    if (record.human_editorial_approval === true) errors.push('unreviewed/in-review legacy record cannot carry editorial approval');
  }

  if (errors.length) {
    blocked += 1;
    console.error(`✖ ${file}`);
    errors.forEach((e) => console.error(`  - ${e}`));
  } else {
    console.log(`✓ ${file}: ${record.migration_status}`);
  }
}

console.log(`Certification records checked: ${checked}`);
console.log(`Invalid records: ${blocked}`);
process.exit(blocked ? 1 : 0);
