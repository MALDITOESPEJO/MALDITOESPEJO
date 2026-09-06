#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

// The default input is the correlation layer: ranking is event/story-level.
const input = process.argv[2] || 'editorial/radars/daily-news-correlations.json';
const output = process.argv[3] || 'editorial/radars/daily-news-ranking.json';
const candidatesPath = process.env.NEWS_CANDIDATES || 'editorial/radars/daily-news-candidates.json';
const eventsPath = process.env.NEWS_EVENTS || 'editorial/radars/daily-news-events.json';

const clamp = (n, min = 0, max = 100) => Math.max(min, Math.min(max, Number.isFinite(n) ? n : 0));
const finite = (v) => typeof v === 'number' && Number.isFinite(v);
const scoreOrNull = (v) => finite(v) ? clamp(v) : null;
const avg = (values) => {
  const known = values.filter(finite);
  return known.length ? known.reduce((a, b) => a + b, 0) / known.length : null;
};

const sourceIndependence = (correlation, event) => {
  const count = Number(correlation.independent_source_count ?? event?.independent_source_count ?? 0);
  return clamp(count * 25);
};

const buildReason = ({ signal, emerging, correlation, confidence, trend, independence, risk }) => {
  const parts = [];
  if (signal >= 80) parts.push('señal de radar muy fuerte');
  else if (signal >= 65) parts.push('señal de radar fuerte');
  else if (signal >= 50) parts.push('señal de radar relevante');
  if (emerging >= 75) parts.push('emergencia elevada');
  if (correlation >= 75) parts.push('convergencia alta');
  if (independence >= 75) parts.push('diversidad de fuentes alta');
  else if (independence >= 50) parts.push('diversidad de fuentes apreciable');
  if (confidence >= 80) parts.push('confianza alta');
  else if (confidence >= 60) parts.push('confianza moderada');
  if (trend >= 75) parts.push('tendencia elevada');
  if (risk === null) parts.push('riesgo aún no evaluado');
  else if (risk >= 70) parts.push('riesgo elevado: requiere verificación adicional');
  return parts.length ? parts.join('; ') + '.' : 'señales insuficientes para una prioridad alta.';
};

const rankEvent = (correlation, eventById, candidateById) => {
  const event = eventById.get(correlation.event_id);
  const candidate = candidateById.get(correlation.candidate_ids?.[0]);
  const eventSignals = event?.signals || {};

  const emerging = scoreOrNull(correlation.emerging_score);
  const correlationScore = scoreOrNull(correlation.correlation_score);
  const confidence = scoreOrNull(correlation.confidence);
  const trend = scoreOrNull(eventSignals.trend_score);
  const independence = sourceIndependence(correlation, event);
  const risk = finite(candidate?.signals?.risk) ? clamp(candidate.signals.risk) : null;

  // Radar signal answers: "what deserves investigation now?"
  // It deliberately does NOT masquerade as editorial value or publication readiness.
  const signal = avg([
    emerging,
    correlationScore,
    confidence,
    trend,
    independence,
  ]);

  const riskPenalty = risk === null ? 0 : Math.max(0, risk - 60) * 0.15;
  const priority = clamp((signal ?? 0) - riskPenalty);

  let tier = 'PRIORIDAD 4 — DESCARTAR';
  if (correlation.classification === 'DUPLICATE') {
    tier = 'PRIORIDAD 4 — DUPLICADO';
  } else if (priority >= 80) {
    tier = 'PRIORIDAD 1 — INVESTIGAR AHORA';
  } else if (priority >= 65) {
    tier = 'PRIORIDAD 2 — VIGILAR / INVESTIGAR';
  } else if (priority >= 45) {
    tier = 'PRIORIDAD 3 — TENDENCIA / VALORAR';
  }

  return {
    ...(event || {}),
    event_id: correlation.event_id,
    correlation_id: correlation.correlation_id,
    candidate_ids: correlation.candidate_ids || event?.candidate_ids || [],
    candidate_count: correlation.candidate_ids?.length || event?.candidate_count || 0,
    source_ids: correlation.source_ids || event?.source_ids || [],
    source_count: correlation.source_ids?.length || event?.source_count || 0,
    independent_source_count: correlation.independent_source_count ?? event?.independent_source_count ?? 0,
    intelligence: {
      correlation_score: correlationScore,
      emerging_score: emerging,
      confidence,
      classification: correlation.classification,
      investigation_priority: correlation.investigation_priority,
      rationale: correlation.rationale,
    },
    scores: {
      signal_strength: signal === null ? null : Number(signal.toFixed(2)),
      virality: emerging,
      convergence: correlationScore,
      confidence,
      timeliness: trend,
      source_independence: independence,
      risk,
      newsroom_priority: Number(priority.toFixed(2)),
      editorial_value: null,
      evidence_readiness: null,
      editorial_assessed: false,
      evidence_assessed: false,
      risk_assessed: risk !== null,
      signal_coverage: Number(([
        emerging, correlationScore, confidence, trend, independence,
      ].filter(finite).length / 5 * 100).toFixed(1)),
    },
    selection: {
      tier,
      publishable: false,
      reason: buildReason({
        signal: signal ?? 0,
        emerging: emerging ?? 0,
        correlation: correlationScore ?? 0,
        confidence: confidence ?? 0,
        trend: trend ?? 0,
        independence,
        risk,
      }),
    },
  };
};

