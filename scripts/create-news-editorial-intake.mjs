#!/usr/bin/env node

/**
 * MALDITOESPEJO — Editorial Intake Bridge
 *
 * Converts radar intelligence into a human-review queue. Ranking, correlation
 * and provenance remain non-factual signals. Before a signal reaches the
 * queue, it is compared against the complete article archive to prevent the
 * same event being proposed again under a different headline.
 */
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';

const ROOT = process.cwd();
const RANKING_PATH = process.env.NEWS_RANKING || 'editorial/radars/daily-news-ranking.json';
const CORRELATIONS_PATH = process.env.NEWS_CORRELATIONS || 'editorial/radars/daily-news-correlations.json';
const RELATIONS_PATH = process.env.NEWS_RELATIONS || 'editorial/radars/daily-news-event-relations.json';
const PROVENANCE_PATH = process.env.NEWS_PROVENANCE || 'editorial/radars/daily-news-provenance.json';
const OUT_PATH = process.env.NEWS_INTAKE || 'editorial/radars/daily-news-editorial-intake.json';
const MAX_ITEMS = Math.max(1, Number(process.env.NEWS_INTAKE_MAX || 20));
const DUPLICATE_THRESHOLD = 0.72;
const STOP = new Set('para como desde sobre entre tras este esta estos estas los las una uno unos unas del con por que sus han hacia ante más menos también cuando donde lunes martes miércoles jueves viernes sábado domingo septiembre agosto julio junio 2026'.split(/\s+/));

