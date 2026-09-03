#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'editorial/radars/daily-news-candidates.json';
const output = process.argv[3] || 'editorial/radars/daily-news-ranking.json';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));

const avgKnown = (obj, keys) => {
  const values = keys.map((k) => obj?.[k]).filter((v) => typeof v === 'number' && Number.isFinite(v));
  return values.length ? values.reduce((a, b) => a + b, 0) / values.length : null;
};

const weighted = (obj, weights) => {
  let total = 0;
  let weight = 0;
  for (const [key, w] of Object.entries(weights)) {
    const value = obj?.[key];
    if (typeof value === 'number' && Number.isFinite(value)) {
      total += clamp(value) * w;
      weight += w;
    }
  }
  return weight ? total / weight : null;
};

const virality = (s) => weighted(s?.virality, {
  volume: 0.20,
  velocity: 0.25,
  acceleration: 0.20,
  cross_source_spread: 0.15,
  search_interest: 0.10,
  persistence: 0.10,
});

const editorial = (s) => weighted(s?.editorial, {
  relevance: 0.20,
  impact: 0.20,
  novelty: 0.15,
  editorial_fit: 0.15,
  verification_readiness: 0.15,
  originality_opportunity: 0.10,
  source_independence: 0.05,
});

const score = (candidate) => {
  const v = virality(candidate.signals);
  const e = editorial(candidate.signals);
  const t = candidate.signals?.timeliness;
  const r = candidate.signals?.risk;

  // Unknown signals are excluded from component averages rather than treated as zero.
  const base = avgKnown({ v, e, t }, ['v', 'e', 't']);
  const raw = (v ?? 0) * 0.40 + (e ?? 0) * 0.50 + (t ?? 0) * 0.10;
  const coverage = [v, e, t].filter((x) => x !== null).length / 3;
  const confidenceAdjusted = raw * (0.70 + 0.30 * coverage);
  const riskPenalty = r === null || r === undefined ? 0 : Math.max(0, r - 60) * 0.15;

  let priority = clamp(confidenceAdjusted - riskPenalty);
  let tier = 'PRIORIDAD 4 — DESCARTAR';

  if (candidate.duplicate_cluster_id) {
    tier = 'PRIORIDAD 4 — DESCARTAR';
    priority = Math.min(priority, 20);
  } else if (priority >= 80) tier = 'PRIORIDAD 1 — INVESTIGAR AHORA';
  else if (priority >= 65) tier = 'PRIORIDAD 2 — VIGILAR / INVESTIGAR';
  else if (priority >= 45) tier = 'PRIORIDAD 3 — TENDENCIA';

  return {
    ...candidate,
    scores: {
      virality: v === null ? null : Number(v.toFixed(2)),
      editorial: e === null ? null : Number(e.toFixed(2)),
      timeliness: typeof t === 'number' ? clamp(t) : null,
      risk: typeof r === 'number' ? clamp(r) : null,
      newsroom_priority: Number(priority.toFixed(2)),
      signal_coverage: Number((coverage * 100).toFixed(1)),
    },
    selection: {
      tier,
      publishable: false,
      reason: buildReason(v, e, t, r),
    },
  };
};

function buildReason(v, e, t, r) {
  const parts = [];
  if (v !== null && v >= 75) parts.push('alta tracción y/o crecimiento');
  else if (v !== null && v >= 55) parts.push('interés relevante');
  if (e !== null && e >= 75) parts.push('alto valor editorial');
  else if (e !== null && e >= 55) parts.push('valor editorial apreciable');
  if (t !== null && t >= 75) parts.push('gran actualidad');
  if (r !== null && r >= 70) parts.push('riesgo elevado de publicación sin verificación adicional');
  if (!parts.length) parts.push('señales insuficientes para una prioridad alta');
  return parts.join('; ') + '.';
}

if (!fs.existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const candidates = Array.isArray(data) ? data : data.candidates;
if (!Array.isArray(candidates)) {
  console.error('Input must be an array or an object with a candidates array.');
  process.exit(1);
}

const ranked = candidates
  .map(score)
  .sort((a, b) => b.scores.newsroom_priority - a.scores.newsroom_priority || String(a.candidate_id).localeCompare(String(b.candidate_id)))
  .map((item, index) => ({ rank: index + 1, ...item }));

const result = {
  engine: 'MALDITOESPEJO_DAILY_NEWS_SELECTION_ENGINE',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  candidates_analyzed: ranked.length,
  ranking: ranked,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Ranked ${ranked.length} candidates → ${output}`);