const rankLegacyCandidates = (candidates) => candidates.map((candidate) => {
  const s = candidate.signals || {};
  const virality = s.virality || {};
  const editorial = s.editorial || {};
  const v = avg([
    virality.volume, virality.velocity, virality.acceleration,
    virality.cross_source_spread, virality.search_interest, virality.persistence,
  ]);
  const e = avg([
    editorial.relevance, editorial.impact, editorial.novelty,
    editorial.editorial_fit, editorial.verification_readiness,
    editorial.originality_opportunity, editorial.source_independence,
  ]);
  const t = scoreOrNull(s.timeliness);
  const r = scoreOrNull(s.risk);
  const priority = clamp((v ?? 0) * 0.40 + (e ?? 0) * 0.50 + (t ?? 0) * 0.10);
  return {
    ...candidate,
    scores: {
      virality: v,
      editorial_value: e,
      timeliness: t,
      risk: r,
      newsroom_priority: Number(priority.toFixed(2)),
      signal_coverage: Number(([v, e, t].filter(finite).length / 3 * 100).toFixed(1)),
      editorial_assessed: e !== null,
      evidence_assessed: false,
      risk_assessed: r !== null,
    },
    selection: {
      tier: priority >= 80 ? 'PRIORIDAD 1 — INVESTIGAR AHORA' : priority >= 65 ? 'PRIORIDAD 2 — VIGILAR / INVESTIGAR' : priority >= 45 ? 'PRIORIDAD 3 — TENDENCIA / VALORAR' : 'PRIORIDAD 4 — DESCARTAR',
      publishable: false,
      reason: 'Modo legacy de candidatos; no sustituye al ranking de eventos.',
    },
  };

if (!fs.existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
let ranked;
let rankingMode;
let candidatesAnalyzed = 0;
let eventsAnalyzed = 0;

if (Array.isArray(data.correlations)) {
  const candidatesData = fs.existsSync(candidatesPath) ? JSON.parse(fs.readFileSync(candidatesPath, 'utf8')) : [];
  const eventsData = fs.existsSync(eventsPath) ? JSON.parse(fs.readFileSync(eventsPath, 'utf8')) : [];
  const candidates = Array.isArray(candidatesData) ? candidatesData : (candidatesData.candidates || []);
  const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || []);
  const candidateById = new Map(candidates.map(x => [x.candidate_id, x]));
  const eventById = new Map(events.map(x => [x.event_id, x]));

  ranked = data.correlations.map(x => rankEvent(x, eventById, candidateById));
  rankingMode = 'event';
  candidatesAnalyzed = candidates.length;
  eventsAnalyzed = events.length;
} else {
  const candidates = Array.isArray(data) ? data : data.candidates;
  if (!Array.isArray(candidates)) {
    console.error('Input must be correlations or an array/object with candidates.');
    process.exit(1);
  }
  ranked = rankLegacyCandidates(candidates);
  rankingMode = 'candidate-legacy';
  candidatesAnalyzed = candidates.length;
}

ranked = ranked
  .sort((a, b) => b.scores.newsroom_priority - a.scores.newsroom_priority
    || String(a.event_id || a.candidate_id).localeCompare(String(b.event_id || b.candidate_id)))
  .map((item, index) => ({ rank: index + 1, ...item }));

const result = {
  engine: 'MALDITOESPEJO_DAILY_NEWS_SELECTION_ENGINE',
  version: '2.1.0',
  mode: rankingMode,
  generated_at: new Date().toISOString(),
  candidates_analyzed: candidatesAnalyzed,
  events_analyzed: eventsAnalyzed,
  ranking_items: ranked.length,
  ranking: ranked,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Ranked ${ranked.length} ${rankingMode === 'event' ? 'events' : 'candidates'} → ${output}`);
