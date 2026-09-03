#!/usr/bin/env node

import fs from 'node:fs';
import { spawnSync } from 'node:child_process';

const root = process.cwd();
const out = 'editorial/radars/daily-news-intelligence.json';
const steps = [
  ['source-check', 'scripts/check-source-universe.mjs'],
  ['ingest', 'scripts/ingest-news-feeds.mjs'],
  ['events', 'scripts/cluster-news-events.mjs'],
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
    candidates_detected: ranking?.candidate_count ?? null,
    events_detected: events?.event_count ?? events?.events?.length ?? null,
    correlations_detected: correlations?.correlation_count ?? correlations?.correlations?.length ?? null,
    top_emerging: (correlations?.correlations || []).filter(x => x.investigation_priority === 'HIGH').slice(0, 20).map(x => ({
      event_id: x.event_id,
      classification: x.classification,
      emerging_score: x.emerging_score,
      confidence: x.confidence,
      independent_source_count: x.independent_source_count,
      rationale: x.rationale
    })),
    ranked_stories: (ranking?.ranked_candidates || ranking?.candidates || []).slice(0, 20)
  },
  editorial_boundary: {
    ranking_is_not_publication: true,
    correlation_is_not_truth: true,
    source_count_is_not_independence: true,
    human_editorial_approval_required: true
  }
};

fs.mkdirSync('editorial/radars', { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(`Daily intelligence run ${report.status} → ${out}`);
process.exit(report.status === 'COMPLETED' ? 0 : 1);
