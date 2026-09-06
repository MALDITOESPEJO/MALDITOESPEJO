#!/usr/bin/env node

/**
 * MALDITOESPEJO provenance / lineage layer.
 *
 * The radar must distinguish source count from independent corroboration.
 * This layer is intentionally conservative: it does NOT claim that two
 * publishers are independent merely because their source_id values differ.
 * It builds provenance groups from observable lineage signals and exposes
 * an apparent-independence count plus a confidence level for audit.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const candidatesPath = process.argv[2] || 'editorial/radars/daily-news-candidates.json';
const eventsPath = process.argv[3] || 'editorial/radars/daily-news-events.json';
const output = process.argv[4] || 'editorial/radars/daily-news-provenance.json';

const candidatesData = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
const candidates = Array.isArray(candidatesData) ? candidatesData : (candidatesData.candidates || []);
const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || []);

const normalize = (value = '') => String(value)
  .toLowerCase()
  .normalize('NFD')
  .replace(/[\u0300-\u036f]/g, '')
  .replace(/https?:\/\/|www\./g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const hostOf = (value = '') => {
  try { return new URL(value).hostname.replace(/^www\./i, '').toLowerCase(); }
  catch { return ''; }
};

const sourceKey = c => String(c.source_ids?.[0] || c.ingest?.source_id || 'UNKNOWN').trim().toUpperCase();
const originHost = c => hostOf(c.url) || hostOf(c.ingest?.feed_url) || '';
const feedKey = c => String(c.ingest?.feed_url || '').trim().toLowerCase();
const titleKey = c => normalize(c.title);

const candidateById = new Map(candidates.map(c => [c.candidate_id, c]));

const lineageGroup = c => {
  const exactUrl = normalize(c.url);
  if (exactUrl) return `URL:${exactUrl}`;
  const feed = feedKey(c);
  if (feed && titleKey(c)) return `FEEDTITLE:${feed}|${titleKey(c)}`;
  return `TITLE:${titleKey(c)}`;
};

const records = events.map(event => {
  const items = (event.candidate_ids || []).map(id => candidateById.get(id)).filter(Boolean);
  const groups = new Map();

  for (const candidate of items) {
    const source = sourceKey(candidate);
    const host = originHost(candidate);
    const title = titleKey(candidate);
    const key = lineageGroup(candidate);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({ candidate_id: candidate.candidate_id, source_id: source, origin_host: host, title_key: title });
  }

  const sourceGroups = new Map();
  for (const group of groups.values()) {
    const sources = [...new Set(group.map(x => x.source_id).filter(Boolean))];
    const hosts = [...new Set(group.map(x => x.origin_host).filter(Boolean))];
    for (const source of sources) {
      if (!sourceGroups.has(source)) sourceGroups.set(source, { source_id: source, lineage_groups: [], origin_hosts: new Set() });
      const row = sourceGroups.get(source);
      row.lineage_groups.push(group);
      for (const host of hosts) row.origin_hosts.add(host);
    }
  }

  const sourceIds = [...sourceGroups.keys()];
  const lineageCount = groups.size;
  const independentGroups = [...groups.values()].filter(group => {
    const sources = new Set(group.map(x => x.source_id));
    const hosts = new Set(group.map(x => x.origin_host).filter(Boolean));
    // A lineage group containing multiple publishers is treated as one
    // underlying signal, not multiple independent confirmations.
    return sources.size === 1 && (hosts.size <= 1 || hosts.size === 0);
  });

  // Conservative apparent independence: distinct source IDs that are not
  // observed inside the same lineage group. This is still an inference,
  // therefore the result is explicitly named "apparent" rather than factual.
  const corroboratingSources = sourceIds.filter(source => {
    const rows = sourceGroups.get(source);
    return rows && rows.lineage_groups.every(group => {
      const sources = new Set(group.map(x => x.source_id));
      return sources.size === 1;
    });
  });

  let confidence = 'LOW';
  if (sourceIds.length >= 2 && corroboratingSources.length >= 2) confidence = 'MEDIUM';
  if (sourceIds.length >= 3 && corroboratingSources.length >= 3 && lineageCount >= 3) confidence = 'HIGH';

  const lineageIds = [...groups.entries()].map(([key, rows]) => ({
    lineage_id: 'LIN-' + crypto.createHash('sha256').update(key).digest('hex').slice(0, 10).toUpperCase(),
    candidate_ids: rows.map(x => x.candidate_id),
    source_ids: [...new Set(rows.map(x => x.source_id))],
    origin_hosts: [...new Set(rows.map(x => x.origin_host).filter(Boolean))],
    same_title: new Set(rows.map(x => x.title_key).filter(Boolean)).size === 1,
  }));

  return {
    event_id: event.event_id,
    candidate_count: items.length,
    observed_source_count: sourceIds.length,
    provenance_group_count: lineageCount,
    apparent_independent_source_count: corroboratingSources.length,
    source_ids: sourceIds,
    apparent_independent_source_ids: corroboratingSources,
    provenance_confidence: confidence,
    lineage_groups: lineageIds,
    limitations: [
      'La independencia real no puede inferirse solo de metadatos de feeds.',
      'Una misma agencia, comunicado o fuente primaria puede alimentar varios medios.',
      'El contador de independencia es conservador y debe tratarse como señal, no como hecho editorial.',
    ],
  };
});

const result = {
  engine: 'MALDITOESPEJO_NEWS_PROVENANCE_LAYER',
  version: '1.0.0',
  generated_at: new Date().toISOString(),
  events_analyzed: records.length,
  provenance: records,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Derived provenance for ${records.length} events → ${output}`);
