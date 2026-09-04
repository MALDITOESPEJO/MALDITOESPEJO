#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const registryPath = process.argv[2] || 'editorial/sources/MASTER_SOURCE_REGISTRY_NORMALIZED.csv';
const channelsGlob = process.argv.slice(3);
const output = process.env.SOURCE_COVERAGE_OUTPUT || 'editorial/radars/daily-source-coverage.json';

const channelFiles = channelsGlob.length
  ? channelsGlob
  : fs.readdirSync(path.join(ROOT, 'editorial/sources'))
      .filter((name) => /^MASTER_SOURCE_CHANNELS_.*\.csv$/i.test(name))
      .sort()
      .map((name) => path.join('editorial/sources', name));

const endpointFiles = fs.readdirSync(path.join(ROOT, 'editorial/sources'))
  .filter((name) => /^MASTER_SOURCE_ENDPOINTS_.*\.csv$/i.test(name))
  .sort()
  .map((name) => path.join('editorial/sources', name));

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

function absolute(p) { return path.isAbsolute(p) ? p : path.join(ROOT, p); }

function normaliseSourceId(value) {
  return String(value || '').trim().toUpperCase();
}

function isHttp(value) { return /^https?:\/\//i.test(String(value || '').trim()); }

function classifyEndpoint(endpoint) {
  const type = String(endpoint.endpoint_type || '').toUpperCase();
  const protocol = String(endpoint.protocol || '').toUpperCase();
  if (type === 'TOOL' || type === 'INTERACTIVE' || protocol === 'INTERACTIVE') return 'MANUAL_TOOL';
  if (!isHttp(endpoint.endpoint)) return 'NON_URL';
  if (/API|SDMX|REST|DATA_FEED|DATASET|PORTAL/i.test(type)) return 'MACHINE_READABLE';
  if (/RSS|CAP|WEB_FEED/i.test(type)) return 'FEED';
  return 'WEB';
}

async function probe(url) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 12000);
  const started = Date.now();
  try {
    const response = await fetch(url, {
      method: 'GET',
      redirect: 'follow',
      signal: controller.signal,
      headers: { 'user-agent': 'MALDITOESPEJO-source-coverage/1.0' },
    });
    return {
      status: response.ok ? 'AVAILABLE' : (response.status === 401 || response.status === 403 ? 'AUTH_REQUIRED' : 'HTTP_ERROR'),
      http_status: response.status,
      final_url: response.url,
      latency_ms: Date.now() - started,
    };
  } catch (error) {
    return {
      status: error?.name === 'AbortError' ? 'TIMEOUT' : 'NETWORK_ERROR',
      http_status: null,
      final_url: url,
      latency_ms: Date.now() - started,
      error: String(error?.message || error),
    };
  } finally { clearTimeout(timeout); }
}

const sources = readCsv(absolute(registryPath));
const channels = channelFiles.flatMap((file) => readCsv(absolute(file)));
const endpoints = endpointFiles.flatMap((file) => readCsv(absolute(file)));
const endpointByChannel = new Map(endpoints.map((e) => [String(e.channel_id || '').trim(), e]));
const sourceById = new Map(sources.map((s) => [normaliseSourceId(s.source_id), s]));

