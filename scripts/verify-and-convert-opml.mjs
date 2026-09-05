#!/usr/bin/env node
// Verifica el contenido REAL (no solo el codigo HTTP) de cada URL de un
// OPML y genera las filas CSV listas para anadir al registro de fuentes
// de MALDITOESPEJO. No se fia de que el OPML diga "status 200": ese dato
// solo demuestra que el servidor respondio, no que la URL sea un feed
// RSS/Atom real (ver el caso BIS-001 detectado hoy: 200 OK mostrando una
// pagina HTML de indice, no XML).
//
// Uso:
//   node scripts/verify-and-convert-opml.mjs ruta/al/archivo.opml
//
// Genera, junto al OPML:
//   <nombre>.channels.csv          -> filas listas para MASTER_SOURCE_CHANNELS
//   <nombre>.registry.csv          -> filas listas para MASTER_SOURCE_REGISTRY_NORMALIZED
//   <nombre>.verification-report.md -> informe legible de que paso con cada URL

import fs from "node:fs";
import path from "node:path";

const inputPath = process.argv[2];
if (!inputPath) {
  console.error("Uso: node scripts/verify-and-convert-opml.mjs ruta/al/archivo.opml");
  process.exit(1);
}
if (!fs.existsSync(inputPath)) {
  console.error(`No existe el archivo: ${inputPath}`);
  process.exit(1);
}

const TIMEOUT_MS = 10000;
const CONCURRENCY = 6;

function slugify(text) {
  return text
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toUpperCase()
    .replace(/[^A-Z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "");
}

// --- Parseo del OPML (formato regular: outline de seccion > outline de feed) ---
const xml = fs.readFileSync(inputPath, "utf8");
const sections = [];
const sectionRe = /<outline text="([^"]*)">([\s\S]*?)<\/outline>/g;
let sectionMatch;
while ((sectionMatch = sectionRe.exec(xml))) {
  const rawSectionName = sectionMatch[1].replace(/^\W+\s*/, "").trim(); // quita el emoji de carpeta
  const body = sectionMatch[2];
  const feeds = [];
  const feedRe = /<outline type="rss" text="([^"]*)" xmlUrl="([^"]*)"\s*\/>/g;
  let feedMatch;
  while ((feedMatch = feedRe.exec(body))) {
    feeds.push({ text: feedMatch[1].trim(), url: feedMatch[2].trim() });
  }
  sections.push({ name: rawSectionName, feeds });
}

const SECTION_TO_SLUG = {
  Actualidad: "actualidad",
  Cartagena: "cartagena",
  Economia: "economia",
  Mundo: "mundo",
  Politica: "politica",
  Sociedad: "sociedad",
  Tecnologia: "tecnologia",
};

// --- Agrupar por medio (una fuente puede tener varios canales/secciones) ---
// "EL PAIS - RSS portada" y "EL PAIS - RSS Economia" son el mismo medio,
// dos canales distintos. Se separa por " - RSS" o " [OFICIAL]" al final.
function parseOutletAndChannel(text) {
  const isOfficial = /\[OFICIAL\]/i.test(text);
  const clean = text.replace(/\[OFICIAL\]/i, "").trim();
  const parts = clean.split(/\s+-\s+RSS\s*/i);
  const outlet = (parts[0] || clean).trim();
  const channelLabel = (parts[1] || "RSS").trim() || "RSS";
  return { outlet, channelLabel, isOfficial };
}

const outlets = new Map(); // outlet name -> { source_id, entries: [{section, channelLabel, url, isOfficial}] }
for (const section of sections) {
  for (const feed of section.feeds) {
    const { outlet, channelLabel, isOfficial } = parseOutletAndChannel(feed.text);
    if (!outlets.has(outlet)) {
      outlets.set(outlet, { source_id: `${slugify(outlet)}-001`, entries: [] });
    }
    outlets.get(outlet).entries.push({
      section: SECTION_TO_SLUG[section.name] || slugify(section.name).toLowerCase(),
      channelLabel,
      url: feed.url,
      isOfficial,
    });
  }
}

// --- Verificacion real: contenido, no solo codigo HTTP ---
function looksLikeFeed(text) {
  const head = text.slice(0, 3000);
  return /<rss[\s>]/i.test(head) || /<feed[\s>]/i.test(head) || /<rdf:RDF/i.test(head);
}

function looksLikeBotWall(text) {
  const head = text.slice(0, 2000).toLowerCase();
  return head.includes("checking your browser") || head.includes("cloudflare") && head.includes("just a moment") || head.includes("attention required");
}

async function verifyUrl(url) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      redirect: "follow",
      signal: controller.signal,
      headers: { "User-Agent": "MALDITOESPEJO-source-verification/1.0 (+https://github.com/MALDITOESPEJO/MALDITOESPEJO)" },
    });
    clearTimeout(timer);
    if (!res.ok) return { status: "HTTP_ERROR", detail: `HTTP ${res.status}`, finalUrl: res.url };
    const text = await res.text();
    if (looksLikeBotWall(text)) return { status: "BOT_WALL", detail: "Pantalla anti-bot, no es el feed real", finalUrl: res.url };
    if (looksLikeFeed(text)) return { status: "VERIFIED_FEED", detail: "XML de RSS/Atom confirmado en el cuerpo", finalUrl: res.url };
    return { status: "NOT_A_FEED", detail: "Respuesta 200 pero sin raiz <rss>/<feed>/<rdf:RDF> -- probablemente HTML", finalUrl: res.url };
  } catch (err) {
    clearTimeout(timer);
    const isAbort = err.name === "AbortError";
    return { status: isAbort ? "TIMEOUT" : "NETWORK_ERROR", detail: String(err.message || err) };
  }
}

