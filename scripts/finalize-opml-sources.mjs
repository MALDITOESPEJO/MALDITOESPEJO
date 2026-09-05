#!/usr/bin/env node
// Aplica el criterio editorial acordado sobre los CSV generados por
// verify-and-convert-opml.mjs y los fusiona en el registro real de
// MALDITOESPEJO, evitando duplicados.
//
// Criterio aplicado (acordado tras revisar el informe):
//  - Solo entran filas con verification_status = VERIFIED.
//  - En Cartagena, se excluyen las 7 filas genericas que no son
//    contenido local (El Confidencial/Espana, 20 minutos/general,
//    El HuffPost/general, El Periodico/portada, Expansion/portada,
//    La Verdad/portada) -- se quedan solo La Verdad/Murcia y
//    La Verdad/Cartagena.
//  - Se excluye "El Correo" por completo (edicion "Murcia" dudosa,
//    El Correo es un diario vasco; pendiente de confirmar antes de
//    dar de alta nada con su nombre).
//  - No se duplica ningun source_id que ya exista en el registro real.
//
// Uso:
//   node scripts/finalize-opml-sources.mjs opml_todas_200

import fs from "node:fs";
import path from "node:path";

const base = process.argv[2];
if (!base) {
  console.error("Uso: node scripts/finalize-opml-sources.mjs <base-sin-extension-del-opml>");
  process.exit(1);
}

const CARTAGENA_EXCLUDE = new Set([
  "El Confidencial|España",
  "20 minutos|general",
  "El HuffPost|general",
  "El Periódico|portada",
  "Expansión|portada",
  "La Verdad|portada",
]);
const OUTLET_EXCLUDE = new Set(["El Correo"]);

function parseCsv(text) {
  const lines = text.trim().split(/\r?\n/);
  const header = splitCsvLine(lines[0]);
  return lines.slice(1).map((line) => {
    const cells = splitCsvLine(line);
    const row = {};
    header.forEach((h, i) => (row[h] = cells[i] ?? ""));
    return row;
  });
}
function splitCsvLine(line) {
  const out = [];
  let cur = "";
  let inQuotes = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (inQuotes) {
      if (ch === '"' && line[i + 1] === '"') { cur += '"'; i++; }
      else if (ch === '"') inQuotes = false;
      else cur += ch;
    } else {
      if (ch === '"') inQuotes = true;
      else if (ch === ",") { out.push(cur); cur = ""; }
      else cur += ch;
    }
  }
  out.push(cur);
  return out;
}
function csvField(value) {
  const v = String(value ?? "");
  return /[",\n]/.test(v) ? `"${v.replace(/"/g, '""')}"` : v;
}
function toCsvLine(headers, row) {
  return headers.map((h) => csvField(row[h])).join(",");
}

const channelsRaw = fs.readFileSync(`${base}.channels.csv`, "utf8");
const registryRaw = fs.readFileSync(`${base}.registry.csv`, "utf8");
const channelRows = parseCsv(channelsRaw);
const registryRows = parseCsv(registryRaw);

// --- Fuente de la verdad: outlet real por source_id, para poder cruzar
// "El Confidencial|España" contra el channel_name real (no el source_id,
// que es compartido entre secciones).
const outletBySourceId = new Map(registryRows.map((r) => [r.source_id, r.source_name]));

const keptChannels = channelRows.filter((row) => {
  if (row.verification_status !== "VERIFIED") return false;
  const outlet = outletBySourceId.get(row.source_id) || "";
  if (OUTLET_EXCLUDE.has(outlet)) return false;
  const isCartagenaRadar = /\(CARTAGENA\)/i.test(row.radar);
  if (isCartagenaRadar && CARTAGENA_EXCLUDE.has(`${outlet}|${row.channel_name}`)) return false;
  return true;
});

const keptSourceIds = new Set(keptChannels.map((r) => r.source_id));
const keptRegistry = registryRows.filter((row) => keptSourceIds.has(row.source_id) && !OUTLET_EXCLUDE.has(row.source_name));

// --- Deduplicar contra lo que ya exista en el registro real ---
const REGISTRY_PATH = "editorial/sources/MASTER_SOURCE_REGISTRY_NORMALIZED.csv";
const CHANNELS_PATH = "editorial/sources/MASTER_SOURCE_CHANNELS_BATCH_02.csv";

const existingRegistry = fs.readFileSync(REGISTRY_PATH, "utf8");
const existingChannelFiles = ["editorial/sources/MASTER_SOURCE_CHANNELS_BATCH_01.csv", CHANNELS_PATH];
const existingChannelIds = new Set(
  existingChannelFiles.flatMap((f) => parseCsv(fs.readFileSync(f, "utf8")).map((r) => r.channel_id))
);
const existingRegistryIds = new Set(parseCsv(existingRegistry).map((r) => r.source_id));

const registryHeader = registryRaw.trim().split(/\r?\n/)[0].split(",");
const channelHeader = channelsRaw.trim().split(/\r?\n/)[0].split(",");

const newRegistryLines = keptRegistry
  .filter((r) => !existingRegistryIds.has(r.source_id))
  .map((r) => toCsvLine(registryHeader, r));
const newChannelLines = keptChannels
  .filter((r) => !existingChannelIds.has(r.channel_id))
  .map((r) => toCsvLine(channelHeader, r));

if (newRegistryLines.length) {
  fs.appendFileSync(REGISTRY_PATH, "\n" + newRegistryLines.join("\n") + "\n", "utf8");
}
if (newChannelLines.length) {
  fs.appendFileSync(CHANNELS_PATH, "\n" + newChannelLines.join("\n") + "\n", "utf8");
}

console.log(`Candidatos verificados totales: ${channelRows.filter((r) => r.verification_status === "VERIFIED").length}`);
console.log(`Excluidos por criterio editorial (Cartagena generico / El Correo): ${channelRows.filter((r) => r.verification_status === "VERIFIED").length - keptChannels.length}`);
console.log(`Ya existian (no duplicados): ${keptChannels.length - newChannelLines.length}`);
console.log(`Canales nuevos anadidos a ${CHANNELS_PATH}: ${newChannelLines.length}`);
console.log(`Fuentes nuevas anadidas a ${REGISTRY_PATH}: ${newRegistryLines.length}`);
