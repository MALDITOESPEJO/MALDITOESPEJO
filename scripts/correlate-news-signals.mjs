#!/usr/bin/env node

import fs from 'node:fs';
import crypto from 'node:crypto';

const input = process.argv[2] || 'editorial/radars/daily-news-events.json';
const output = process.argv[3] || 'editorial/radars/daily-news-correlations.json';
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const events = data.events || [];

const sourceFamily = id => String(id || '').split(/[-_]/)[0].toUpperCase() || 'UNKNOWN';
const clamp = n => Math.max(0, Math.min(100, n));
const result = events.map(e => {
  const families = [...new Set((e.source_ids || []).map(sourceFamily))];
  const independent = Number(e.independent_source_count || 0);
  const spread = Number(e.signals?.cross_source_spread || 0);
  const temporal = Number(e.signals?.persistence || 0);
  const semantic = clamp(Number(e.similarity_max || 0) * 100);
  const correlation = clamp(semantic * .35 + Math.min(100, independent * 25) * .30 + spread * .20 + Math.min(100, temporal) * .15);
  const emerging = clamp((families.length * 25) * .45 + spread * .20 + (independent >= 2 ? 25 : 0) + Math.min(25, temporal * .25));
  const confidence = clamp((independent >= 2 ? 45 : independent === 1 ? 20 : 0) + semantic * .30 + Math.min(25, families.length * 8));
  let classification = 'PARALLEL_SIGNAL';
  if (e.candidate_count > 1 && correlation >= 70) classification = 'SAME_EVENT';
  else if (e.candidate_count > 1 && correlation >= 50) classification = 'RELATED_EVENT';
  else if (e.candidate_count === 1) classification = 'PARALLEL_SIGNAL';
  if (e.candidate_count > 1 && semantic >= 90 && independent <= 1) classification = 'DUPLICATE';
  const investigation_priority = emerging >= 70 && confidence >= 45 ? 'HIGH' : emerging >= 45 ? 'MEDIUM' : 'LOW';
  return {
    correlation_id: 'COR-' + crypto.createHash('sha256').update(e.event_id).digest('hex').slice(0,8).toUpperCase(),
    event_id: e.event_id,
    candidate_ids: e.candidate_ids,
    source_ids: e.source_ids,
    source_families: families,
    independent_source_count: independent,
    correlation_score: Number(correlation.toFixed(2)),
    emerging_score: Number(emerging.toFixed(2)),
    confidence: Number(confidence.toFixed(2)),
    classification,
    investigation_priority,
    evidence_types: [],
    unresolved_conflicts: [],
    rationale: independent >= 2 ? 'Convergencia entre fuentes independientes.' : 'Señal insuficiente para considerar corroboración independiente.'
  };
});

result.sort((a,b) => b.emerging_score - a.emerging_score);
fs.mkdirSync('editorial/radars',{recursive:true});
fs.writeFileSync(output, JSON.stringify({generated_at:new Date().toISOString(),correlation_count:result.length,correlations:result},null,2)+'\n');
console.log(`Correlated ${result.length} events → ${output}`);
