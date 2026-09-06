#!/usr/bin/env node

/**
 * MALDITOESPEJO semantic event consolidation layer.
 *
 * Clustering is intentionally conservative. This pass only collapses event
 * clusters that are very likely to describe the same underlying development;
 * related but distinct developments remain separate for editorial review.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';

const input = process.argv[2] || 'editorial/radars/daily-news-events.json';
const output = process.argv[3] || 'editorial/radars/daily-news-events.json';
const rawOutput = process.env.NEWS_EVENT_CLUSTERED_OUTPUT || 'editorial/radars/daily-news-events-clustered.json';
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const events = Array.isArray(data) ? data : (data.events || []);

const STOP = new Set([
  'para','como','desde','entre','sobre','tras','ante','esta','este','estos','estas',
  'una','uno','unos','unas','del','las','los','por','con','sin','sus','que','han',
  'hay','más','menos','segun','según','tambien','también','ahora','hoy','ayer',
  'todos','todas','cada','donde','cuando','quien','quién','esta','ese','esa'
]);

const normalize = value => String(value || '')
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/[^a-z0-9ñ]+/g, ' ')
  .trim();

const tokens = value => new Set(normalize(value).split(/\s+/).filter(x => x.length > 3 && !STOP.has(x)));
const jaccard = (a, b) => {
  if (!a.size || !b.size) return 0;
  let intersection = 0;
  for (const token of a) if (b.has(token)) intersection++;
  return intersection / (a.size + b.size - intersection);
};
const numbers = value => new Set((String(value || '').match(/\b\d+(?:[.,]\d+)?\b/g) || []));
const geo = e => String(e.geography || '').trim().toLowerCase();
const section = e => String(e.section_candidate || '').trim().toLowerCase();
const withinWindow = (a, b) => {
  const ta = Date.parse(a.temporal?.first_seen || a.temporal?.last_seen || '');
  const tb = Date.parse(b.temporal?.first_seen || b.temporal?.last_seen || '');
  if (!Number.isFinite(ta) || !Number.isFinite(tb)) return true;
  return Math.abs(ta - tb) <= 48 * 3600000;
};

const representative = e => ({
  title: String(e.title || ''),
  summary: String(e.summary || ''),
  titleTokens: tokens(e.title),
  fullTokens: tokens(`${e.title || ''} ${e.summary || ''}`),
});
const reps = new Map(events.map(e => [e.event_id, representative(e)]));

// Blocking remains deterministic and bounded, but no longer requires an exact
// geography/section match. Near-identical headlines can legitimately carry
// different metadata after ingestion (e.g. Ceuta vs. España). Strong title
// evidence is therefore allowed to bridge metadata differences.
const blocks = new Map();
for (const event of events) {
  const r = reps.get(event.event_id);
  const anchor = [...r.titleTokens].sort().slice(0, 3).join('|') || '*';
  const key = `${anchor}|${section(event) || '*'}|${geo(event) || '*'}`;
  if (!blocks.has(key)) blocks.set(key, []);
  blocks.get(key).push(event);
}

// Secondary broad blocks catch the same headline when geography or section
// differs, while still keeping comparisons bounded by the first title token.
for (const event of events) {
  const r = reps.get(event.event_id);
  const firstToken = [...r.titleTokens].sort()[0] || '*';
  const key = `TITLE|${firstToken}`;
  if (!blocks.has(key)) blocks.set(key, []);
  blocks.get(key).push(event);
}

const parent = new Map(events.map(e => [e.event_id, e.event_id]));
const find = id => {
  let root = parent.get(id) || id;
  while (parent.get(root) !== root) root = parent.get(root);
  let cursor = id;
  while (parent.get(cursor) !== cursor) {
    const next = parent.get(cursor);
    parent.set(cursor, root);
    cursor = next;
  }
  return root;
};
const union = (a, b) => {
  const ra = find(a); const rb = find(b);
  if (ra !== rb) parent.set(rb, ra);
};

let merges = 0;
const comparedPairs = new Set();
for (const block of blocks.values()) {
  for (let i = 0; i < block.length; i++) {
    const a = block[i];
    const ar = reps.get(a.event_id);
    for (let j = i + 1; j < block.length; j++) {
      const b = block[j];
      if (a.event_id === b.event_id) continue;
      const pairKey = [a.event_id, b.event_id].sort().join('|');
      if (comparedPairs.has(pairKey)) continue;
      comparedPairs.add(pairKey);
      if (!withinWindow(a, b)) continue;

      const br = reps.get(b.event_id);
      const titleSimilarity = jaccard(ar.titleTokens, br.titleTokens);
      const fullSimilarity = jaccard(ar.fullTokens, br.fullTokens);
      const sameGeo = geo(a) && geo(b) ? geo(a) === geo(b) : false;
      const sameSection = section(a) && section(b) ? section(a) === section(b) : false;
      const aNumbers = numbers(`${a.title || ''} ${a.summary || ''}`);
      const bNumbers = numbers(`${b.title || ''} ${b.summary || ''}`);
      const conflictingNumbers = aNumbers.size && bNumbers.size &&
        [...aNumbers].some(n => !bNumbers.has(n)) && [...bNumbers].some(n => !aNumbers.has(n));

      // High title overlap is the strongest duplicate signal. A lower title
      // overlap requires both contextual compatibility and strong full-text
      // agreement. This prevents evolving but related stories from collapsing.
      const sameEvent = !conflictingNumbers && (
        (titleSimilarity >= 0.78) ||
        (titleSimilarity >= 0.68 && fullSimilarity >= 0.60 && (sameGeo || sameSection))
      );
      if (sameEvent) {
        union(a.event_id, b.event_id);
        merges++;
      }
    }
  }
}

const groups = new Map();
for (const event of events) {
  const root = find(event.event_id);
  if (!groups.has(root)) groups.set(root, []);
  groups.get(root).push(event);
}

const consolidated = [...groups.values()].map(group => {
  if (group.length === 1) {
    return {
      ...group[0],
      consolidation: {
        type: 'ORIGINAL_CLUSTER',
        merged_event_ids: [group[0].event_id],
        merged_event_count: 1,
      },
    };
  }

  const candidateIds = [...new Set(group.flatMap(e => e.candidate_ids || []))].sort();
  const eventId = 'EVT-' + crypto.createHash('sha256').update(candidateIds.join('|')).digest('hex').slice(0, 8).toUpperCase();
  const lead = [...group].sort((a, b) => (b.candidate_count || 0) - (a.candidate_count || 0))[0];
  const similarities = [];
  for (let i = 0; i < group.length; i++) {
    for (let j = i + 1; j < group.length; j++) {
      const a = reps.get(group[i].event_id); const b = reps.get(group[j].event_id);
      similarities.push(jaccard(a.titleTokens, b.titleTokens));
    }
  }
  const sourceIds = [...new Set(group.flatMap(e => e.source_ids || []))];
  const sourceHosts = [...new Set(group.flatMap(e => e.source_hosts || []))];
  const first = group.map(e => Date.parse(e.temporal?.first_seen || '')).filter(Number.isFinite).sort((a,b) => a-b)[0];
  const last = group.map(e => Date.parse(e.temporal?.last_seen || '')).filter(Number.isFinite).sort((a,b) => b-a)[0];
  const maxSimilarity = similarities.reduce((max, value) => Math.max(max, value), 0);
  return {
    ...lead,
    event_id: eventId,
    candidate_ids: candidateIds,
    candidate_count: candidateIds.length,
    source_ids: sourceIds,
    source_count: sourceIds.length,
    source_hosts: sourceHosts,
    similarity_max: Math.max(Number(lead.similarity_max || 0), maxSimilarity),
    temporal: {
      first_seen: Number.isFinite(first) ? new Date(first).toISOString() : lead.temporal?.first_seen,
      last_seen: Number.isFinite(last) ? new Date(last).toISOString() : lead.temporal?.last_seen,
    },
    consolidation: {
      type: 'SAME_EVENT',
      merged_event_ids: group.map(e => e.event_id),
      merged_event_count: group.length,
      similarity_basis: Number(maxSimilarity.toFixed(3)),
      reason: 'Clusters con alta similitud semántica de título y contexto compatible, con ventana temporal de 48 horas.',
    },
  };
});

consolidated.sort((a, b) => Number(b.signals?.trend_score || 0) - Number(a.signals?.trend_score || 0));
const result = {
  generated_at: new Date().toISOString(),
  engine: 'MALDITOESPEJO_SEMANTIC_EVENT_CONSOLIDATION',
  version: '1.1.0',
  input_event_count: events.length,
  output_event_count: consolidated.length,
  event_count: consolidated.length,
  merged_cluster_count: consolidated.filter(e => e.consolidation?.type === 'SAME_EVENT').length,
  merged_event_count: merges,
  classification_policy: {
    SAME_EVENT: 'Se consolida antes de correlación y ranking cuando la evidencia semántica y contextual es fuerte.',
    RELATED_EVENT: 'No se consolida automáticamente; se mantiene como evento separado para revisión editorial.',
    PARALLEL_SIGNAL: 'No se consolida automáticamente.',
    DUPLICATE: 'Se identifica después de la consolidación cuando procede.',
  },
  events: consolidated,
};

fs.mkdirSync('editorial/radars', { recursive: true });
if (rawOutput !== output) fs.writeFileSync(rawOutput, JSON.stringify(data, null, 2) + '\n');
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Consolidated ${events.length} clustered events into ${consolidated.length} semantic events (${merges} merges) → ${output}`);
