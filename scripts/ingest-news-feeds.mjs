#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const SOURCES_DIR = path.join(ROOT, 'editorial/sources');
const OUTPUT = path.join(ROOT, 'editorial/radars/daily-news-candidates.json');
const COVERAGE_OUTPUT = path.join(ROOT, 'editorial/radars/daily-source-coverage.json');
const STATE = path.join(ROOT, 'editorial/radars/.daily-news-ingest-state.json');
const TIMEOUT_MS = Number(process.env.NEWS_INGEST_TIMEOUT_MS || 15000);

function parseCsvLine(line) {
  const out = [];
  let value = '';
  let quoted = false;
  for (let i = 0; i < line.length; i += 1) {
    const ch = line[i];
    if (ch === '"') {
      if (quoted && line[i + 1] === '"') { value += '"'; i += 1; }
      else quoted = !quoted;
    } else if (ch === ',' && !quoted) {
      out.push(value.trim()); value = '';
    } else value += ch;
  }
  out.push(value.trim());
  return out;
}

function readCsv(file) {
  if (!fs.existsSync(file)) return [];
  const lines = fs.readFileSync(file, 'utf8').replace(/^\uFEFF/, '').split(/\r?\n/).filter(Boolean);
  if (!lines.length) return [];
  const headers = parseCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const values = parseCsvLine(line);
    return Object.fromEntries(headers.map((h, i) => [h, values[i] ?? '']));
  });
}

const files = fs.readdirSync(SOURCES_DIR);
const registry = readCsv(path.join(SOURCES_DIR, 'MASTER_SOURCE_REGISTRY_NORMALIZED.csv'));
const channelFiles = files.filter((n) => /^MASTER_SOURCE_CHANNELS_.*\.csv$/i.test(n)).sort();
const endpointFiles = files.filter((n) => /^MASTER_SOURCE_ENDPOINTS_.*\.csv$/i.test(n)).sort();
const feedFiles = files.filter((n) => /^MASTER_SOURCE_FEED_CATALOG.*\.csv$/i.test(n)).sort();
const channels = channelFiles.flatMap((n) => readCsv(path.join(SOURCES_DIR, n)));
const endpoints = endpointFiles.flatMap((n) => readCsv(path.join(SOURCES_DIR, n)));
const feeds = feedFiles.flatMap((n) => readCsv(path.join(SOURCES_DIR, n)));

const sourceById = new Map(registry.map((s) => [String(s.source_id || '').trim().toUpperCase(), s]));
const feedByEndpoint = new Map(feeds.map((f) => [String(f.endpoint_id || '').trim(), f]));
const feedByChannel = new Map(feeds.map((f) => [String(f.channel_id || '').trim(), f]));
const channelById = new Map(channels.map((c) => [String(c.channel_id || '').trim(), c]));

const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : { first_seen: {} };
state.first_seen ||= {};

const clean = (value = '') => String(value)
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/&#x27;/g, "'")
  .replace(/\s+/g, ' ').trim();

const tag = (block, name) => {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i');
  return clean(block.match(re)?.[1] || '');
};

function parseFeed(xml) {
  const blocks = [
    ...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi),
    ...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi),
  ].map((m) => m[1]);
  return blocks.map((block) => {
    const title = tag(block, 'title');
    const summary = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
    const published = tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated');
    const guid = tag(block, 'guid') || tag(block, 'id');
    const linkMatch = block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
    const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
    const url = clean(linkMatch?.[1] || hrefMatch?.[1] || guid);
    return { title, summary, published, url, guid };
  }).filter((item) => item.title && item.url);
}

function stableId(sourceId, endpointId, item) {
  const key = `${sourceId}|${endpointId}|${item.guid || item.url}|${item.title}`;
  const hex = crypto.createHash('sha256').update(key).digest('hex').slice(0, 8);
  return `NEWS-${parseInt(hex, 16).toString().padStart(8, '0').slice(-8)}`;
}

function isHttp(value) { return /^https?:\/\//i.test(String(value || '').trim()); }

function modeFor(endpoint) {
  const type = String(endpoint.endpoint_type || endpoint.channel_type || '').toUpperCase();
  if (!isHttp(endpoint.endpoint)) return 'MANUAL';
  if (/RSS|ATOM|CAP|WEB_FEED/i.test(type)) return 'FEED';
  if (/API|SDMX|REST|DATA_FEED|DATASET|PORTAL|API_DATA|OBSERVATION_FEED/i.test(type)) return 'DATA';
  if (/WEB|DOCUMENT_FEED/i.test(type)) return 'WEB';
  if (/TOOL|INTERACTIVE/i.test(type)) return 'MANUAL';
  return 'WEB';
}

async function fetchText(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        'user-agent': 'MALDITOESPEJO-Newsroom/2.0 (+universal source radar)',
        accept: 'application/rss+xml, application/atom+xml, application/xml, text/xml, application/json, text/html;q=0.8, */*;q=0.1',
      },
    });
    const text = await response.text();
    return { ok: response.ok, status: response.status, url: response.url, text, content_type: response.headers.get('content-type') || '' };
  } finally { clearTimeout(timer); }
}

