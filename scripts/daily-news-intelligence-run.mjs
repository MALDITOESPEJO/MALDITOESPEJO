#!/usr/bin/env node

/**
 * MALDITOESPEJO daily newsroom intelligence runner.
 * The pipeline explicitly consolidates semantically identical events before
 * provenance, correlation and ranking so republication does not create fake
 * event multiplication.
 */
import fs from 'node:fs';
import { spawn } from 'node:child_process';

const root = process.cwd();
const out = 'editorial/radars/daily-news-intelligence.json';
const steps = [
  ['source-check', 'scripts/check-source-universe.mjs'],
  ['ingest', 'scripts/ingest-news-feeds.mjs'],
  ['events', 'scripts/cluster-news-events.mjs'],
  ['event-consolidation', 'scripts/consolidate-news-events.mjs'],
  ['event-relations', 'scripts/analyze-news-event-relations.mjs'],
  ['provenance', 'scripts/derive-news-provenance.mjs'],
  ['provenance-audit', 'scripts/audit-news-provenance.mjs'],
  ['correlate', 'scripts/correlate-news-signals.mjs'],
  ['rank', 'scripts/rank-news.mjs'],
  ['report', 'scripts/daily-news-report.mjs']
];

const executionId = `RUN-${new Date().toISOString().replace(/[-:.TZ]/g, '').slice(0,14)}`;
const started = new Date().toISOString();
const results = [];
const STEP_TIMEOUT_MS = Math.max(60_000, Number(process.env.DAILY_INTELLIGENCE_STEP_TIMEOUT_MS || 900_000));

function runStep(name, script) {
  return new Promise((resolve) => {
    console.log(`\n=== Daily intelligence step: ${name} (${script}) ===`);
    const child = spawn(process.execPath, [script], {
      cwd: root,
      stdio: 'inherit',
      windowsHide: false,
    });

    let settled = false;
    const finish = (result) => {
      if (settled) return;
      settled = true;
      clearTimeout(timeout);
      resolve(result);
    };

    const timeout = setTimeout(() => {
      console.error(`Daily intelligence step ${name} exceeded timeout (${STEP_TIMEOUT_MS}ms). Terminating child process.`);
      try { child.kill(); } catch (error) { console.error(`Could not terminate ${name}: ${error.message}`); }
      finish({ step: name, script, exit_code: 124, ok: false, timeout_ms: STEP_TIMEOUT_MS });
    }, STEP_TIMEOUT_MS);

    child.on('error', (error) => {
      console.error(`Daily intelligence step ${name} failed to start: ${error.message}`);
      finish({ step: name, script, exit_code: 1, ok: false, error: error.message });
    });

    child.on('exit', (code, signal) => {
      const exitCode = typeof code === 'number' ? code : 1;
      if (signal) console.error(`Daily intelligence step ${name} terminated by signal ${signal}`);
      finish({ step: name, script, exit_code: exitCode, ok: exitCode === 0 });
    });
  });
}

for (const [name, script] of steps) {
  const result = await runStep(name, script);
  results.push(result);
  if (!result.ok) break;
}

const readJson = p => fs.existsSync(p) ? JSON.parse(fs.readFileSync(p, 'utf8')) : null;
const coverage = readJson('editorial/radars/daily-source-coverage.json');
const candidates = readJson('editorial/radars/daily-news-candidates.json');
const events = readJson('editorial/radars/daily-news-events.json');
const clusteredEvents = readJson('editorial/radars/daily-news-events-clustered.json');
const eventRelations = readJson('editorial/radars/daily-news-event-relations.json');
const provenance = readJson('editorial/radars/daily-news-provenance.json');
const provenanceAudit = readJson('editorial/radars/daily-news-provenance-audit.json');
const correlations = readJson('editorial/radars/daily-news-correlations.json');
const ranking = readJson('editorial/radars/daily-news-ranking.json');
const finished = new Date().toISOString();

