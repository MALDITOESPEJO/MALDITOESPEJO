#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

// Ranking is event/story-level by default. The radar is not a publication gate.
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

const buildReason = ({ signal, emerging, correlation, confidence, trend, independence, risk, maturityCap }) => {
  const parts = [];
  if (signal >= 80) parts.push('señal de radar muy fuerte');
  else if (signal >= 65) parts.push('señal de radar fuerte');
  else if (signal >= 50) parts.push('señal de radar relevante');
  if (emerging >= 75) parts.push('emergencia elevada');
  if (correlation >= 75) parts.push('convergencia alta');
  if (independence >= 75) parts.push('diversidad de fuentes alta');
  else if (independence >= 50) parts.push('diversidad de fuentes apreciable');
  if (confidence >= 80) parts.push('confianza de correlación alta');
  else if (confidence >= 60) parts.push('confianza de correlación moderada');
  if (trend >= 75) parts.push('tendencia elevada');
  if (risk === null) parts.push('riesgo aún no evaluado');
  else if (risk >= 70) parts.push('riesgo elevado: requiere verificación adicional');
  if (maturityCap) parts.push('prioridad limitada por madurez editorial insuficiente');
  return parts.length ? `${parts.join('; ')}.` : 'señales insuficientes para una prioridad alta.';
};

const rankEvent = (correlation, eventById, candidateById) => {
  const event = eventById.get(correlation.event_id);
  const candidate = candidateById.get(correlation.candidate_ids?.[0]);
  const eventSignals = event?.signals || {};

  const emerging = scoreOrNull(correlation.emerging_score);
  const convergence = scoreOrNull(correlation.correlation_score);
  const confidence = scoreOrNull(correlation.confidence);
  const timeliness = scoreOrNull(eventSignals.trend_score);
  const independentCount = Number(correlation.independent_source_count ?? event?.independent_source_count ?? 0);

  // Independence is a supporting signal, not a proxy for editorial importance.
  // Four independent sources are sufficient to reach the ceiling; additional
  // sources do not keep increasing the score.
  const independence = clamp(independentCount * 25);
  const risk = finite(candidate?.signals?.risk) ? clamp(candidate.signals.risk) : null;

  // Signal strength answers: "how strongly is the radar detecting this event?"
  // It deliberately excludes editorial value and evidence readiness.
  const signal = (
    (emerging ?? 0) * 0.30 +
    (convergence ?? 0) * 0.25 +
    (confidence ?? 0) * 0.20 +
    (timeliness ?? 0) * 0.10 +
    independence * 0.15
  );

  const riskPenalty = risk === null ? 0 : Math.max(0, risk - 60) * 0.15;
  const rawPriority = clamp(signal - riskPenalty);

  // Editorial value and evidence readiness are intentionally unassessed at
  // radar stage. Without those dimensions, the radar may recommend attention
  // but cannot justify an immediate newsroom P1 decision.
  const editorialAssessed = false;
  const evidenceAssessed = false;
  const maturityCap = !editorialAssessed || !evidenceAssessed;
  const priority = maturityCap ? Math.min(rawPriority, 74.99) : rawPriority;

  let tier = 'PRIORIDAD 4 — DESCARTAR';
  if (correlation.classification === 'DUPLICATE') {
    tier = 'PRIORIDAD 4 — DUPLICADO';
  } else if (priority >= 80 && !maturityCap) {
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
    independent_source_count: independentCount,
    intelligence: {
      correlation_score: convergence,
      emerging_score: emerging,
      confidence,
      classification: correlation.classification,
      investigation_priority: correlation.investigation_priority,
      rationale: correlation.rationale,
    },
    scores: {
      signal_strength: Number(signal.toFixed(2)),
      emerging_score: emerging,
      convergence,
      confidence,
      timeliness,
      source_independence: independence,
      risk,
      newsroom_priority: Number(priority.toFixed(2)),
      raw_radar_priority: Number(rawPriority.toFixed(2)),
      editorial_value: null,
      evidence_readiness: null,
      editorial_assessed: editorialAssessed,
      evidence_assessed: evidenceAssessed,
      risk_assessed: risk !== null,
      signal_coverage: Number(([emerging, convergence, confidence, timeliness, independence].filter(finite).length / 5 * 100).toFixed(1)),
    },
    selection: {
      tier,
      publishable: false,
      reason: buildReason({
        signal,
        emerging: emerging ?? 0,
        correlation: convergence ?? 0,
        confidence: confidence ?? 0,
        trend: timeliness ?? 0,
        independence,
        risk,
        maturityCap,
      }),
    },
  };
};

if (!fs.existsSync(input)) {
  console.error(`Input not found: ${input}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
if (!Array.isArray(data.correlations)) {
  console.error('The ranking engine expects daily-news-correlations.json as input.');
  console.error('Candidate-level ranking is intentionally disabled in this production path.');
  process.exit(1);
}

const candidatesData = fs.existsSync(candidatesPath) ? JSON.parse(fs.readFileSync(candidatesPath, 'utf8')) : [];
const eventsData = fs.existsSync(eventsPath) ? JSON.parse(fs.readFileSync(eventsPath, 'utf8')) : [];
const candidates = Array.isArray(candidatesData) ? candidatesData : (candidatesData.candidates || []);
const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || []);
const candidateById = new Map(candidates.map(x => [x.candidate_id, x]));
const eventById = new Map(events.map(x => [x.event_id, x]));

const ranked = data.correlations
  .map(x => rankEvent(x, eventById, candidateById))
  .sort((a, b) => b.scores.newsroom_priority - a.scores.newsroom_priority
    || String(a.event_id).localeCompare(String(b.event_id)))
  .map((item, index) => ({ rank: index + 1, ...item }));

const result = {
  engine: 'MALDITOESPEJO_DAILY_NEWS_SELECTION_ENGINE',
  version: '2.2.0',
  mode: 'event-radar-ranking',
  generated_at: new Date().toISOString(),
  candidates_analyzed: candidates.length,
  events_analyzed: events.length,
  correlations_analyzed: data.correlations.length,
  ranking_items: ranked.length,
  editorial_boundary: {
    ranking_is_not_publication: true,
    editorial_value_not_assessed: true,
    evidence_readiness_not_assessed: true,
    human_editorial_approval_required: true,
    p1_requires_editorial_and_evidence_assessment: true,
  },
  ranking: ranked,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Ranked ${ranked.length} events → ${output}`);
