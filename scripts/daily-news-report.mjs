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
    text += `### #${item.rank ?? '-'} — ${item.title}\n`;
    text += `- **Prioridad:** ${s.newsroom_priority ?? 'N/D'}\n`;
    text += `- **Viralidad:** ${s.virality ?? 'N/D'} | **Editorial:** ${s.editorial ?? 'N/D'} | **Riesgo:** ${s.risk ?? 'N/D'}\n`;
    text += `- **Estado:** ${item.selection?.tier ?? item.status ?? 'N/D'}\n`;
    text += `- **Por qué:** ${item.selection?.reason ?? 'Sin explicación disponible.'}\n\n`;
  });
  return text;
};

const top = [...items].sort((a,b) => (b.scores?.newsroom_priority ?? -1) - (a.scores?.newsroom_priority ?? -1));
const emerging = [...items].filter(x => (x.scores?.virality ?? -1) >= 70).sort((a,b) => (b.scores?.virality ?? -1) - (a.scores?.virality ?? -1));
const blocked = items.filter(x => x.status === 'BLOCKED' || x.selection?.tier?.includes('DESCARTAR'));
const highViralLowEditorial = items.filter(x => (x.scores?.virality ?? -1) >= 75 && (x.scores?.editorial ?? 101) < 55);
const highEditorialLowViral = items.filter(x => (x.scores?.editorial ?? -1) >= 75 && (x.scores?.virality ?? 101) < 55);

let report = `# MALDITOESPEJO — DAILY NEWS REPORT\n\n`;
report += `Generado: ${data.generated_at || new Date().toISOString()}\n\n`;
report += `> La viralidad detecta interés. La evidencia determina si podemos publicarlo.\n\n`;
report += section('TOP PUBLICATION OPPORTUNITIES', top.slice(0, 20));
report += section('TOP EMERGING TRENDS', emerging.slice(0, 10));
report += section('HIGH VIRALITY / LOW EDITORIAL VALUE', highViralLowEditorial.slice(0, 10));
report += section('HIGH EDITORIAL VALUE / LOW VIRALITY', highEditorialLowViral.slice(0, 10));
report += section('BLOCKED / REQUIRES CAUTION', blocked.slice(0, 10));
report += `## Regla editorial\n\nEste informe recomienda qué investigar. No convierte una tendencia en un hecho ni autoriza por sí mismo la publicación. La publicación continúa por el circuito de evidencia, verificación y aprobación editorial de MALDITOESPEJO.\n`;

fs.mkdirSync(path.dirname(output), { recursive: true });
fs.writeFileSync(output, report);
console.log(`Daily newsroom report → ${output}`);
