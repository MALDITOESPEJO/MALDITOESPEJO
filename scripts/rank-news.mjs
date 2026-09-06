#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'editorial/radars/daily-news-candidates.json';
const output = process.argv[3] || 'editorial/radars/daily-news-ranking.json';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
const num = (v) => (typeof v === 'number' && Number.isFinite(v) ? clamp(v) : null);
const avgKnown = (values) => {
  const known = values.filter((v) => v !== null);
  return known.length ? known.reduce((a, b) => a + b, 0) / known.length : null;
};

const weighted = (obj, weights) => {
  if (!obj || typeof obj !== 'object') return null;
  let total = 0;
  let weight = 0;
  for (const [key, w] of Object.entries(weights)) {
    const value = num(obj[key]);
    if (value !== null) {
      total += value * w;
      weight += w;
    }
  }
  return weight ? total / weight : null;
};

const virality = (s) => weighted(s?.virality, {
  volume: 0.20, velocity: 0.25, acceleration: 0.20,
  cross_source_spread: 0.15, search_interest: 0.10, persistence: 0.10,
});

const editorial = (s) => weighted(s?.editorial, {
  relevance: 0.20, impact: 0.20, novelty: 0.15, editorial_fit: 0.15,
  public_interest: 0.10, investigation_potential: 0.10,
  originality_opportunity: 0.10,
});

const evidence = (s) => weighted(s?.editorial, {
  verification_readiness: 0.35, source_independence: 0.25,
  evidence_quality: 0.25, confidence: 0.15,
});

const signalStrength = (candidate) => {
  const signals = candidate.signals || {};
  const emerging = num(signals.emerging_score);
  const correlation = num(signals.correlation_score);
  const v = virality(signals);
  const trend = num(signals.trend);
  return avgKnown([
    emerging,
    correlation,
    v,
    trend,
  ]);
};

const score = (candidate) => {
  const signals = candidate.signals || {};
  const v = virality(signals);
  const e = editorial(signals);
  const ev = evidence(signals);
  const t = num(signals.timeliness);
  const r = num(signals.risk);
  const signal = signalStrength(candidate);

  // Signal strength tells the newsroom what deserves attention; it is not editorial value.
  // Missing editorial/evidence dimensions reduce confidence instead of becoming zero-value facts.
  const editorialCoverage = e === null ? 0 : 1;
  const evidenceCoverage = ev === null ? 0 : 1;
  const coverage = [signal, e, ev, t].filter((x) => x !== null).length / 4;

  const raw = (signal ?? 0) * 0.30
    + (e ?? 0) * 0.40
    + (ev ?? 0) * 0.20
    + (t ?? 0) * 0.10;

  const confidenceAdjusted = raw * (0.70 + 0.30 * coverage);
  const riskPenalty = r === null ? 0 : Math.max(0, r - 60) * 0.15;
  let priority = clamp(confidenceAdjusted - riskPenalty);

  // A strong radar signal without editorial/evidence assessment is an investigation lead,
  // not a P1 recommendation. Unknown risk is explicitly marked as unresolved.
  let tier = 'PRIORIDAD 4 — DESCARTAR';
  if (candidate.duplicate_cluster_id) {
    priority = Math.min(priority, 20);
  } else if (editorialCoverage === 0 || evidenceCoverage === 0) {
    priority = Math.min(priority, 64.99);
    tier = priority >= 45 ? 'PRIORIDAD 3 — TENDENCIA / VALORAR' : 'PRIORIDAD 4 — DESCARTAR';
  } else if (priority >= 80) tier = 'PRIORIDAD 1 — INVESTIGAR AHORA';
  else if (priority >= 65) tier = 'PRIORIDAD 2 — VIGILAR / INVESTIGAR';
  else if (priority >= 45) tier = 'PRIORIDAD 3 — TENDENCIA';

  return {
    ...candidate,
    scores: {
      signal_strength: signal === null ? null : Number(signal.toFixed(2)),
      virality: v === null ? null : Number(v.toFixed(2)),
      editorial_value: e === null ? null : Number(e.toFixed(2)),
      evidence_readiness: ev === null ? null : Number(ev.toFixed(2)),
      timeliness: t,
      risk: r,
      newsroom_priority: Number(priority.toFixed(2)),
      signal_coverage: Number((coverage * 100).toFixed(1)),
      editorial_assessed: editorialCoverage === 1,
      evidence_assessed: evidenceCoverage === 1,
      risk_assessed: r !== null,
    },
    selection: {
      tier,
      publishable: false,
      reason: buildReason(signal, e, ev, t, r),
    },
  };
};

function buildReason(signal, e, ev, t, r) {
  const parts = [];
  if (signal !== null && signal >= 75) parts.push('señal de radar fuerte');
  else if (signal !== null && signal >= 55) parts.push('señal relevante');
  if (e !== null && e >= 75) parts.push('alto valor editorial');
  else if (e !== null && e >= 55) parts.push('valor editorial apreciable');
  if (ev !== null && ev >= 75) parts.push('buena preparación para verificación');
  if (t !== null && t >= 75) parts.push('gran actualidad');
  if (r === null) parts.push('riesgo aún no evaluado');
  else if (r >= 70) parts.push('riesgo elevado: requiere verificación adicional');
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
  .sort((a, b) => b.scores.newsroom_priority - a.scores.newsroom_priority
    || String(a.candidate_id).localeCompare(String(b.candidate_id)))
  .map((item, index) => ({ rank: index + 1, ...item }));

const result = {
  engine: 'MALDITOESPEJO_DAILY_NEWS_SELECTION_ENGINE',
  version: '2.0.0',
  mode: 'event-aware-editorial-ranking',
  generated_at: new Date().toISOString(),
  candidates_analyzed: candidates.length,
  ranking_items: ranked.length,
  ranking: ranked,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Ranked ${ranked.length} candidates → ${output}`);