function sourceContext(sourceId, endpoint) {
  const source = sourceById.get(String(sourceId).trim().toUpperCase()) || {};
  const channel = channelById.get(String(endpoint.channel_id || '').trim()) || {};
  const feed = feedByEndpoint.get(String(endpoint.endpoint_id || '').trim()) || feedByChannel.get(String(endpoint.channel_id || '').trim()) || {};
  return { source, channel, feed };
}

function candidateFromItem(sourceId, endpoint, item, run) {
  const { source, feed } = sourceContext(sourceId, endpoint);
  const id = stableId(sourceId, endpoint.endpoint_id, item);
  state.first_seen[id] ||= item.published && !Number.isNaN(Date.parse(item.published)) ? new Date(item.published).toISOString() : run;
  return {
    candidate_id: id,
    detected_at: run,
    first_seen_at: state.first_seen[id],
    title: item.title,
    summary: item.summary || '',
    url: item.url,
    language: feed.language || '',
    geography: feed.geography || '',
    section_candidate: source.radar || feed.section_candidate || '',
    entities: [],
    topics: [],
    source_ids: [sourceId],
    source_count: 1,
    independent_source_count: 1,
    duplicate_cluster_id: null,
    status: 'NEW',
    signals: {
      virality: { volume: null, velocity: null, acceleration: null, cross_source_spread: null, search_interest: null, persistence: null },
      editorial: { relevance: null, impact: null, novelty: null, editorial_fit: null, verification_readiness: null, originality_opportunity: null, source_independence: 100 },
      timeliness: null,
      risk: null,
    },
    ingest: {
      source_id: sourceId,
      endpoint_id: endpoint.endpoint_id || null,
      channel_id: endpoint.channel_id || null,
      feed_id: feed.feed_id || null,
      feed_url: endpoint.endpoint,
      authority_level: endpoint.authority_level || source.authority_level || null,
      publication_time: item.published || null,
      ingested_at: run,
      access_mode: modeFor(endpoint),
    },
  };
}

const run = new Date().toISOString();
const candidates = [];
const observations = [];
const errors = [];