function readJson(file) { if (!fs.existsSync(file)) return null; return JSON.parse(fs.readFileSync(file, 'utf8')); }
function sha256File(file) { if (!fs.existsSync(file)) return null; return crypto.createHash('sha256').update(fs.readFileSync(file)).digest('hex'); }
function normalize(value = '') { return value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9áéíóúüñ]+/gi, ' ').trim(); }
function tokens(value = '') { return new Set(normalize(value).split(/\s+/).filter((x) => x.length >= 4 && !STOP.has(x))); }
function similarity(a, b) {
  const A = tokens(a), B = tokens(b); if (!A.size || !B.size) return 0;
  let common = 0; for (const token of A) if (B.has(token)) common++;
  return common / Math.min(A.size, B.size);
}
function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/); if (lines[0]?.trim() !== '---') return { data: {}, body: content };
  const closing = lines.findIndex((line, i) => i > 0 && line.trim() === '---'); if (closing < 0) return { data: {}, body: content };
  const data = {}; let active = null;
  for (const line of lines.slice(1, closing)) {
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/); if (m) { const value = m[2].trim().replace(/^['"]|['"]$/g, ''); data[m[1]] = value || []; active = value ? null : m[1]; continue; }
    const list = line.match(/^\s+-\s+(.+)$/); if (list && active) { if (!Array.isArray(data[active])) data[active] = []; data[active].push(list[1].trim().replace(/^['"]|['"]$/g, '')); }
  }
  return { data, body: lines.slice(closing + 1).join('\n') };
}
function collectArticles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectArticles(full));
    else if (entry.isFile() && entry.name.endsWith('.md')) out.push(full);
  }
  return out;
}
const archive = collectArticles(path.join(ROOT, 'content', 'articles')).map((file) => {
  const raw = fs.readFileSync(file, 'utf8'); const { data, body } = parseFrontmatter(raw);
  return { file, relative: path.relative(ROOT, file), data, body };
});
function archiveDuplicates(title, summary = '') {
  const candidate = `${title} ${summary}`;
  return archive.map((article) => {
    const compared = `${article.data.title || ''} ${article.data.description || ''} ${article.body.slice(0, 2500)}`;
    const score = Math.max(similarity(title, article.data.title || ''), similarity(candidate, compared));
    return { ...article, score };
  }).filter((article) => article.score >= DUPLICATE_THRESHOLD).sort((a, b) => b.score - a.score).slice(0, 3);
}
function selected(item) {
  const tier = item?.selection?.tier || '';
  const classification = item?.intelligence?.classification || '';
  if (classification === 'DUPLICATE' || tier.startsWith('PRIORIDAD 4')) return false;
  const duplicates = archiveDuplicates(item.title || item.headline || item.input_reference || '', item.summary || item.description || '');
  return duplicates.length === 0;
}

const ranking = readJson(RANKING_PATH);
if (!ranking || !Array.isArray(ranking.ranking)) { console.error(`✖ No se encontró un ranking válido en ${RANKING_PATH}`); process.exit(1); }
const correlations = readJson(CORRELATIONS_PATH);
const relations = readJson(RELATIONS_PATH);
const provenance = readJson(PROVENANCE_PATH);
const correlationByEvent = new Map((correlations?.correlations || []).map(x => [x.event_id, x]));
const relationsByEvent = new Map();
for (const relation of relations?.relations || []) for (const eventId of [relation.event_id_a, relation.event_id_b]) { if (!relationsByEvent.has(eventId)) relationsByEvent.set(eventId, []); relationsByEvent.get(eventId).push(relation); }
const provenanceByEvent = new Map((provenance?.provenance || []).map(x => [x.event_id, x]));

const allCandidates = ranking.ranking.filter((item) => {
  const tier = item?.selection?.tier || '';
  const classification = item?.intelligence?.classification || '';
  return classification !== 'DUPLICATE' && !tier.startsWith('PRIORIDAD 4');
});
const duplicateFiltered = allCandidates.filter((item) => !selected(item));
const candidates = allCandidates.filter(selected).slice(0, MAX_ITEMS);
const generatedAt = new Date().toISOString();
const executionId = ranking.generated_at ? `RADAR-${ranking.generated_at.replace(/[-:.TZ]/g, '').slice(0, 14)}` : `RADAR-${generatedAt.replace(/[-:.TZ]/g, '').slice(0, 14)}`;

const intake = candidates.map((item, index) => {
  const eventId = item.event_id; const correlation = correlationByEvent.get(eventId); const eventRelations = relationsByEvent.get(eventId) || []; const eventProvenance = provenanceByEvent.get(eventId);
  const intakeId = `INTAKE-${executionId.slice(5)}-${String(index + 1).padStart(3, '0')}`;
  return {
    intake_id: intakeId, created_at: generatedAt, status: 'PENDING_EDITORIAL_REVIEW', rank: item.rank, event_id: eventId,
    correlation_id: item.correlation_id || correlation?.correlation_id || null,
    title: item.title || item.headline || item.input_reference || null,
    summary: item.summary || item.description || null,
    source_ids: item.source_ids || [], source_count: item.source_count ?? 0, independent_source_count: item.independent_source_count ?? 0,
    radar: { tier: item.selection?.tier || null, newsroom_priority: item.scores?.newsroom_priority ?? null, raw_radar_priority: item.scores?.raw_radar_priority ?? null, signal_strength: item.scores?.signal_strength ?? null, emerging_score: item.scores?.emerging_score ?? null, convergence: item.scores?.convergence ?? null, confidence: item.scores?.confidence ?? null, timeliness: item.scores?.timeliness ?? null, rationale: item.selection?.reason || item.intelligence?.rationale || null },
    correlation: correlation ? { classification: correlation.classification || null, investigation_priority: correlation.investigation_priority || null, emerging_score: correlation.emerging_score ?? null, correlation_score: correlation.correlation_score ?? null, confidence: correlation.confidence ?? null, rationale: correlation.rationale || null } : null,
    relations: eventRelations.map(relation => ({ relation_id: relation.relation_id || null, event_id_a: relation.event_id_a || null, event_id_b: relation.event_id_b || null, relation_type: relation.relation_type || null, confidence: relation.confidence ?? null, reason: relation.reason || null })),
    provenance: eventProvenance ? { classification: eventProvenance.classification || null, confidence: eventProvenance.confidence ?? null, observed_source_count: eventProvenance.observed_source_count ?? null, independent_source_count: eventProvenance.independent_source_count ?? null } : null,
    editorial_boundary: { ranking_is_not_truth: true, correlation_is_not_truth: true, provenance_is_inference_not_fact: true, verification_required: true, human_editorial_review_required: true, publishable: false, archive_duplicate_gate: true },
  };
});

const result = {
  engine: 'MALDITOESPEJO_NEWS_EDITORIAL_INTAKE_BRIDGE', version: '1.1.0', generated_at: generatedAt, radar_execution_id: executionId,
  status: 'READY_FOR_EDITORIAL_REVIEW',
  source: { ranking: RANKING_PATH, correlations: CORRELATIONS_PATH, relations: RELATIONS_PATH, provenance: PROVENANCE_PATH, fingerprints: { ranking_sha256: sha256File(RANKING_PATH), correlations_sha256: sha256File(CORRELATIONS_PATH), relations_sha256: sha256File(RELATIONS_PATH), provenance_sha256: sha256File(PROVENANCE_PATH) } },
  policy: { max_items: MAX_ITEMS, creates_cases: false, auto_publishes: false, auto_verifies: false, human_editorial_review_required: true, archive_duplicate_gate: true, duplicate_threshold: DUPLICATE_THRESHOLD, archive_articles_checked: archive.length, duplicate_signals_removed: duplicateFiltered.length },
  intake_count: intake.length, items: intake,
};
fs.mkdirSync(path.dirname(OUT_PATH), { recursive: true });
fs.writeFileSync(OUT_PATH, JSON.stringify(result, null, 2) + '\n', 'utf8');
console.log(`Editorial intake: ${intake.length} signals queued; ${duplicateFiltered.length} archive duplicates removed → ${OUT_PATH}`);
