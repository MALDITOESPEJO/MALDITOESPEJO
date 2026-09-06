#!/usr/bin/env node

/**
 * MALDITOESPEJO — Editorial Intake Bridge
 *
 * Converts radar intelligence into a human-review queue. This script never
 * creates an editorial case, never marks a story publishable and never treats
 * ranking/correlation as truth. It only preserves the upstream intelligence
 * needed to begin a traceable investigation.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const RANKING_PATH = process.env.NEWS_RANKING || 'editorial/radars/daily-news-ranking.json';
const CORRELATIONS_PATH = process.env.NEWS_CORRELATIONS || 'editorial/radars/daily-news-correlations.json';
const RELATIONS_PATH = process.env.NEWS_RELATIONS || 'editorial/radars/daily-news-event-relations.json';
const PROVENANCE_PATH = process.env.NEWS_PROVENANCE || 'editorial/radars/daily-news-provenance.json';
const OUT_PATH = process.env.NEWS_INTAKE || 'editorial/radars/daily-news-editorial-intake.json';
const MAX_ITEMS = Math.max(1, Number(process.env.NEWS_INTAKE_MAX || 20));

function readJson(file) {
  if (!fs.existsSync(file)) return null;
  return JSON.parse(fs.readFileSync(file, 'utf8'));
}

function sha256File(file) {
  if (!fs.existsSync(file)) return null;
  return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex');
}

function selected(item) {
  const tier = item?.selection?.tier || '';
  const classification = item?.intelligence?.classification || '';
  return classification !== 'DUPLICATE'
    && (tier.startsWith('PRIORIDAD 2') || tier.startsWith('PRIORIDAD 3'));
}

const ranking = readJson(RANKING_PATH);
if (!ranking || !Array.isArray(ranking.ranking)) {
  console.error(`✖ No se encontró un ranking válido en ${RANKING_PATH}`);
  process.exit(1);
}

const correlations = readJson(CORRELATIONS_PATH);
const relations = readJson(RELATIONS_PATH);
const provenance = readJson(PROVENANCE_PATH);
const correlationByEvent = new Map((correlations?.correlations || []).map(x => [x.event_id, x]));
const relationsByEvent = new Map();
for (const relation of relations?.relations || []) {
  for (const eventId of [relation.event_id_a, relation.event_id_b]) {
    if (!relationsByEvent.has(eventId)) relationsByEvent.set(eventId, []);
    relationsByEvent.get(eventId).push(relation);
  }
}
const provenanceByEvent = new Map((provenance?.provenance || []).map(x => [x.event_id, x]));

const candidates = ranking.ranking.filter(selected).slice(0, MAX_ITEMS);
const generatedAt = new Date().toISOString();
const executionId = ranking.generated_at
  ? `RADAR-${ranking.generated_at.replace(/[-:.TZ]/g, '').slice(0, 14)}`
  : `RADAR-${generatedAt.replace(/[-:.TZ]/g, '').slice(0, 14)}`;

const intake = candidates.map((item, index) => {
  const eventId = item.event_id;
  const correlation = correlationByEvent.get(eventId);
  const eventRelations = relationsByEvent.get(eventId) || [];
  const eventProvenance = provenanceByEvent.get(eventId);
  const intakeId = `INTAKE-${executionId.slice(5)}-${String(index + 1).padStart(3, '0')}`;

  return {
    intake_id: intakeId,
    created_at: generatedAt,
    status: 'PENDING_EDITORIAL_REVIEW',
    rank: item.rank,
    event_id: eventId,
    correlation_id: item.correlation_id || correlation?.correlation_id || null,
    title: item.title || item.headline || item.input_reference || null,
    summary: item.summary || item.description || null,
    source_ids: item.source_ids || [],
    source_count: item.source_count ?? 0,
    independent_source_count: item.independent_source_count ?? 0,
    radar: {
      tier: item.selection?.tier || null,
      newsroom_priority: item.scores?.newsroom_priority ?? null,
      raw_radar_priority: item.scores?.raw_radar_priority ?? null,
      signal_strength: item.scores?.signal_strength ?? null,
      emerging_score: item.scores?.emerging_score ?? null,
      convergence: item.scores?.convergence ?? null,
      confidence: item.scores?.confidence ?? null,
      timeliness: item.scores?.timeliness ?? null,
      rationale: item.selection?.reason || item.intelligence?.rationale || null,
    },
    correlation: correlation ? {
      classification: correlation.classification || null,
      investigation_priority: correlation.investigation_priority || null,
      emerging_score: correlation.emerging_score ?? null,
      correlation_score: correlation.correlation_score ?? null,
      confidence: correlation.confidence ?? null,
      rationale: correlation.rationale || null,
    } : null,
    relations: eventRelations.map(relation => ({
      relation_id: relation.relation_id || null,
      event_id_a: relation.event_id_a || null,
      event_id_b: relation.event_id_b || null,
      relation_type: relation.relation_type || null,
      confidence: relation.confidence ?? null,
      reason: relation.reason || null,
    })),
    provenance: eventProvenance ? {
      classification: eventProvenance.classification || null,
      confidence: eventProvenance.confidence ?? null,
      observed_source_count: eventProvenance.observed_source_count ?? null,
      independent_source_count: eventProvenance.independent_source_count ?? null,
    } : null,
    editorial_boundary: {
      ranking_is_not_truth: true,
      correlation_is_not_truth: true,
      provenance_is_inference_not_fact: true,
      verification_required: true,
      human_editorial_review_required: true,
      publishable: false,
    },
  };
});

const result = {
  engine: 'MALDITOESPEJO_NEWS_EDITORIAL_INTAKE_BRIDGE',
  version: '1.0.0',
  generated_at: generatedAt,
  radar_execution_id: executionId,
  status: 'READY_FOR_EDITORIAL_REVIEW',
  source: {
    ranking: RANKING_PATH,
    correlations: CORRELATIONS_PATH,
    relations: RELATIONS_PATH,
    provenance: PROVENANCE_PATH,
    fingerprints: {
      ranking_sha256: sha256File(RANKING_PATH),
      correlations_sha256: sha256File(CORRELATIONS_PATH),
      relations_sha256: sha256File(RELATIONS_PATH),
      provenance_sha256: sha256File(PROVENANCE_PATH),
    },
  },
  policy: {
    max_items: MAX_ITEMS,
    creates_cases: false,
    auto_publishes: false,
    auto_verifies: false,
    human_editorial_review_required: true,
  },
  intake_count: intake.length,
  items: intake,
};

fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(`Editorial intake: ${intake.length} ranked signals queued → ${OUT_PATH}`);
