#!/usr/bin/env node

/**
 * MALDITOESPEJO event-relation layer.
 *
 * Consolidation answers: "Is this the same underlying event?"
 * This layer answers: "If not, how do nearby events relate?"
 *
 * It NEVER merges events. It emits conservative pair-level relations for
 * editorial review: RELATED_EVENT, PARALLEL_SIGNAL, or SAME_EVENT_BOUNDARY.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';

const input = process.argv[2] || 'editorial/radars/daily-news-events.json';
const output = process.argv[3] || 'editorial/radars/daily-news-event-relations.json';
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const events = Array.isArray(data) ? data : (data.events || []);

const STOP = new Set([
  'para','como','desde','entre','sobre','tras','ante','esta','este','estos','estas',
  'una','uno','unos','unas','del','las','los','por','con','sin','sus','que','han',
  'hay','mas','menos','segun','tambien','ahora','hoy','ayer','todos','todas',
  'cada','donde','cuando','quien','quienes','aquel','aquella','esto','eso'
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
const firstSeen = e => Date.parse(e.temporal?.first_seen || e.temporal?.last_seen || '');
const withinWindow = (a, b) => {
  const ta = firstSeen(a); const tb = firstSeen(b);
  if (!Number.isFinite(ta) || !Number.isFinite(tb)) return true;
  return Math.abs(ta - tb) <= 48 * 3600000;
};

const reps = new Map(events.map(e => [e.event_id, {
  title: tokens(e.title),
  full: tokens(`${e.title || ''} ${e.summary || ''}`),
  raw: normalize(`${e.title || ''} ${e.summary || ''}`),
}]));

const relationFor = (a, b) => {
  const ar = reps.get(a.event_id); const br = reps.get(b.event_id);
  const titleSimilarity = jaccard(ar.title, br.title);
  const fullSimilarity = jaccard(ar.full, br.full);
  const sameGeo = Boolean(geo(a) && geo(b) && geo(a) === geo(b));
  const sameSection = Boolean(section(a) && section(b) && section(a) === section(b));
  const aNumbers = numbers(`${a.title || ''} ${a.summary || ''}`);
  const bNumbers = numbers(`${b.title || ''} ${b.summary || ''}`);
  const conflictingNumbers = aNumbers.size && bNumbers.size &&
    [...aNumbers].some(n => !bNumbers.has(n)) && [...bNumbers].some(n => !aNumbers.has(n));
  const evolvingMarker = /\bnuevo\b|\botro\b|\bsegunda\b|\btercer[oa]?\b|\bposterior\b|\bdespues\b/.test(ar.raw) ||
    /\bnuevo\b|\botro\b|\bsegunda\b|\btercer[oa]?\b|\bposterior\b|\bdespues\b/.test(br.raw);

  if (titleSimilarity >= 0.78 && !conflictingNumbers && !evolvingMarker) {
    return { classification: 'SAME_EVENT_BOUNDARY', confidence: 'HIGH', reason: 'La relación es tan próxima que debería haberse resuelto en consolidación; se marca como límite de control y no se fusiona aquí.' };
  }

  const contextualOverlap = (sameGeo && titleSimilarity >= 0.22) ||
    (sameSection && titleSimilarity >= 0.30) ||
    (fullSimilarity >= 0.42 && (sameGeo || sameSection));

  if (contextualOverlap || evolvingMarker || conflictingNumbers) {
    return {
      classification: 'RELATED_EVENT',
      confidence: titleSimilarity >= 0.45 ? 'HIGH' : 'MEDIUM',
      reason: conflictingNumbers
        ? 'Comparte contexto pero contiene cifras incompatibles; se mantiene separado.'
        : evolvingMarker
          ? 'La redacción indica posible evolución o episodio posterior; no se consolida automáticamente.'
          : 'Comparte contexto temporal, geográfico o temático con otro evento, pero no hay evidencia suficiente de identidad.'
    };
  }

  if ((sameGeo || sameSection) && titleSimilarity < 0.22) {
    return {
      classification: 'PARALLEL_SIGNAL',
      confidence: 'MEDIUM',
      reason: 'Eventos próximos con contexto compartido pero baja similitud de contenido; pueden formar una señal narrativa sin ser el mismo hecho.'
    };
  }

  return null;
};

const blocks = new Map();
for (const event of events) {
  const key = `${geo(event) || '*'}|${section(event) || '*'}`;
  if (!blocks.has(key)) blocks.set(key, []);
  blocks.get(key).push(event);
}

const relations = [];
const seen = new Set();
for (const block of blocks.values()) {
  for (let i = 0; i < block.length; i++) {
    for (let j = i + 1; j < block.length; j++) {
      const a = block[i]; const b = block[j];
      if (a.event_id === b.event_id || !withinWindow(a, b)) continue;
      const key = [a.event_id, b.event_id].sort().join('|');
      if (seen.has(key)) continue;
      seen.add(key);
      const relation = relationFor(a, b);
      if (!relation) continue;
      const ar = reps.get(a.event_id); const br = reps.get(b.event_id);
      relations.push({
        relation_id: 'REL-' + crypto.createHash('sha256').update(key).digest('hex').slice(0, 8).toUpperCase(),
        event_a: a.event_id,
        event_b: b.event_id,
        title_a: a.title,
        title_b: b.title,
        title_similarity: Number(jaccard(ar.title, br.title).toFixed(3)),
        full_similarity: Number(jaccard(ar.full, br.full).toFixed(3)),
        same_geography: Boolean(geo(a) && geo(b) && geo(a) === geo(b)),
        same_section: Boolean(section(a) && section(b) && section(a) === section(b)),
        ...relation,
        editorial_action: relation.classification === 'SAME_EVENT_BOUNDARY'
          ? 'VERIFY_CONSOLIDATION_CONTEXT'
          : relation.classification === 'RELATED_EVENT'
            ? 'KEEP_SEPARATE_REVIEW_RELATION'
            : 'KEEP_SEPARATE_PARALLEL_SIGNAL'
      });
    }
  }
}

relations.sort((a, b) => {
  const rank = { SAME_EVENT_BOUNDARY: 3, RELATED_EVENT: 2, PARALLEL_SIGNAL: 1 };
  return (rank[b.classification] - rank[a.classification]) || (b.title_similarity - a.title_similarity);
});

const counts = relations.reduce((acc, r) => {
  acc[r.classification] = (acc[r.classification] || 0) + 1;
  return acc;
}, {});

fs.mkdirSync('editorial/radars', { recursive: true });
fs.writeFileSync(output, JSON.stringify({
  generated_at: new Date().toISOString(),
  engine: 'MALDITOESPEJO_EVENT_RELATION_ANALYSIS',
  version: '1.0.0',
  input_event_count: events.length,
  relation_count: relations.length,
  classification_policy: {
    SAME_EVENT_BOUNDARY: 'No consolida. Señala una pareja que debería ser revisada contra la capa de consolidación.',
    RELATED_EVENT: 'Eventos distintos dentro de una misma historia, secuencia o contexto; permanecen separados.',
    PARALLEL_SIGNAL: 'Eventos independientes con contexto compartido que pueden formar una señal; permanecen separados.'
  },
  counts,
  relations
}, null, 2) + '\n');
console.log(`Analyzed relations among ${events.length} events → ${relations.length} relations → ${output}`);
