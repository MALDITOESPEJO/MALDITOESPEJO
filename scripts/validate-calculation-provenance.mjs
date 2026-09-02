#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, 'editorial', 'cases');
const arg = (name) => { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; };
const caseId = arg('--case');
if (!caseId) { console.error('Uso: npm run validate:calculations -- --case CASE-########'); process.exit(1); }
const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) { console.error(`No existe el caso: ${caseId}`); process.exit(1); }
const record = JSON.parse(fs.readFileSync(casePath, 'utf8'));
const calculations = Array.isArray(record.calculations) ? record.calculations : [];
const claims = new Map((record.claims ?? []).map((c) => [c.claim_id, c]));
const errors = [];
const warnings = [];

for (const calc of calculations) {
  if (!calc.calculation_id || !calc.type || !calc.formula) errors.push(`${calc.calculation_id ?? '?'}: identidad o fórmula incompleta.`);
  if (calc.status === 'VALID' && !Number.isFinite(calc.result)) errors.push(`${calc.calculation_id}: resultado no reproducible.`);
  if (Array.isArray(calc.input_claim_ids)) {
    for (const id of calc.input_claim_ids) if (!claims.has(id)) errors.push(`${calc.calculation_id}: claim de entrada inexistente: ${id}.`);
  }
  if (Array.isArray(calc.input_evidence_ids) && calc.input_evidence_ids.length === 0) warnings.push(`${calc.calculation_id}: no hay evidencias de entrada identificadas.`);
  if (['STALE_INPUT','SUPERSEDED_INPUT','CONTESTED_INPUT','RECALCULATION_REQUIRED'].includes(calc.status)) warnings.push(`${calc.calculation_id}: requiere revisión antes de reutilizarse editorialmente.`);
}

record.calculation_validation = {
  checked_at: new Date().toISOString(),
  status: errors.length ? 'BLOCKED' : warnings.length ? 'REVIEW_REQUIRED' : 'PASS',
  errors,
  warnings,
  rule: 'Una cifra derivada solo puede reutilizarse si sus datos de entrada siguen siendo válidos y trazables.'
};
record.workflow = { ...(record.workflow ?? {}), calculation_validation: record.calculation_validation.status };
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
console.log(`VALIDACIÓN DE CÁLCULOS: ${record.calculation_validation.status}`);
if (errors.length) { errors.forEach((e) => console.error(`- ${e}`)); process.exit(1); }