const candidatesDetected = Array.isArray(candidates) ? candidates.length : candidates?.candidates?.length ?? 0;
const eventsDetected = events?.event_count ?? events?.events?.length ?? 0;
const clusteredEventsDetected = clusteredEvents?.event_count ?? clusteredEvents?.events?.length ?? null;
const provenanceDetected = provenance?.events_analyzed ?? provenance?.provenance?.length ?? 0;
const correlationsDetected = correlations?.correlation_count ?? correlations?.correlations?.length ?? 0;
const rankedStories = ranking?.ranking || ranking?.candidates || ranking?.ranked_candidates || [];

const dataIntegrityIssues = [];
if (results.every(x => x.ok) && candidatesDetected === 0) {
  dataIntegrityIssues.push('No candidates detected after a successful ingest.');
}
if (results.every(x => x.ok) && eventsDetected === 0) {
  dataIntegrityIssues.push('No events detected after clustering/consolidation.');
}
if (results.every(x => x.ok) && provenanceDetected !== eventsDetected) {
  dataIntegrityIssues.push(`Provenance event count (${provenanceDetected}) does not match event count (${eventsDetected}).`);
}
if (results.every(x => x.ok) && correlationsDetected !== eventsDetected) {
  dataIntegrityIssues.push(`Correlation count (${correlationsDetected}) does not match event count (${eventsDetected}).`);
}
if (results.every(x => x.ok) && correlationsDetected > 0 && rankedStories.length === 0) {
  dataIntegrityIssues.push('Correlations exist but ranking output is empty.');
}
if (results.every(x => x.ok) && ranking?.mode === 'event-radar-ranking' && ranking.events_analyzed !== eventsDetected) {
  dataIntegrityIssues.push('Event ranking count does not match event count.');
}

const auditSummary = provenanceAudit?.summary || null;

const report = {
  execution_id: executionId,
  execution_started_at: started,
  execution_finished_at: finished,
  status: results.every(x => x.ok) && dataIntegrityIssues.length === 0 ? 'COMPLETED' : 'PARTIAL_FAILURE',
  pipeline: results,
  data_integrity: {
    ok: dataIntegrityIssues.length === 0,
    issues: dataIntegrityIssues
  },
  source_coverage: coverage ? {
    total_registered_sources: coverage.total_registered_sources,
    analyzed_sources: coverage.analyzed_sources,
    unavailable_sources: coverage.unavailable_sources,
    pending_verification_sources: coverage.pending_verification_sources,
    coverage_percentage: coverage.coverage_percentage
  } : null,
  event_consolidation: {
    clustered_events: clusteredEventsDetected,
    consolidated_events: eventsDetected,
    merged_event_clusters: events?.merged_cluster_count ?? null,
    merged_event_count: events?.merged_event_count ?? null
  },
  event_relations: eventRelations ? {
    relation_count: eventRelations.relation_count ?? eventRelations.relations?.length ?? 0,
    counts: eventRelations.counts || {},
    engine: eventRelations.engine,
    version: eventRelations.version
  } : null,
  provenance_audit: auditSummary ? {
    events_analyzed: provenanceAudit.events_analyzed,
    zero_independence_events: provenanceAudit.zero_independence_events,
    classifications: auditSummary.classifications,
    classification_confidence: auditSummary.classification_confidence,
    multi_source_zero_independence: auditSummary.multi_source_zero_independence,
    multi_host_zero_independence: auditSummary.multi_host_zero_independence,
    unknown_multi_host_cases: auditSummary.unknown_multi_host_cases,
    shared_host_cases_not_promoted_to_same_organization: auditSummary.shared_host_cases_not_promoted_to_same_organization
  } : null,
  intelligence: {
    candidates_detected: candidatesDetected,
    events_detected: eventsDetected,
    provenance_events: provenanceDetected,
    correlations_detected: correlationsDetected,
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
    ranked_stories: rankedStories.slice(0, 20).map(x => ({
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
    provenance_audit_is_observational_not_truth: true,
    semantic_consolidation_is_conservative: true,
    event_relations_do_not_merge_events: true,
    human_editorial_approval_required: true
  }
};

fs.mkdirSync('editorial/radars', { recursive: true });
fs.writeFileSync(out, JSON.stringify(report, null, 2) + '\n');
console.log(`Daily intelligence run ${report.status} → ${out}`);
process.exit(report.status === 'COMPLETED' ? 0 : 1);
