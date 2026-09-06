#!/usr/bin/env node

/**
 * MALDITOESPEJO provenance audit v1.1.
 *
 * Audits events where apparent_independent_source_count === 0 and separates
 * observable provenance patterns from uncertainty. This script does not
 * change provenance, ranking, or publication state.
 *
 * IMPORTANT: a shared origin host alone is not treated as proof of common
 * organizational ownership. SAME_ORGANIZATION requires a stronger observable
 * pattern: multiple source IDs, one origin host, and one repeated title across
 * the provenance groups. Otherwise the result remains UNKNOWN or
 * DERIVED_LINEAGE when a shared lineage is directly observable.
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
  const allGroupsSameTitle = groups.length > 0 && groups.every(g => g.same_title === true);

  // Stronger observable pattern than shared host alone: multiple source IDs
  // repeatedly expose the same title from a single origin host. This supports
  // an apparent organizational relationship, but is still not proof of legal
  // or editorial ownership.
  if (hosts.length === 1 && sourceIds.length >= 2 && allGroupsSameTitle) {
    return {
      category: 'SAME_ORGANIZATION',
      confidence: 'MEDIUM',
      evidence: [
        'Multiple observed source IDs share one origin host.',
        'The provenance groups repeat the same normalized title.',
      ],
      limitations: [
        'Shared host and repeated title do not independently prove common ownership or editorial control.',
      ],
    };
  }

  if (groups.length === 1 && sourceIds.length >= 2) {
    return {
      category: 'DERIVED_LINEAGE',
      confidence: 'MEDIUM',
      evidence: [
        'Multiple observed source IDs collapse into one provenance lineage.',
      ],
      limitations: [
        'The metadata shows a shared observed lineage but does not identify the underlying primary source.',
      ],
    };
  }

  if (hasMultiSourceLineage) {
    return {
      category: 'DERIVED_LINEAGE',
      confidence: 'MEDIUM',
      evidence: [
        'At least one lineage contains multiple source IDs, indicating a shared observed signal.',
      ],
      limitations: [
        'The metadata does not establish whether the shared signal originated with an agency, communiqué, authority, journalist, or another source.',
      ],
    };
  }

  if (groups.length >= 2 && hosts.length >= 2) {
    return {
      category: 'UNKNOWN',
      confidence: 'LOW',
      evidence: [
        'Multiple provenance groups and multiple origin hosts are observable.',
      ],
      limitations: [
        'Current metadata cannot establish whether the sources are genuinely independent or share an upstream source.',
      ],
    };
  }

  if (groups.length >= 2 && hosts.length === 1) {
    return {
      category: 'UNKNOWN',
      confidence: 'LOW',
      evidence: [
        'Multiple provenance groups share one origin host.',
      ],
      limitations: [
        'A shared host is evidence of common origin infrastructure but is insufficient by itself to establish organizational ownership or editorial lineage.',
      ],
    };
  }

  return {
    category: 'UNKNOWN',
    confidence: 'LOW',
    evidence: [],
    limitations: [
      'Insufficient provenance evidence to classify independence or common origin.',
    ],
  };
}

const zeroRecords = records.filter(r => Number(r.apparent_independent_source_count) === 0);
const audited = zeroRecords.map(record => {
  const classification = classify(record);
  return {
    event_id: record.event_id,
    candidate_count: record.candidate_count,
    observed_source_count: record.observed_source_count,
    provenance_group_count: record.provenance_group_count,
    apparent_independent_source_count: record.apparent_independent_source_count,
    provenance_confidence: record.provenance_confidence,
    source_ids: record.source_ids || [],
    origin_hosts: unique((record.lineage_groups || []).flatMap(g => g.origin_hosts || [])),
    classification: classification.category,
    classification_confidence: classification.confidence,
    classification_evidence: classification.evidence,
    classification_limitations: classification.limitations,
  };
});

const categories = ['SAME_ORGANIZATION', 'DERIVED_LINEAGE', 'UNKNOWN'];
const counts = Object.fromEntries(
  categories.map(category => [category, audited.filter(r => r.classification === category).length])
);

const confidenceCounts = Object.fromEntries(
  ['HIGH', 'MEDIUM', 'LOW'].map(level => [
    level,
    audited.filter(r => r.classification_confidence === level).length,
  ])
);

const multiSourceZero = audited.filter(r => r.observed_source_count > 1);
const multiHostZero = audited.filter(r => r.origin_hosts.length > 1);
const unknownMultiHost = audited.filter(r => r.classification === 'UNKNOWN' && r.origin_hosts.length > 1);
const sameOrgByHostOnlyBlocked = audited.filter(r =>
  r.classification === 'UNKNOWN' &&
  r.origin_hosts.length === 1 &&
  r.observed_source_count > 1
);

const result = {
  engine: 'MALDITOESPEJO_NEWS_PROVENANCE_AUDITOR',
  version: '1.1.0',
  generated_at: new Date().toISOString(),
  input,
  events_analyzed: records.length,
  zero_independence_events: zeroRecords.length,
  summary: {
    classifications: counts,
    classification_confidence: confidenceCounts,
    multi_source_zero_independence: multiSourceZero.length,
    multi_host_zero_independence: multiHostZero.length,
    unknown_multi_host_cases: unknownMultiHost.length,
    shared_host_cases_not_promoted_to_same_organization: sameOrgByHostOnlyBlocked.length,
  },
  editorial_boundary: {
    audit_is_not_truth: true,
    classification_is_not_editorial_verdict: true,
    independence_is_not_proven: true,
    same_organization_requires_observable_evidence_beyond_shared_host: true,
    human_editorial_review_required_for_unknown: true,
    ranking_unchanged: true,
  },
  records: audited,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');

const pct = n => zeroRecords.length ? ((n / zeroRecords.length) * 100).toFixed(2) : '0.00';
const unknowns = audited
  .filter(r => r.classification === 'UNKNOWN')
  .sort((a, b) => b.observed_source_count - a.observed_source_count || b.origin_hosts.length - a.origin_hosts.length)
  .slice(0, 50);

const lines = [
  '# Daily News Provenance Audit',
  '',
  `Generated: ${result.generated_at}`,
  `Auditor version: ${result.version}`,
  `Events analyzed: ${records.length}`,
  `Events with apparent independent source count = 0: ${zeroRecords.length}`,
  '',
  '## Classification',
  '',
  `- SAME_ORGANIZATION: ${counts.SAME_ORGANIZATION} (${pct(counts.SAME_ORGANIZATION)}%)`,
  `- DERIVED_LINEAGE: ${counts.DERIVED_LINEAGE} (${pct(counts.DERIVED_LINEAGE)}%)`,
  `- UNKNOWN: ${counts.UNKNOWN} (${pct(counts.UNKNOWN)}%)`,
  '',
  '## Classification confidence',
  '',
  `- HIGH: ${confidenceCounts.HIGH}`,
  `- MEDIUM: ${confidenceCounts.MEDIUM}`,
  `- LOW: ${confidenceCounts.LOW}`,
  '',
  '## Additional signals',
  '',
  `- Multi-source zero-independence events: ${multiSourceZero.length}`,
  `- Multi-host zero-independence events: ${multiHostZero.length}`,
  `- UNKNOWN cases with multiple hosts: ${unknownMultiHost.length}`,
  `- Shared-host cases not promoted to SAME_ORGANIZATION: ${sameOrgByHostOnlyBlocked.length}`,
  '',
  '## UNKNOWN cases requiring human review',
  '',
];

for (const r of unknowns) {
  lines.push(`- ${r.event_id}: observed_sources=${r.observed_source_count}, provenance_groups=${r.provenance_group_count}, hosts=${r.origin_hosts.join(', ') || 'UNKNOWN'}, confidence=${r.provenance_confidence}`);
  if (r.classification_evidence.length) lines.push(`  Evidence: ${r.classification_evidence.join(' ')}`);
  lines.push(`  Limitation: ${r.classification_limitations.join(' ')}`);
}

lines.push(
  '',
  '## Editorial boundary',
  '',
  '- This audit is not a truth assessment.',
  '- Classifications describe observable provenance patterns only.',
  '- SAME_ORGANIZATION requires evidence beyond a shared origin host.',
  '- UNKNOWN means the current metadata is insufficient to establish independence or common origin.',
  '- Independence is never proven by this audit.',
  '- The audit does not modify ranking or publication state.',
  ''
);
fs.writeFileSync(markdown, lines.join('\n'));

console.log(`Audited ${zeroRecords.length} zero-independence events → ${output}`);
console.log(`Summary: SAME_ORGANIZATION=${counts.SAME_ORGANIZATION}, DERIVED_LINEAGE=${counts.DERIVED_LINEAGE}, UNKNOWN=${counts.UNKNOWN}`);
