#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const args = process.argv.slice(2);
const caseIndex = args.indexOf('--case');
const caseId = caseIndex >= 0 ? args[caseIndex + 1] : null;
const typeIndex = args.indexOf('--type');
const type = typeIndex >= 0 ? args[typeIndex + 1] : null;
const aIndex = args.indexOf('--a');
const bIndex = args.indexOf('--b');
const a = aIndex >= 0 ? Number(args[aIndex + 1]) : NaN;
const b = bIndex >= 0 ? Number(args[bIndex + 1]) : NaN;

if (!caseId || !type || !Number.isFinite(a) || !Number.isFinite(b)) {
  console.error('Uso: npm run calculate -- --case CASE-######## --type DIFFERENCE|PERCENTAGE_CHANGE|PERCENTAGE_POINTS --a NUM --b NUM');
  process.exit(1);
}

const casePath = path.join('editorial', 'cases', `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`Caso no encontrado: ${casePath}`);
  process.exit(1);
}

const supported = new Set(['DIFFERENCE', 'PERCENTAGE_CHANGE', 'PERCENTAGE_POINTS']);
if (!supported.has(type)) {
  console.error(`Tipo de cálculo no soportado: ${type}`);
  process.exit(1);
}

let result;
let formula;
let status = 'VALID';

if (type === 'DIFFERENCE') {
  result = a - b;
  formula = 'a - b';
} else if (type === 'PERCENTAGE_CHANGE') {
  if (b === 0) {
    status = 'INVALID_INPUTS';
  } else {
    result = ((a - b) / b) * 100;
    formula = '(a - b) / b × 100';
  }
} else {
  result = a - b;
  formula = 'a - b (puntos porcentuales)';
}

const record = JSON.parse(fs.readFileSync(casePath, 'utf8'));
record.calculations ??= [];
record.calculations.push({
  calculation_id: `CALC-${String(record.calculations.length + 1).padStart(8, '0')}`,
  type,
  inputs: { a, b },
  formula,
  result: status === 'VALID' ? result : null,
  status,
  verification_status: status === 'VALID' ? 'DERIVATION_REPRODUCIBLE' : 'UNVERIFIED',
  interpretation_status: 'REQUIRES_EDITORIAL_REVIEW',
  created_at: new Date().toISOString(),
});

record.workflow ??= {};
record.workflow.calculation = status === 'VALID' ? 'CALCULATION_RECORDED' : 'CALCULATION_BLOCKED';
record.publication = { ...(record.publication ?? {}), allowed: false };

fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, 'utf8');
console.log(`Cálculo registrado: ${type} → ${status}`);
if (status === 'VALID') console.log(`Resultado: ${result}`);
console.log('La interpretación editorial requiere revisión humana.');
