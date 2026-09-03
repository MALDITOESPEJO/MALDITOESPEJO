#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const registryPath = process.argv[2] || 'editorial/sources/MASTER_SOURCE_REGISTRY_NORMALIZED.csv';
const channelsPath = process.argv[3] || 'editorial/sources/MASTER_SOURCE_CHANNELS_BATCH_01.csv';
const output = process.argv[4] || 'editorial/radars/daily-source-coverage.json';
const candidatesPath = process.argv[5] || 'editorial/radars/daily-news-candidates.json';

function readCsv(file) {
  if (!fs.existsSync(file)) throw new Error(`File not found: ${file}`);
  const lines = fs.readFileSync(file, 'utf8').trim().split(/\r?\n/);
  if (!lines.length) return [];
  const headers = lines[0].split(',');
  return lines.slice(1).filter(Boolean).map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

const sources = readCsv(registryPath);
const channels = fs.existsSync(channelsPath) ? readCsv(channelsPath) : [];
let candidates = [];
if (fs.existsSync(candidatesPath)) {
  const data = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
  candidates = Array.isArray(data) ? data : (data.candidates || []);
}

const candidateSourceIds = new Set(candidates.flatMap((c) => c.source_ids || (c.source_id ? [c.source_id] : [])));
const analyzed = sources.filter((s) => candidateSourceIds.has(s.source_id));
const unavailable = sources.filter((s) => !candidateSourceIds.has(s.source_id) && /UNAVAILABLE/i.test(s.channel_status || ''));
const pending = sources.filter((s) => !candidateSourceIds.has(s.source_id) && /PENDING/i.test(s.channel_status || ''));
const errors = sources.filter((s) => !candidateSourceIds.has(s.source_id) && /ERROR/i.test(s.channel_status || ''));

const result = {
  engine: 'MALDITOESPEJO_DAILY_SOURCE_COVERAGE',
  version: '1.0.0',
  execution_id: `COV-${Date.now()}`,
  execution_started_at: new Date().toISOString(),
  total_registered_sources: sources.length,
  total_registered_channels: channels.length,
  total_registered_endpoints: channels.filter((c) => c.endpoint).length,
  total_registered_feeds: channels.filter((c) => /FEED|RSS|CAP|API|DATA/i.test(c.channel_type || '')).length,
  analyzed_sources: analyzed.map((s) => s.source_id),
  unavailable_sources: unavailable.map((s) => s.source_id),
  pending_verification_sources: pending.map((s) => s.source_id),
  error_sources: errors.map((s) => s.source_id),
  candidates_detected: candidates.length,
  stories_after_clustering: null,
  stories_ranked: null,
  coverage_percentage: sources.length ? Number(((analyzed.length / sources.length) * 100).toFixed(2)) : 0,
  rule: 'The ranking must not determine which sources exist. Missing observations remain unknown, not zero.',
  generated_at: new Date().toISOString(),
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Source coverage: ${analyzed.length}/${sources.length} analyzed → ${output}`);
