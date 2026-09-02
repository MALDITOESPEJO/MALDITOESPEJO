#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const registryPath = path.join(root, 'editorial', 'sources', 'PROVENANCE_LINEAGE_REGISTRY.csv');

if (!fs.existsSync(registryPath)) {
  console.error(`PROVENANCE LINEAGE ERROR: no existe ${registryPath}`);
  process.exit(1);
}

const text = fs.readFileSync(registryPath, 'utf8').replace(/^\uFEFF/, '').trim();
const lines = text ? text.split(/\r?\n/) : [];

if (lines.length < 2) {
  console.log('PROVENANCE LINEAGE OK: registro sin entradas materiales; no se puede certificar corroboración.');
  process.exit(0);
}

const header = lines[0].split(',').map((v) => v.trim());
const required = ['lineage_id', 'evidence_id', 'source_id', 'independence_group', 'relation_type'];
const missing = required.filter((field) => !header.includes(field));

if (missing.length) {
  console.error(`PROVENANCE LINEAGE ERROR: faltan columnas: ${missing.join(', ')}`);
  process.exit(1);
}

const index = Object.fromEntries(header.map((name, i) => [name, i]));
const errors = [];
const warnings = [];
const seenLineages = new Set();
const seenEvidence = new Set();
const groups = new Map();

for (let i = 1; i < lines.length; i += 1) {
  const raw = lines[i];
  if (!raw.trim()) continue;
  const cols = raw.split(',');
  const row = Object.fromEntries(header.map((name, j) => [name, (cols[j] ?? '').trim()]));
  const lineNo = i + 1;

  if (!row.lineage_id || !row.evidence_id || !row.source_id || !row.independence_group || !row.relation_type) {
    errors.push(`Línea ${lineNo}: registro incompleto.`);
    continue;
  }

  if (seenLineages.has(row.lineage_id)) errors.push(`Línea ${lineNo}: lineage_id duplicado: ${row.lineage_id}`);
  seenLineages.add(row.lineage_id);

  if (seenEvidence.has(row.evidence_id)) warnings.push(`Línea ${lineNo}: evidence_id reutilizado: ${row.evidence_id}`);
  seenEvidence.add(row.evidence_id);

  if (!groups.has(row.independence_group)) groups.set(row.independence_group, []);
  groups.get(row.independence_group).push(row.source_id);

  if (/^(UNKNOWN|TBD|UNSET)$/i.test(row.independence_group)) {
    warnings.push(`Línea ${lineNo}: independencia aún no establecida para ${row.evidence_id}.`);
  }
}

for (const [group, sources] of groups) {
  const uniqueSources = [...new Set(sources)];
  if (uniqueSources.length > 1) {
    warnings.push(`Grupo ${group}: ${uniqueSources.length} fuentes comparten el mismo grupo de independencia; no deben contarse automáticamente como corroboraciones independientes.`);
  }
}

if (errors.length) {
  console.error('PROVENANCE LINEAGE BLOQUEADO');
  errors.forEach((error) => console.error(`- ${error}`));
  warnings.forEach((warning) => console.warn(`- WARNING: ${warning}`));
  process.exit(1);
}

console.log(`PROVENANCE LINEAGE OK: ${seenLineages.size} registros, ${groups.size} grupos de independencia.`);
warnings.forEach((warning) => console.warn(`WARNING: ${warning}`));
console.log('La comprobación no determina por sí sola la verdad de una afirmación ni la independencia material de la evidencia.');
