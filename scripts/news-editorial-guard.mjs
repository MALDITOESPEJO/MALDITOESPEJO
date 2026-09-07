#!/usr/bin/env node

/** MALDITOESPEJO — Editorial Guard. */
import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const EFFECTIVE_DATE = "2026-09-07";
const AUTHORS = {
  actualidad: "Iria Valcárcel Montoro",
  politica: "Bruno Salvatierra Ledesma",
  economia: "Nerea Villacorta Beltrán",
  sociedad: "Ariadna Soler Montalbán",
  mundo: "Gael Santacruz Ferrán",
  tecnologia: "Vera Alcántara Robledo",
  cartagena: "Lucía Belmonte Navarro",
};
const STOP = new Set("para como desde sobre entre tras este esta estos estas los las una uno unos unas del con por que sus han hacia ante más menos también cuando donde lunes martes miércoles jueves viernes sábado domingo septiembre agosto julio junio 2026".split(/\s+/));
function arg(name) { const i = process.argv.indexOf(name); return i >= 0 ? process.argv[i + 1] : null; }
function normalize(value = "") { return value.toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9áéíóúüñ]+/gi, " ").trim(); }
function tokens(value = "") { return new Set(normalize(value).split(/\s+/).filter((x) => x.length >= 4 && !STOP.has(x))); }
function similarity(a, b) {
  const A = tokens(a), B = tokens(b); if (!A.size || !B.size) return 0;
  let common = 0; for (const t of A) if (B.has(t)) common++;
  return common / Math.min(A.size, B.size);
}
function collectMarkdownFiles(dir) {
  if (!fs.existsSync(dir)) return [];
  const out = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...collectMarkdownFiles(full));
    else if (entry.isFile() && entry.name.endsWith(".md")) out.push(full);
  }
  return out;
}
function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/); if (lines[0]?.trim() !== "---") return { data: {}, body: content };
  const closing = lines.findIndex((line, i) => i > 0 && line.trim() === "---"); if (closing < 0) return { data: {}, body: content };
  const data = {}; let active = null;
  for (const line of lines.slice(1, closing)) {
    if (!line.trim()) continue;
    const m = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (m) { const value = m[2].trim().replace(/^['"]|['"]$/g, ""); data[m[1]] = value || []; active = value ? null : m[1]; continue; }
    const list = line.match(/^\s+-\s+(.+)$/); if (list && active) { if (!Array.isArray(data[active])) data[active] = []; data[active].push(list[1].trim().replace(/^['"]|['"]$/g, "")); }
  }
  return { data, body: lines.slice(closing + 1).join("\n") };
}
function sourceUrls(data, body) {
  const urls = [];
  if (Array.isArray(data.sources)) urls.push(...data.sources.filter((x) => /^https?:\/\//i.test(x)));
  const section = body.match(/(?:^|\n)##\s+Fuentes\s*\n([\s\S]*?)(?=\n##\s+|$)/i);
  if (section) urls.push(...(section[1].match(/https?:\/\/[^\s)]+/gi) || []));
  return [...new Set(urls)];
}
function articleRecords() {
  return collectMarkdownFiles(ARTICLES_DIR).map((file) => { const raw = fs.readFileSync(file, "utf8"); const { data, body } = parseFrontmatter(raw); return { file, relative: path.relative(ROOT, file), data, body }; });
}
function duplicateMatches(title, summary, excludeFile = null) {
  const candidate = `${title} ${summary || ""}`;
  return articleRecords().filter((r) => !excludeFile || path.resolve(r.file) !== path.resolve(excludeFile)).map((r) => {
    const compared = `${r.data.title || ""} ${r.data.description || ""} ${r.body.slice(0, 2500)}`;
    return { ...r, score: Math.max(similarity(title, r.data.title || ""), similarity(candidate, compared)) };
  }).filter((r) => r.score >= 0.72).sort((a, b) => b.score - a.score).slice(0, 5);
}
function validateArticle(file) {
  const raw = fs.readFileSync(file, "utf8"); const { data, body } = parseFrontmatter(raw); const errors = []; const warnings = [];
  const section = normalize(data.section || ""); const expected = AUTHORS[section]; const effective = data.date && data.date >= EFFECTIVE_DATE;
  if (effective && expected && data.author?.normalize("NFC") !== expected.normalize("NFC")) errors.push(`autoría incorrecta: ${section} exige '${expected}'`);
  if (effective && ["approved", "published", "verified"].includes(data.status)) {
    if (!sourceUrls(data, body).length) errors.push("faltan fuentes visibles: añade 'sources' y un apartado '## Fuentes' con URLs");
    if (data.editorial_originality !== "original") errors.push("falta editorial_originality: original");
    if (!/Europe\/Madrid|peninsular|h\b/i.test(raw)) warnings.push("no se detecta una marca explícita de horario Europe/Madrid/peninsular; comprobar hora editorial");
    if (!/\*\*[^*]+\s·\s\d{1,2}\s+de\s+[a-záéíóú]+\s+de\s+\d{4}\s·\s\d{2}:\d{2}\s+h\*\*/i.test(body)) warnings.push("no se detecta la línea final estándar de autoría/fecha/hora");
  }
  return { errors, warnings };
}
function candidateMode() {
  const title = arg("--title"); const summary = arg("--summary") || "";
  if (!title) { console.error("Uso: --candidate --title \"Titular\" [--summary \"Resumen\"]"); process.exit(2); }
  const matches = duplicateMatches(title, summary); console.log("MALDITOESPEJO — DUPLICATE INTAKE GUARD"); console.log(`Candidato: ${title}`);
  if (!matches.length) { console.log("✓ Sin coincidencias fuertes en el archivo de artículos."); return; }
  console.log("✖ Candidato bloqueado: posible duplicado/actualización del mismo hecho.");
  for (const m of matches) console.log(`  - ${m.relative} (${Math.round(m.score * 100)}%): ${m.data.title || "sin título"}`);
  process.exitCode = 1;
}
if (process.argv.includes("--candidate")) candidateMode();
else {
  const fileArg = arg("--article"); if (!fileArg) { console.error("Uso: --article content/articles/archivo.md"); process.exit(2); }
  const file = path.resolve(ROOT, fileArg); if (!fs.existsSync(file)) { console.error(`✖ No existe: ${fileArg}`); process.exit(2); }
  const { errors, warnings } = validateArticle(file); console.log("MALDITOESPEJO — EDITORIAL GUARD"); console.log(`Artículo: ${fileArg}`);
  for (const warning of warnings) console.warn(`! ${warning}`);
  for (const error of errors) console.error(`✖ ${error}`);
  if (errors.length) process.exit(1); console.log("✓ Guard editorial superado.");
}
