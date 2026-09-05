#!/usr/bin/env node

/**
 * MALDITOESPEJO Event Intelligence Layer.
 * Groups duplicate/related candidates into event stories and calculates
 * temporal momentum without treating source count as independence.
 */
import fs from 'node:fs';
import crypto from 'node:crypto';

const input = process.argv[2] || 'editorial/radars/daily-news-candidates.json';
const output = process.argv[3] || 'editorial/radars/daily-news-events.json';
const statePath = 'editorial/radars/.news-event-state.json';
const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const candidates = Array.isArray(data) ? data : (data.candidates || []);
const now = Date.now();
const tokenSet = (text) => new Set(String(text || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9\u00e1\u00e9\u00ed\u00f3\u00fa\u00fc\u00f1]+/gi, ' ').split(/\s+/).filter(w => w.length > 3));
// similarity() recibe conjuntos ya calculados (no el texto crudo) para no
// recomputar tokenSet en cada comparacion O(n^2) -- con cientos de fuentes
// nuevas, recalcular esto por cada par de candidato x cluster se volvia
// medible y, en el peor caso, drasticamente lento.
const similaritySets = (A,B) => { if(!A.size||!B.size)return 0; let n=0; for(const x of A)if(B.has(x))n++; return n/(A.size+B.size-n); };
const geoKey = c => String(c.geography||'').toLowerCase().trim();
const urlHost = u => { try{return new URL(u).hostname.replace(/^www\./,'')}catch{return ''} };
const key = c => `${geoKey(c)}|${c.section_candidate||''}`;
// Maximo seguro sin usar Math.max(...array): con arrays grandes (una
// misma noticia de agencia replicada en muchas fuentes puede acumular
// cientos de valores en un solo cluster), el operador de propagacion
// dentro de Math.max desborda la pila de V8 y tira todo el proceso --
// es exactamente lo que provoco el fallo de hoy. reduce() no tiene ese
// limite, cualquiera que sea el tamano del array.
const safeMax = (arr, fallback = 0) => arr.length ? arr.reduce((a,b) => (b > a ? b : a), -Infinity) : fallback;
const clusters=[];
const tokensByCandidateId = new Map();
const tokensOf = (c) => {
  if (!tokensByCandidateId.has(c.candidate_id)) tokensByCandidateId.set(c.candidate_id, tokenSet(`${c.title} ${c.summary}`));
  return tokensByCandidateId.get(c.candidate_id);
};
for(const c of candidates){
  let best=null, bestScore=0;
  const cTokens = tokensOf(c);
  for(const e of clusters){
    if(key(c)!==key(e.seed) && geoKey(c) && geoKey(e.seed) && geoKey(c)!==geoKey(e.seed)) continue;
    const s=similaritySets(cTokens, tokensOf(e.seed));
    if(s>bestScore){bestScore=s;best=e;}
  }
  if(best && bestScore>=0.42){best.items.push(c);best.similarities.push(bestScore);} else clusters.push({seed:c,items:[c],similarities:[]});
}
let previous={}; if(fs.existsSync(statePath)) previous=JSON.parse(fs.readFileSync(statePath,'utf8'));
const events=clusters.map((g,i)=>{
  const ids=g.items.map(x=>x.candidate_id).sort();
  const eventId='EVT-'+crypto.createHash('sha256').update(ids.join('|')).digest('hex').slice(0,8).toUpperCase();
  const hosts=[...new Set(g.items.map(x=>urlHost(x.url)).filter(Boolean))];
  const sourceIds=[...new Set(g.items.flatMap(x=>x.source_ids||[]))];
  const published=g.items.map(x=>Date.parse(x.ingest?.publication_time||x.first_seen_at)).filter(Number.isFinite).sort((a,b)=>a-b);
  const first=published[0]||now;
  const last=published[published.length-1]||now;
  const ageH=Math.max((now-first)/3600000,1);
  const velocity=Math.min(100,(g.items.length/ageH)*25);
  const spread=Math.min(100,sourceIds.length*20);
  const independence=Math.min(100,new Set(g.items.map(x=>x.ingest?.authority_level||'UNKNOWN')).size*25);
  const acceleration=previous[eventId]?Math.max(0,Math.min(100,(g.items.length-(previous[eventId].count||0))*20)):null;
  const persistence=Math.min(100,Math.max(0,(last-first)/3600000)*10);
  const trend=Number(((velocity*.35)+(spread*.25)+((acceleration??0)*.20)+(persistence*.20)).toFixed(2));
  return {event_id:eventId,title:g.seed.title,summary:g.seed.summary,section_candidate:g.seed.section_candidate,geography:g.seed.geography,candidate_ids:ids,candidate_count:g.items.length,source_ids:sourceIds,source_count:sourceIds.length,independent_source_count:new Set(g.items.map(x=>x.source_ids?.[0]).filter(Boolean)).size,source_hosts:hosts,similarity_max:safeMax(g.similarities,1),signals:{velocity:Number(velocity.toFixed(2)),acceleration:acceleration===null?null:Number(acceleration.toFixed(2)),persistence:Number(persistence.toFixed(2)),cross_source_spread:Number(spread.toFixed(2)),source_independence:Number(independence.toFixed(2)),trend_score:trend},temporal:{first_seen:new Date(first).toISOString(),last_seen:new Date(last).toISOString()}};
});
const state=Object.fromEntries(events.map(e=>[e.event_id,{count:e.candidate_count,last_seen:e.temporal.last_seen}]));
fs.mkdirSync('editorial/radars',{recursive:true});
fs.writeFileSync(output,JSON.stringify({generated_at:new Date().toISOString(),event_count:events.length,events:events.sort((a,b)=>b.signals.trend_score-a.signals.trend_score)},null,2)+'\n');
fs.writeFileSync(statePath,JSON.stringify(state,null,2)+'\n');
console.log(`Clustered ${candidates.length} candidates into ${events.length} events \u2192 ${output}`);