// Every registered endpoint is attempted. Non-machine-readable endpoints are explicitly queued,
// never treated as empty and never converted into false "no news" results.
for (const endpoint of endpoints) {
  const sourceId = String(endpoint.source_id || '').trim();
  const mode = modeFor(endpoint);
  const base = {
    source_id: sourceId,
    channel_id: endpoint.channel_id || null,
    endpoint_id: endpoint.endpoint_id || null,
    endpoint_name: endpoint.endpoint_name || '',
    endpoint_type: endpoint.endpoint_type || '',
    access_mode: mode,
    checked_at: run,
  };

  if (mode === 'MANUAL' || mode === 'WEB' || !isHttp(endpoint.endpoint)) {
    observations.push({ ...base, status: 'MANUAL_CHECK_REQUIRED', reason: 'Endpoint requires browser, document, interactive tool, or unresolved URL handling.' });
    continue;
  }

  try {
    const response = await fetchText(endpoint.endpoint);
    const status = response.ok ? 'AVAILABLE' : (response.status === 401 || response.status === 403 ? 'AUTH_REQUIRED' : 'HTTP_ERROR');
    observations.push({ ...base, status, http_status: response.status, final_url: response.url, content_type: response.content_type });
    if (!response.ok) continue;

    if (mode === 'FEED' || /xml|rss|atom/i.test(response.content_type) || /<rss[\s>]|<feed[\s>]|<item[\s>]/i.test(response.text)) {
      const items = parseFeed(response.text);
      for (const item of items) candidates.push(candidateFromItem(sourceId, endpoint, item, run));
      observations[observations.length - 1].items_detected = items.length;
      observations[observations.length - 1].extraction = 'feed_items';
    } else if (/json/i.test(response.content_type) || /^[\s\r\n]*[{[]/.test(response.text)) {
      let parsed = null;
      try { parsed = JSON.parse(response.text); } catch { parsed = null; }
      observations[observations.length - 1].extraction = parsed ? 'json_observation' : 'non_json_payload';
      if (parsed) observations[observations.length - 1].json_top_level = Array.isArray(parsed) ? 'array' : typeof parsed;
      // Dataset/API payloads are recorded as observations. They become news candidates only
      // when an explicit feed-like item title + URL is present; we never invent headlines from data.
      const rows = Array.isArray(parsed) ? parsed : (Array.isArray(parsed?.data) ? parsed.data : []);
      const feedLike = rows.filter((r) => r && typeof r === 'object' && (r.title || r.name) && (r.url || r.link));
      for (const row of feedLike.slice(0, 100)) {
        candidates.push(candidateFromItem(sourceId, endpoint, {
          title: clean(row.title || row.name),
          summary: clean(row.summary || row.description || ''),
          published: row.published || row.date || row.updated || '',
          url: row.url || row.link,
          guid: row.id || row.guid || row.url || row.link,
        }, run));
      }
      observations[observations.length - 1].items_detected = feedLike.length;
    } else {
      observations[observations.length - 1].extraction = 'payload_not_news_feed';
    }
  } catch (error) {
    const status = error?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR';
    observations.push({ ...base, status, error: String(error?.message || error) });
    errors.push({ ...base, status, error: String(error?.message || error) });
  }
}

// Channels without a corresponding endpoint remain visible in the coverage record.
const endpointChannelIds = new Set(endpoints.map((e) => String(e.channel_id || '').trim()));
for (const channel of channels) {
  const cid = String(channel.channel_id || '').trim();
  if (cid && !endpointChannelIds.has(cid)) {
    observations.push({
      source_id: channel.source_id || null,
      channel_id: cid,
      endpoint_id: null,
      endpoint_name: channel.channel_name || '',
      endpoint_type: channel.channel_type || '',
      access_mode: isHttp(channel.endpoint) ? 'WEB' : 'MANUAL',
      checked_at: run,
      status: 'NO_REGISTERED_ENDPOINT',
      reason: 'Channel is registered but no endpoint record is available in the endpoint registry.',
    });
  }
}

const unique = new Map();
for (const candidate of candidates) unique.set(candidate.candidate_id, candidate);

const sourceStatus = new Map();
for (const source of registry) sourceStatus.set(source.source_id, []);
for (const observation of observations) {
  if (!sourceStatus.has(observation.source_id)) sourceStatus.set(observation.source_id, []);
  sourceStatus.get(observation.source_id).push(observation);
}

const sourceResults = registry.map((source) => {
  const rows = sourceStatus.get(source.source_id) || [];
  const statuses = rows.map((r) => r.status);
  let status = 'PENDING_VERIFICATION';
  if (statuses.includes('AVAILABLE')) status = 'ANALYZED';
  else if (statuses.includes('AUTH_REQUIRED')) status = 'AUTH_REQUIRED';
  else if (statuses.includes('TIMEOUT') || statuses.includes('NETWORK_ERROR') || statuses.includes('HTTP_ERROR')) status = 'ERROR';
  else if (statuses.includes('MANUAL_CHECK_REQUIRED')) status = 'MANUAL_CHECK_REQUIRED';
  else if (statuses.includes('NO_REGISTERED_ENDPOINT')) status = 'PENDING_VERIFICATION';
  return { source_id: source.source_id, source_name: source.source_name, status, checks: rows };
});

const counts = Object.fromEntries(['ANALYZED','AUTH_REQUIRED','MANUAL_CHECK_REQUIRED','ERROR','PENDING_VERIFICATION'].map((s) => [s, sourceResults.filter((r) => r.status === s).length]));
const coverage = {
  engine: 'MALDITOESPEJO_DAILY_SOURCE_COVERAGE',
  version: '3.0.0',
  execution_id: `COV-${Date.now()}`,
  execution_started_at: run,
  execution_finished_at: new Date().toISOString(),
  universe: {
    registered_sources: registry.length,
    registered_channels: channels.length,
    registered_endpoints: endpoints.length,
    registered_feeds: feeds.length,
    channel_files: channelFiles,
    endpoint_files: endpointFiles,
    feed_files: feedFiles,
  },
  counts,
  endpoint_checks: observations.length,
  candidates_detected: unique.size,
  coverage_percentage: registry.length ? Number(((counts.ANALYZED / registry.length) * 100).toFixed(2)) : 0,
  source_results: sourceResults,
  rules: {
    all_registered_sources_are_in_scope: true,
    every_registered_endpoint_is_attempted: true,
    missing_observation_is_not_zero: true,
    source_presence_is_not_inferred_from_candidate_count: true,
    rss_is_not_required_for_source_coverage: true,
    ranking_does_not_define_source_universe: true,
    manual_and_web_sources_are_queued_instead_of_faked_as_analyzed: true,
    dataset_payloads_are_not_converted_into_headlines_without_explicit_item_fields: true,
  },
  generated_at: new Date().toISOString(),
};

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify({ generated_at: run, candidates: [...unique.values()], ingest_errors: errors, endpoint_observations: observations }, null, 2) + '\n');
fs.writeFileSync(COVERAGE_OUTPUT, JSON.stringify(coverage, null, 2) + '\n');
fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n');

console.log(`Universal ingest: ${unique.size} candidates; ${observations.length} endpoint/channel checks across ${registry.length} registered sources.`);
if (errors.length) console.error(`Endpoint errors: ${errors.length}`);
