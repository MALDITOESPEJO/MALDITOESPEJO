#!/usr/bin/env node

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const out = 'editorial/radars/daily-news-intelligence.json';
const steps = [
  ['source-check', 'scripts/check-source-universe.mjs'],
  ['ingest', 'scripts/ingest-news-feeds.mjs'],
  ['events', 'scripts/cluster-news-events.mjs'],
  ['provenance', 'scripts/derive-news-provenance.mjs'],
  ['correlate', 'scripts/correlate-news-signals.mjs'],
  ['rank', 'scripts/rank-news.mjs'],
  ['report', 'scripts/daily-news-report.mjs']
];

const executionId = `RUN-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0,14)}`;
const started = new Date().toISOString();
const results = [];
for (const [name, script] of steps) {
  const r = spawnSync(process.execPath, [script], { cwd: root, encoding: 'utf8' });
  results.push({ step: name, script, exit_code: r.status ?? 1, ok: r.status === 0 });
  if (r.status !== 0) break;
}

const readJson = p => fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
const coverage = readJson('editorial/radars/daily-source-coverage.json');
const events = readJson('editorial/radars/daily-news-events.json');
const provenance = readJson('editorial/radars/daily-news-provenance.json');
const correlations = readJson('editorial/radars/daily-news-correlations.json');
const ranking = readJson('editorial/radars/daily-news-ranking.json');
const finished = new Date().toISOString();

const report = {
  execution_id: executionId,
  execution_started_at: started,
  execution_finished_at: finished,
  status: results.every(x => x.ok) ? 'COMPLETED' : 'PARTIAL_FAILURE',
  pipeline: results,
  source_coverage: coverage ? {
    total_registered_sources: coverage.total_registered_sources,
    analyzed_sources: coverage.analyzed_sources,
    unavailable_sources: coverage.unavailable_sources,
    pending_verification_sources: coverage.pending_verification_sources,
    coverage_percentage: coverage.coverage_percentage
  } : null,
  intelligence: {
    candidates_detected: ranking?.candidates_analyzed ?? null,
    events_detected: events?.event_count ?? events?.events?.length ?? null,
    provenance_events: provenance?.events_analyzed ?? provenance?.provenance?.length ?? null,
    correlations_detected: correlations?.correlation_count ?? correlations?.correlations?.length ?? null,
    top_emerging: (correlations?.correlations || []).filter(x => x.investigation_priority === 'HIGH').slice(0, 20).map(x => ({
      event_id: x.event_id,
      classification: x.classification,
      emerging_score: x.emerging_score,
      confidence: x.confidence,
      observed_source_count: x.observed_source_count,
      independent_source_count: x.independent_source_count,
      provenance_confidence: x.provenance_confidence,
      rationale: x.rationale
    })),
    ranked_stories: (ranking?.ranking || []).slice(0, 20).map(x => ({
      rank: x.rank,
      event_id: x.event_id,
      raw_radar_priority: x.scores?.raw_radar_priority,
      newsroom_priority: x.scores?.newsroom_priority,
      tier: x.selection?.tier
    }))
  },
  editorial_boundary: {
    ranking_is_not_publication: true,
    correlation_is_not_truth: true,
    source_count_is_not_independence: true,
    provenance_is_inference_not_fact: true,
    human_editorial_approval_required: true
  }
};

fs.mkdirSync('editorial/radars', { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(`Daily intelligence run ${report.status} → ${out}`);
process.exit(report.status === 'COMPLETED' ? 0 : 1);
