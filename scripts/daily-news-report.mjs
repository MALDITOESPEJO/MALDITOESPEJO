#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const input = process.argv[2] || 'editorial/radars/daily-news-ranking.json';
const output = process.argv[3] || 'editorial/radars/daily-news-report.md';

if (!fs.existsSync(input)) {
  console.error(`Ranking not found: ${input}`);
  process.exit(1);
}

const data = JSON.parse(fs.readFileSync(input, 'utf8'));
const items = data.ranking || data.candidates || [];

const section = (title, rows) => {
  let text = `## ${title}\n\n`;
  if (!rows.length) return text + '_Sin candidatos suficientes._\n\n';
  rows.forEach((item) => {
    const s = item.scores || {};
    text += `### #${item.rank ?? '-'} — ${item.title || item.event_id}\n`;
    text += `- **Prioridad de investigación:** ${s.newsroom_priority ?? 'N/D'} | **Señal radar:** ${s.signal_strength ?? 'N/D'} | **Señal bruta:** ${s.raw_radar_priority ?? 'N/D'}\n`;
    text += `- **Emergencia:** ${s.emerging_score ?? 'N/D'} | **Convergencia:** ${s.convergence ?? 'N/D'} | **Confianza:** ${s.confidence ?? 'N/D'} | **Independencia aparente:** ${s.source_independence ?? 'N/D'}\n`;
    text += `- **Estado:** ${item.selection?.tier ?? item.status ?? 'N/D'}\n`;
    text += `- **Por qué:** ${item.selection?.reason ?? 'Sin explicación disponible.'}\n\n`;
  });
  return text;
};

const score = key => item => Number.isFinite(item.scores?.[key]) ? item.scores[key] : -1;
const top = [...items].sort((a,b) => score('raw_radar_priority')(b) - score('raw_radar_priority')(a));
const emerging = [...items].sort((a,b) => score('emerging_score')(b) - score('emerging_score')(a));
const blocked = items.filter(x => x.selection?.tier?.includes('DESCARTAR') || x.selection?.tier?.includes('DUPLICADO'));
const highSignalLowConfidence = items.filter(x => score('signal_strength')(x) >= 75 && score('confidence')(x) < 60);
const highIndependence = [...items]
  .filter(x => score('source_independence')(x) >= 50)
  .sort((a,b) => score('source_independence')(b) - score('source_independence')(a));

let report = `# MALDITOESPEJO — DAILY NEWS REPORT\n\n`;
report += `Generado: ${data.generated_at || new Date().toISOString()}\n\n`;
report += `> La señal de radar orienta la investigación. La evidencia y la revisión editorial determinan si una historia puede publicarse.\n\n`;
report += section('TOP INVESTIGATION OPPORTUNITIES', top.slice(0, 20));
report += section('TOP EMERGING EVENTS', emerging.slice(0, 10));
report += section('HIGH SIGNAL / LOW CONFIDENCE', highSignalLowConfidence.slice(0, 10));
report += section('HIGHEST APPARENT SOURCE INDEPENDENCE', highIndependence.slice(0, 10));
report += section('BLOCKED / REQUIRES CAUTION', blocked.slice(0, 10));
report += `## Regla editorial\n\nEste informe recomienda qué investigar. No convierte una tendencia en un hecho ni autoriza por sí mismo la publicación. La publicación continúa por el circuito de evidencia, verificación y aprobación editorial de MALDITOESPEJO.\n`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, report);
console.log(`Daily newsroom report → ${output}`);
