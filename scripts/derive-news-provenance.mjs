#!/usr/bin/env node

/**
 * MALDITOESPEJO provenance / lineage layer.
 *
 * The radar must distinguish source count from independent corroboration.
 * This layer is intentionally conservative: it does NOT claim that two
 * publishers are independent merely because their source_id values differ.
 * Parent-organization mapping is optional and evidence-based; unknown hosts
 * remain separate hosts rather than being silently merged.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const candidatesPath = process.argv[2] || 'editorial/radars/daily-news-candidates.json';
const eventsPath = process.argv[3] || 'editorial/radars/daily-news-events.json';
const output = process.argv[4] || 'editorial/radars/daily-news-provenance.json';
const organizationPath = process.env.NEWS_PARENT_ORGANIZATIONS || 'editorial/radars/NEWS_PARENT_ORGANIZATIONS.json';

const candidatesData = JSON.parse(fs.readFileSync(candidatesPath, 'utf8'));
const eventsData = JSON.parse(fs.readFileSync(eventsPath, 'utf8'));
const candidates = Array.isArray(candidatesData) ? candidatesData : (candidatesData.candidates || []);
const events = Array.isArray(eventsData) ? eventsData : (eventsData.events || []);
const organizationData = fs.existsSync(organizationPath) ? JSON.parse(fs.readFileSync(organizationPath, 'utf8')) : { organizations: {} };

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

const hostToOrganization = new Map();
for (const [key, organization] of Object.entries(organizationData.organizations || {})) {
  const canonical = organization.canonical_name || key;
  for (const host of organization.hosts || []) {
    hostToOrganization.set(String(host).replace(/^www\./i, '').toLowerCase(), canonical);
  }
}

const parentOrganization = host => hostToOrganization.get(host) || host || 'UNKNOWN_PARENT';
const parentOrganizationKey = host => normalize(parentOrganization(host)).replace(/\s+/g, '_').toUpperCase() || 'UNKNOWN_PARENT';

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
    const parent = parentOrganization(host);
    const title = titleKey(candidate);
    const key = lineageGroup(candidate);
    if (!groups.has(key)) groups.set(key, []);
    groups.get(key).push({
      candidate_id: candidate.candidate_id,
      source_id: source,
      origin_host: host,
      parent_organization: parent,
      title_key: title,
    });
  }

  const sourceIds = [...new Set(items.map(sourceKey).filter(Boolean))];
  const hosts = [...new Set(items.map(originHost).filter(Boolean))];
  const parentOrganizations = [...new Set(items.map(c => parentOrganization(originHost(c))).filter(Boolean))];
  const lineageCount = groups.size;

  // First collapse candidates by lineage, then collapse editorial outlets by
  // parent organization. A mapped parent counts once even when it owns many
  // hosts. Unknown hosts remain distinct, conservatively preserving recall.
  const corroboratingOrganizations = parentOrganizations.filter(parent => {
    const parentItems = items.filter(c => parentOrganization(originHost(c)) === parent);
    const parentGroups = new Set(parentItems.map(lineageGroup));
    return parentGroups.size > 0 && parentItems.length > 0;
  });

  const independentOrganizations = [...new Set(corroboratingOrganizations)];
  const independentCount = independentOrganizations.length;

  let confidence = 'LOW';
  if (independentCount >= 2) confidence = 'MEDIUM';
  if (independentCount >= 3 && lineageCount >= 3) confidence = 'HIGH';

  const lineageIds = [...groups.entries()].map(([key, rows]) => ({
    lineage_id: 'LIN-' + crypto.createHash('sha256').update(key).digest('hex').slice(0, 10).toUpperCase(),
    candidate_ids: rows.map(x => x.candidate_id),
    source_ids: [...new Set(rows.map(x => x.source_id))],
    origin_hosts: [...new Set(rows.map(x => x.origin_host).filter(Boolean))],
    parent_organizations: [...new Set(rows.map(x => x.parent_organization).filter(Boolean))],
    same_title: new Set(rows.map(x => x.title_key).filter(Boolean)).size === 1,
  }));

  return {
    event_id: event.event_id,
    candidate_count: items.length,
    observed_source_count: sourceIds.length,
    observed_host_count: hosts.length,
    observed_parent_organization_count: parentOrganizations.length,
    provenance_group_count: lineageCount,
    apparent_independent_source_count: independentCount,
    apparent_independent_parent_organization_count: independentCount,
    source_ids: sourceIds,
    origin_hosts: hosts,
    parent_organizations: parentOrganizations,
    apparent_independent_source_ids: independentOrganizations.map(parentOrganizationKey),
    apparent_independent_parent_organizations: independentOrganizations,
    provenance_confidence: confidence,
    lineage_groups: lineageIds,
    limitations: [
      'La independencia real no puede inferirse solo de metadatos de feeds.',
      'Una misma agencia, comunicado o fuente primaria puede alimentar varios medios.',
      'El mapeo de organización matriz solo reduce falsos positivos cuando existe evidencia explícita en NEWS_PARENT_ORGANIZATIONS.json.',
      'Los hosts no mapeados no se consideran automáticamente independientes de otros grupos empresariales.',
      'El contador de independencia es una señal aparente y requiere revisión editorial.',
    ],
  };
});

const result = {
  engine: 'MALDITOESPEJO_NEWS_PROVENANCE_LAYER',
  version: '2.0.0',
  generated_at: new Date().toISOString(),
  events_analyzed: records.length,
  organization_map: organizationPath,
  provenance: records,
};

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, JSON.stringify(result, null, 2) + '\n');
console.log(`Derived provenance for ${records.length} events → ${output}`);
