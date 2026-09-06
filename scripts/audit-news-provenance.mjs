#!/usr/bin/env node

/**
 * MALDITOESPEJO provenance audit.
 *
 * Audits events where apparent_independent_source_count === 0 and separates
 * observable patterns from unknown cases. This script does not change
 * provenance, ranking, or publication state.
 */
import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'editorial/radars/daily-news-provenance.json';
const output = process.argv[3] || 'editorial/radars/daily-news-provenance-audit.json';
const markdown = process.argv[4] || 'editorial/radars/daily-news-provenance-audit.md';

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const records = Array.isArray(data) ? data : (data.provenance || []);

const unique = values => [...new Set(values.filter(Boolean))];

function classify(record) {
  const groups = record.lineage_groups || [];
  const hosts = unique(groups.flatMap(g => g.origin_hosts || []));
  const sourceIds = unique(record.source_ids || []);
  const groupSourceSets = groups.map(g => unique(g.source_ids || []));
  const hasMultiSourceLineage = groupSourceSets.some(s => s.length > 1);
  const sameTitleGroups = groups.filter(g => g.same_title).length;

  // Strong observable pattern: multiple source IDs collapse to one host and/or
  // one lineage family. We call this SAME_ORGANIZATION rather than claiming
  // organizational ownership as fact.
  if (hosts.length === 1 && sourceIds.length >= 2) {
    return {
      category: 'SAME_ORGANIZATION',
      reason: 'Multiple observed source IDs share one origin host.',
    };
  }

  if (groups.length === 1 && sourceIds.length >= 2) {
    return {
      category: 'DERIVED_LINEAGE',
      reason: 'Multiple observed source IDs collapse into one provenance lineage.',
    };
  }

  if (hasMultiSourceLineage) {
    return {
      category: 'DERIVED_LINEAGE',
      reason: 'At least one lineage contains multiple source IDs, indicating a shared observed signal.',
    };
  }

  if (groups.length >= 2 && hosts.length >= 2) {
    return {
      category: 'UNKNOWN',
      reason: 'Multiple lineage groups and hosts exist, but the current layer cannot establish whether they are genuinely independent.',
    };
  }

  if (sameTitleGroups > 0 && groups.length > 1) {
    return {
      category: 'UNKNOWN',
      reason: 'Repeated title across lineage groups is insufficient to establish independence or common origin.',
    };
  }

  return {
    category: 'UNKNOWN',
    reason: 'Insufficient provenance evidence to classify independence.',
  };
}

const zeroRecords = records.filter(r => Number(r.apparent_independent_source_count) === 0);
const audited = zeroRecords.map(record => ({
  event_id: record.event_id,
  candidate_count: record.candidate_count,
  observed_source_count: record.observed_source_count,
  provenance_group_count: record.provenance_group_count,
  apparent_independent_source_count: record.apparent_independent_source_count,
  provenance_confidence: record.provenance_confidence,
  source_ids: record.source_ids || [],
  origin_hosts: unique((record.lineage_groups || []).flatMap(g => g.origin_hosts || [])),
  classification: classify(record),
}));

const counts = Object.fromEntries(
  ['SAME_ORGANIZATION', 'DERIVED_LINEAGE', 'UNKNOWN'].map(category => [
    category,
    audited.filter(r => r.classification.category === category).length,
  ])
);

const multiSourceZero = audited.filter(r => r.observed_source_count > 1);
const multiHostZero = audited.filter(r => r.origin_hosts.length > 1);
const unknownMultiHost = audited.filter(r => r.classification.category === 'UNKNOWN' && r.origin_hosts.length > 1);

const result = {
  engine: 'MALDITOESPEJO_NEWS_PROVENANCE_AUDITOR',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  input,
  events_analyzed: records.length,
  zero_independence_events: zeroRecords.length,
  summary: {
    classifications: counts,
    multi_source_zero_independence: multiSourceZero.length,
    multi_host_zero_independence: multiHostZero.length,
    unknown_multi_host_cases: unknownMultiHost.length,
  },
  editorial_boundary: {
    audit_is_not_truth: true,
    classification_is_not_editorial_verdict: true,
    independence_is_not_proven: true,
    human_editorial_review_required_for_unknown: true,
    ranking_unchanged: true,
  },
  records: audited,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');

const pct = n => zeroRecords.length ? ((n / zeroRecords.length) * 100).toFixed(2) : '0.00';
const unknowns = audited
  .filter(r => r.classification.category === 'UNKNOWN')
  .sort((a, b) => b.observed_source_count - a.observed_source_count || b.origin_hosts.length - a.origin_hosts.length)
  .slice(0, 50);

const lines = [
  '# Daily News Provenance Audit',
  '',
  `Generated: ${result.generated_at}`,
  `Events analyzed: ${records.length}`,
  `Events with apparent independent source count = 0: ${zeroRecords.length}`,
  '',
  '## Classification',
  '',
  `- SAME_ORGANIZATION: ${counts.SAME_ORGANIZATION} (${pct(counts.SAME_ORGANIZATION)}%)`,
  `- DERIVED_LINEAGE: ${counts.DERIVED_LINEAGE} (${pct(counts.DERIVED_LINEAGE)}%)`,
  `- UNKNOWN: ${counts.UNKNOWN} (${pct(counts.UNKNOWN)}%)`,
  '',
  '## Additional signals',
  '',
  `- Multi-source zero-independence events: ${multiSourceZero.length}`,
  `- Multi-host zero-independence events: ${multiHostZero.length}`,
  `- UNKNOWN cases with multiple hosts: ${unknownMultiHost.length}`,
  '',
  '## UNKNOWN cases requiring human review',
  '',
];

for (const r of unknowns) {
  lines.push(`- ${r.event_id}: observed_sources=${r.observed_source_count}, provenance_groups=${r.provenance_group_count}, hosts=${r.origin_hosts.join(', ') || 'UNKNOWN'}, confidence=${r.provenance_confidence}`);
}

lines.push('', '## Editorial boundary', '', '- This audit is not a truth assessment.', '- Classifications describe observable provenance patterns only.', '- UNKNOWN means the current metadata is insufficient to establish independence.', '- The audit does not modify ranking or publication state.', '');
fs.writeFileSync(markdown, lines.join('\n'));

console.log(`Audited ${zeroRecords.length} zero-independence events → ${output}`);
console.log(`Summary: SAME_ORGANIZATION=${counts.SAME_ORGANIZATION}, DERIVED_LINEAGE=${counts.DERIVED_LINEAGE}, UNKNOWN=${counts.UNKNOWN}`);