const checks = [];
for (const source of sources) {
  const sid = normaliseSourceId(source.source_id);
  const sourceChannels = channels.filter((c) => normaliseSourceId(c.source_id) === sid || normaliseSourceId(c.source_id).startsWith(sid) || sid.startsWith(normaliseSourceId(c.source_id)));
  // Cada canal es el objetivo real a comprobar (trae su propia URL en
  // 'endpoint'). Si existe una fila correspondiente en el cat\u00e1logo de
  // endpoints (por channel_id), se usa solo para enriquecer metadatos
  // (endpoint_id, estado de verificaci\u00f3n) -- nunca para sustituir la URL
  // real del canal, que es la \u00fanica columna que de verdad contiene un
  // enlace comprobable. Antes, cualquier fila de endpoint sin URL propia
  // descartaba por completo las URLs v\u00e1lidas de todos los canales de esa
  // fuente; con esto cada canal se comprueba por separado.
  const targets = sourceChannels.map((c) => {
    const matchedEndpoint = endpointByChannel.get(String(c.channel_id || '').trim());
    return {
      channel_id: c.channel_id,
      endpoint_id: matchedEndpoint?.endpoint_id || '',
      endpoint_name: matchedEndpoint?.endpoint_name || c.channel_name,
      endpoint_type: matchedEndpoint?.endpoint_type || c.channel_type,
      endpoint: c.endpoint,
      endpoint_verified: matchedEndpoint?.endpoint_verified || c.verification_status,
      protocol: matchedEndpoint?.protocol || '',
    };
  });

  if (!targets.length) {
    checks.push({ source_id: source.source_id, status: 'NO_REGISTERED_ENDPOINT', coverage_role: 'SOURCE_REGISTERED_NO_CHANNEL' });
    continue;
  }

  for (const endpoint of targets) {
    const mode = classifyEndpoint(endpoint);
    let result;
    if (mode === 'MANUAL_TOOL' || mode === 'NON_URL') {
      result = { status: 'MANUAL_CHECK_REQUIRED' };
    } else {
      result = await probe(endpoint.endpoint);
    }
    checks.push({
      source_id: source.source_id,
      source_name: source.source_name,
      channel_id: endpoint.channel_id || '',
      endpoint_id: endpoint.endpoint_id || '',
      endpoint_name: endpoint.endpoint_name || endpoint.channel_name || '',
      endpoint_type: endpoint.endpoint_type || endpoint.channel_type || '',
      access_mode: mode,
      registered_verification: endpoint.endpoint_verified || endpoint.verification_status || source.channel_status || 'UNKNOWN',
      ...result,
    });
  }
}

const bySource = new Map();
for (const check of checks) {
  if (!bySource.has(check.source_id)) bySource.set(check.source_id, []);
  bySource.get(check.source_id).push(check);
}

const sourceResults = sources.map((source) => {
  const rows = bySource.get(source.source_id) || [];
  const statuses = rows.map((r) => r.status);
  let status = 'UNAVAILABLE';
  if (statuses.includes('AVAILABLE')) status = 'ANALYZED';
  else if (statuses.includes('AUTH_REQUIRED')) status = 'AUTH_REQUIRED';
  else if (statuses.includes('MANUAL_CHECK_REQUIRED')) status = 'MANUAL_CHECK_REQUIRED';
  else if (statuses.includes('TIMEOUT') || statuses.includes('NETWORK_ERROR') || statuses.includes('HTTP_ERROR')) status = 'ERROR';
  else if (statuses.includes('NO_REGISTERED_ENDPOINT')) status = 'PENDING_VERIFICATION';
  return { source_id: source.source_id, source_name: source.source_name, status, checks: rows };
});

const counts = Object.fromEntries(['ANALYZED','UNAVAILABLE','AUTH_REQUIRED','MANUAL_CHECK_REQUIRED','ERROR','PENDING_VERIFICATION'].map((s) => [s, sourceResults.filter((r) => r.status === s).length]));
const result = {
  engine: 'MALDITOESPEJO_DAILY_SOURCE_COVERAGE',
  version: '2.0.0',
  execution_id: `COV-${Date.now()}`,
  execution_started_at: new Date().toISOString(),
  universe: {
    registered_sources: sources.length,
    registered_channels: channels.length,
    registered_endpoints: endpoints.length,
    channel_files: channelFiles,
    endpoint_files: endpointFiles,
  },
  counts,
  coverage_percentage: sources.length ? Number(((counts.ANALYZED / sources.length) * 100).toFixed(2)) : 0,
  source_results: sourceResults,
  rules: {
    all_registered_sources_are_in_scope: true,
    missing_observation_is_not_zero: true,
    source_presence_is_not_inferred_from_candidate_count: true,
    rss_is_not_required_for_source_coverage: true,
    ranking_does_not_define_source_universe: true,
    manual_tools_are_queued_instead_of_faked_as_analyzed: true,
  },
  generated_at: new Date().toISOString(),
};

fs.mkdirSync(path.dirname(absolute(output)), { recursive: true });
fs.writeFileSync(absolute(output), JSON.stringify(result, null, 2) + '\n');
console.log(`Source universe checked: ${counts.ANALYZED}/${sources.length} sources with at least one reachable endpoint \u2192 ${output}`);
