#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const CONFIG = path.join(ROOT, 'editorial/radars/DAILY_NEWS_INGEST_CONFIG.json');
const OUTPUT = path.join(ROOT, 'editorial/radars/daily-news-candidates.json');
const STATE = path.join(ROOT, 'editorial/radars/.daily-news-ingest-state.json');

const config = JSON.parse(fs.readFileSync(CONFIG, 'utf8'));
const state = fs.existsSync(STATE) ? JSON.parse(fs.readFileSync(STATE, 'utf8')) : { first_seen: {} };
state.first_seen ||= {};

const clean = (value = '') => String(value)
  .replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1')
  .replace(/<[^>]+>/g, ' ')
  .replace(/&amp;/g, '&').replace(/&lt;/g, '<').replace(/&gt;/g, '>')
  .replace(/&quot;/g, '"').replace(/&#39;/g, "'")
  .replace(/\s+/g, ' ').trim();

const tag = (block, name) => {
  const re = new RegExp(`<${name}(?:\\s[^>]*)?>([\\s\\S]*?)</${name}>`, 'i');
  return clean(block.match(re)?.[1] || '');
};

function parseFeed(xml) {
  const blocks = [
    ...xml.matchAll(/<item(?:\s[^>]*)?>([\s\S]*?)<\/item>/gi),
    ...xml.matchAll(/<entry(?:\s[^>]*)?>([\s\S]*?)<\/entry>/gi)
  ].map(m => m[1]);

  return blocks.map(block => {
    const title = tag(block, 'title');
    const summary = tag(block, 'description') || tag(block, 'summary') || tag(block, 'content');
    const published = tag(block, 'pubDate') || tag(block, 'published') || tag(block, 'updated');
    const guid = tag(block, 'guid') || tag(block, 'id');
    const linkMatch = block.match(/<link(?:\s[^>]*)?>([\s\S]*?)<\/link>/i);
    const hrefMatch = block.match(/<link[^>]+href=["']([^"']+)["'][^>]*>/i);
    const url = clean(linkMatch?.[1] || hrefMatch?.[1] || guid);
    return { title, summary, published, url, guid };
  }).filter(item => item.title && item.url);
}

function stableId(feedId, item) {
  const key = `${feedId}|${item.guid || item.url}|${item.title}`;
  const hex = crypto.createHash('sha256').update(key).digest('hex').slice(0, 8);
  return `NEWS-${parseInt(hex, 16).toString().padStart(8, '0').slice(-8)}`;
}

async function fetchText(url) {
  const response = await fetch(url, {
    headers: { 'user-agent': 'MALDITOESPEJO-Newsroom/1.0 (+editorial radar)' },
    redirect: 'follow'
  });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return await response.text();
}

async function discoverAemetFeeds(pageUrl) {
  const html = await fetchText(pageUrl);
  const urls = [...html.matchAll(/href=["']([^"']+)["']/gi)]
    .map(m => m[1])
    .map(u => new URL(u, pageUrl).href)
    .filter(u => /rss|atom/i.test(u));
  return [...new Set(urls)].slice(0, 10);
}

const candidates = [];
const run = new Date().toISOString();
const errors = [];

for (const feed of config.feeds.filter(f => f.enabled)) {
  let urls = feed.type === 'rss_discovery_page' ? await discoverAemetFeeds(feed.url) : [feed.url];
  if (!urls.length) urls = [feed.url];

  for (const url of urls) {
    try {
      const xml = await fetchText(url);
      const items = parseFeed(xml);
      for (const item of items) {
        const candidateId = stableId(feed.feed_id, item);
        state.first_seen[candidateId] ||= item.published && !Number.isNaN(Date.parse(item.published))
          ? new Date(item.published).toISOString()
          : run;

        candidates.push({
          candidate_id: candidateId,
          detected_at: run,
          first_seen_at: state.first_seen[candidateId],
          title: item.title,
          summary: item.summary,
          url: item.url,
          language: feed.language,
          geography: feed.geography,
          section_candidate: feed.section_candidate,
          entities: [],
          topics: [],
          source_ids: [feed.source_id],
          source_count: 1,
          independent_source_count: 1,
          duplicate_cluster_id: null,
          status: 'NEW',
          signals: {
            virality: { volume: null, velocity: null, acceleration: null, cross_source_spread: null, search_interest: null, persistence: null },
            editorial: { relevance: null, impact: null, novelty: null, editorial_fit: null, verification_readiness: null, originality_opportunity: null, source_independence: 100 },
            timeliness: null,
            risk: null
          },
          ingest: {
            feed_id: feed.feed_id,
            endpoint_id: feed.endpoint_id,
            feed_url: url,
            authority_level: feed.authority_level,
            publication_time: item.published || null,
            ingested_at: run
          }
        });
      }
    } catch (error) {
      errors.push({ feed_id: feed.feed_id, url, error: error.message });
    }
  }
}

const unique = new Map();
for (const candidate of candidates) unique.set(candidate.candidate_id, candidate);

fs.mkdirSync(path.dirname(OUTPUT), { recursive: true });
fs.writeFileSync(OUTPUT, JSON.stringify({ generated_at: run, candidates: [...unique.values()], ingest_errors: errors }, null, 2) + '\n');
fs.writeFileSync(STATE, JSON.stringify(state, null, 2) + '\n');

console.log(`Ingested ${unique.size} candidates from ${config.feeds.filter(f => f.enabled).length} configured feeds.`);
if (errors.length) console.error(`Feed errors: ${errors.length}`);
