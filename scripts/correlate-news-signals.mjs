#!/usr/bin/env node

import fs from 'node:fs';
import crypto from 'node:crypto';

const input = process.argv[2] || 'editorial/radars/daily-news-events.json';
const output = process.argv[3] || 'editorial/radars/daily-news-correlations.json';
const provenancePath = process.env.NEWS_PROVENANCE || 'editorial/radars/daily-news-provenance.json';
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const events = data.events || [];
const provenanceData = fs.existsSync(provenancePath) ? JSON.parse(fs.readFileSync(provenancePath, 'utf8')) : null;
const provenance = Array.isArray(provenanceData) ? provenanceData : (provenanceData?.provenance || []);
const provenanceByEvent = new Map(provenance.map(x => [x.event_id, x]));

const sourceFamily = id => String(id || '').split(/[-_]/)[0].toUpperCase() || 'UNKNOWN';
const clamp = n => Math.max(0, Math.min(100, n));
const result = events.map(e => {
  const families = [...new Set((e.source_ids || []).map(sourceFamily))];
  const prov = provenanceByEvent.get(e.event_id);
  const observedSources = Number(prov?.observed_source_count ?? e.source_count ?? 0);
  const independent = Number(prov?.apparent_independent_source_count ?? 0);
  const spread = Number(e.signals?.cross_source_spread || 0);
  const temporal = Number(e.signals?.persistence || 0);
  const semantic = clamp(Number(e.similarity_max || 0) * 100);
  const independenceScore = Math.min(100, independent * 25);
  const correlation = clamp(semantic * .35 + independenceScore * .30 + spread * .20 + Math.min(100, temporal) * .15);
  const emerging = clamp((families.length * 25) * .35 + independenceScore * .25 + spread * .20 + (independent >= 2 ? 10 : 0) + Math.min(20, temporal * .20));
  const confidence = clamp((independent >= 2 ? 45 : independent === 1 ? 20 : 0) + semantic * .30 + Math.min(25, families.length * 8));
  let classification = 'PARALLEL_SIGNAL';
  if (e.candidate_count > 1 && correlation >= 70) classification = 'SAME_EVENT';
  else if (e.candidate_count > 1 && correlation >= 50) classification = 'RELATED_EVENT';
  else if (e.candidate_count === 1) classification = 'PARALLEL_SIGNAL';
  if (e.candidate_count > 1 && semantic >= 90 && independent <= 1) classification = 'DUPLICATE';
  const investigation_priority = emerging >= 70 && confidence >= 45 ? 'HIGH' : emerging >= 45 ? 'MEDIUM' : 'LOW';
  const rationale = independent >= 2
    ? `Corroboración aparente entre ${independent} fuentes con procedencia no observada como compartida.`
    : observedSources > independent
      ? `Hay ${observedSources} fuentes observadas, pero solo ${independent} presentan independencia aparente; no se cuenta la mera republicación como corroboración.`
      : 'Señal insuficiente para considerar corroboración independiente.';
  return {
    correlation_id: 'COR-' + crypto.createHash('sha256').update(e.event_id).digest('hex').slice(0,8).toUpperCase(),
    event_id: e.event_id,
    candidate_ids: e.candidate_ids,
    source_ids: e.source_ids,
    source_families: families,
    observed_source_count: observedSources,
    independent_source_count: independent,
    provenance_group_count: Number(prov?.provenance_group_count ?? 0),
    provenance_confidence: prov?.provenance_confidence || 'LOW',
    apparent_independent_source_ids: prov?.apparent_independent_source_ids || [],
    correlation_score: Number(correlation.toFixed(2)),
    emerging_score: Number(emerging.toFixed(2)),
    confidence: Number(confidence.toFixed(2)),
    classification,
    investigation_priority,
    evidence_types: [],
    unresolved_conflicts: [],
    rationale,
  };
});

result.sort((a,b) => b.emerging_score - a.emerging_score);
fs.mkdirSync('editorial/radars',{recursive:true});
fs.writeFileSync(output, JSON.stringify({generated_at:new Date().toISOString(),correlation_count:result.length,correlations:result},null,2)+'\n');
console.log(`Correlated ${result.length} events → ${output}`);