async function runWithConcurrency(items, worker, limit) {
  const results = new Array(items.length);
  let index = 0;
  async function next() {
    while (index < items.length) {
      const current = index++;
      results[current] = await worker(items[current], current);
    }
  }
  await Promise.all(Array.from({ length: Math.min(limit, items.length) }, next));
  return results;
}

const allEntries = [];
for (const [outlet, data] of outlets) {
  for (const entry of data.entries) allEntries.push({ outlet, source_id: data.source_id, ...entry });
}

console.log(`Verificando ${allEntries.length} URLs de ${outlets.size} medios (esto tarda; hace peticiones HTTP reales)...`);
const verifications = await runWithConcurrency(allEntries, async (entry) => {
  const result = await verifyUrl(entry.url);
  process.stdout.write(result.status === "VERIFIED_FEED" ? "." : result.status === "NOT_A_FEED" || result.status === "BOT_WALL" ? "x" : "!");
  return { ...entry, ...result };
}, CONCURRENCY);
console.log("");

// --- Generar CSV de canales (solo VERIFIED_FEED entran como RSS reales) ---
const channelRows = ["source_id,channel_id,channel_name,channel_type,endpoint,radar,editorial_function,verification_status,notes"];
const registryRows = ["source_id,source_name,institution,source_type,source_nature,authority_level,editorial_role,radar,channel_type,channel_status,source_verified,channel_verified,endpoint_verified,primary_evidence_available,supports_claims,supports_events,supports_data,limitations"];
const seenSourceIds = new Set();

function csvField(value) {
  const v = String(value ?? "");
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}

for (const v of verifications) {
  const channelId = `${v.source_id}-${slugify(v.channelLabel).slice(0, 20)}`;
  const status = v.status === "VERIFIED_FEED" ? "VERIFIED" : v.status === "NOT_A_FEED" || v.status === "BOT_WALL" ? "REJECTED" : "PENDING_RETRY";
  channelRows.push([
    v.source_id,
    channelId,
    v.channelLabel,
    "RSS",
    v.url,
    `NEWS RADAR (${v.section.toUpperCase()})`,
    "DISCOVERY",
    status,
    csvField(v.detail),
  ].map(csvField).join(","));

  if (!seenSourceIds.has(v.source_id)) {
    seenSourceIds.add(v.source_id);
    registryRows.push([
      v.source_id,
      v.outlet,
      v.outlet,
      v.isOfficial ? "OFFICIAL_MEDIA_OR_INSTITUTION" : "MEDIA",
      "SECONDARY",
      v.isOfficial ? "PRIMARY" : "SECONDARY",
      "DISCOVERY;CROSS_CHECK",
      `NEWS RADAR (${v.section.toUpperCase()})`,
      "RSS",
      "PENDING",
      "PENDING",
      "PENDING",
      status === "VERIFIED" ? "PENDING" : "NO",
      "YES",
      "YES",
      "NO",
      v.isOfficial ? "" : "Medio secundario; trazar afirmaciones importantes a fuente primaria antes de publicar",
    ].map(csvField).join(","));
  }
}

const base = inputPath.replace(/\.opml$/i, "");
fs.writeFileSync(`${base}.channels.csv`, channelRows.join("\n") + "\n", "utf8");
fs.writeFileSync(`${base}.registry.csv`, registryRows.join("\n") + "\n", "utf8");

// --- Informe legible ---
const bySection = {};
for (const v of verifications) {
  bySection[v.section] = bySection[v.section] || [];
  bySection[v.section].push(v);
}
const counts = { VERIFIED_FEED: 0, NOT_A_FEED: 0, BOT_WALL: 0, HTTP_ERROR: 0, TIMEOUT: 0, NETWORK_ERROR: 0 };
for (const v of verifications) counts[v.status] = (counts[v.status] || 0) + 1;

let report = `# Verificacion de fuentes OPML\n\nGenerado: ${new Date().toISOString()}\n\n`;
report += `Total URLs: ${verifications.length}\n\n`;
report += `| Estado | Cantidad | Significado |\n|---|---|---|\n`;
report += `| VERIFIED_FEED | ${counts.VERIFIED_FEED} | XML de RSS/Atom real confirmado |\n`;
report += `| NOT_A_FEED | ${counts.NOT_A_FEED} | 200 OK pero es HTML, no un feed |\n`;
report += `| BOT_WALL | ${counts.BOT_WALL} | Pantalla anti-bot (Cloudflare u otra) |\n`;
report += `| HTTP_ERROR | ${counts.HTTP_ERROR} | Codigo HTTP de error |\n`;
report += `| TIMEOUT | ${counts.TIMEOUT} | Sin respuesta en ${TIMEOUT_MS / 1000}s |\n`;
report += `| NETWORK_ERROR | ${counts.NETWORK_ERROR} | Fallo de red/DNS/TLS |\n\n`;

for (const [section, items] of Object.entries(bySection)) {
  report += `## ${section}\n\n`;
  report += `| Medio | Canal | Estado | Detalle |\n|---|---|---|---|\n`;
  for (const v of items) {
    report += `| ${v.outlet} | ${v.channelLabel} | ${v.status} | ${v.detail} |\n`;
  }
  report += `\n`;
}
fs.writeFileSync(`${base}.verification-report.md`, report, "utf8");

console.log("");
console.log(`Feeds verificados como reales: ${counts.VERIFIED_FEED} / ${verifications.length}`);
console.log(`Archivos generados:`);
console.log(`  ${base}.channels.csv`);
console.log(`  ${base}.registry.csv`);
console.log(`  ${base}.verification-report.md`);
console.log("");
console.log("IMPORTANTE: revisa el informe antes de anadir nada al registro real.");
console.log("Los canales con estado REJECTED o PENDING_RETRY NO deben incorporarse tal cual.");
