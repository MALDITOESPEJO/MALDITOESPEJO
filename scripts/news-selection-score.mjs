#!/usr/bin/env node

/**
 * MALDITOESPEJO Daily News Selection Engine — deterministic scoring layer.
 *
 * Input: JSON array of normalized candidate objects.
 * Missing signals remain unknown and are excluded from the applicable weighted
 * average rather than silently converted to zero.
 * Output: candidates with component scores and newsroom priority.
 */

import fs from 'node:fs';

const input = process.argv[2];
const output = process.argv[3] || 'editorial/radars/daily-news-ranking.json';

if (!input) {
  console.error('Usage: node scripts/news-selection-score.mjs <input.json> [output.json]');
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const candidates = Array.isArray(data) ? data : data.candidates;
if (!Array.isArray(candidates)) throw new Error('Input must be an array or an object with candidates[]');

const clamp = (n) => Math.max(0, Math.min(100, n));
const number = (v) => Number.isFinite(Number(v)) ? clamp(Number(v)) : null;

function weighted(values, weights) {
  let total = 0;
  let weight = 0;
  for (const [key, w] of Object.entries(weights)) {
    const v = number(values[key]);
    if (v === null) continue;
    total += v * w;
    weight += w;
  }
  return weight ? total / weight : null;
}

const viralityWeights = {
  volume: 0.20,
  velocity: 0.25,
  acceleration: 0.20,
  cross_source_spread: 0.15,
  search_interest: 0.10,
  persistence: 0.10,
};

const editorialWeights = {
  relevance: 0.20,
  public_impact: 0.20,
  novelty: 0.15,
  editorial_fit: 0.15,
  verification_readiness: 0.15,
  originality_opportunity: 0.10,
  source_independence: 0.05,
};

const result = candidates.map((candidate) => {
  const signals = candidate.signals || {};
  const virality = weighted(signals, viralityWeights);
  const editorial = weighted(signals, editorialWeights);
  const risk = number(signals.risk);
  const timeliness = number(signals.timeliness);

  // Unknown dimensions are not treated as zero. Priority is only calculated
  // from the dimensions available for this candidate, preserving uncertainty.
  const priorityBase = weighted(
    { virality, editorial, timeliness },
    { virality: 0.40, editorial: 0.50, timeliness: 0.10 },
  );
  const riskPenalty = risk === null ? 0 : Math.max(0, risk - 50) * 0.20;
  const priority = priorityBase === null ? null : clamp(priorityBase - riskPenalty);

  let status = 'WATCH';
  if (priority !== null && priority >= 75 && (risk === null || risk < 70)) status = 'INVESTIGATE_NOW';
  else if (priority !== null && priority >= 55) status = 'WATCH';
  else if (virality !== null && virality >= 75) status = 'TREND';
  else if (priority !== null && priority < 30) status = 'DISCARD';
  if (risk !== null && risk >= 90) status = 'BLOCKED';

  const scored = {
    ...candidate,
    scores: {
      virality: virality === null ? null : Number(virality.toFixed(2)),
      editorial: editorial === null ? null : Number(editorial.toFixed(2)),
      risk,
      timeliness,
      priority: priority === null ? null : Number(priority.toFixed(2)),
    },
    status,
  };

  return scored;
}).sort((a, b) => (b.scores.priority ?? -1) - (a.scores.priority ?? -1));

fs.mkdirSync(new URL('.', `file://${process.cwd()}/${output}`).pathname.replace(/\\$/, ''), { recursive: true });
fs.writeFileSync(output, JSON.stringify({ generated_at: new Date().toISOString(), candidates: result }, null, 2) + '\n');
console.log(`Ranked ${result.length} news candidates → ${output}`);
