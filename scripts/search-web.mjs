#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
if (!caseId) {
  console.error("Uso: npm run web:search -- --case CASE-########");
  process.exit(1);
}

const apiKey = process.env.BRAVE_SEARCH_API_KEY;
if (!apiKey) {
  console.error("✖ Falta BRAVE_SEARCH_API_KEY. No se realiza ninguna búsqueda.");
  process.exit(1);
}

const file = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(file)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(file, "utf8"));
const queries = record.web_research?.queries ?? [];
if (!queries.length) {
  console.error("✖ No existen consultas. Ejecuta primero research:plan y web:research.");
  process.exit(1);
}

const results = [];
for (const item of queries) {
  const url = new URL("https://api.search.brave.com/res/v1/web/search");
  url.searchParams.set("q", item.query);
  url.searchParams.set("count", "10");
  url.searchParams.set("search_lang", "es");

  const response = await fetch(url, {
    headers: {
      Accept: "application/json",
      "X-Subscription-Token": apiKey,
    },
  });

  if (!response.ok) {
    console.error(`✖ Brave Search respondió ${response.status} para: ${item.query}`);
    process.exit(1);
  }

  const payload = await response.json();
  for (const result of payload.web?.results ?? []) {
    results.push({
      claim_id: item.claim_id,
      query: item.query,
      provider: "brave",
      retrieved_at: new Date().toISOString(),
      title: result.title ?? null,
      url: result.url ?? null,
      snippet: result.description ?? result.snippet ?? null,
      publisher: result.profile?.long_name ?? result.profile?.short_name ?? null,
      source_name: result.profile?.long_name ?? result.profile?.short_name ?? result.url ?? null,
      published_at: result.age ?? null,
      document_or_record: result.title ?? null,
      result_type: "web",
      provider_rank: results.length + 1,
      provider_score: null,
      status: "CANDIDATE",
      evidence_accepted: false,
    });
  }
}

const output = {
  case_id: caseId,
  provider: "brave",
  searched_at: new Date().toISOString(),
  results,
  note: "Resultados recuperados por búsqueda web. Son candidatos y no constituyen evidencia verificada hasta su evaluación explícita.",
};

const outFile = path.join(CASES_DIR, `${caseId}.web-results.json`);
fs.writeFileSync(outFile, `${JSON.stringify(output, null, 2)}\n`, "utf8");

record.web_research = record.web_research ?? {};
record.web_research.provider = "brave";
record.web_research.status = "RESULTS_RETRIEVED";
record.web_research.results_file = path.relative(ROOT, outFile).replaceAll(path.sep, "/");
record.web_research.result_count = results.length;
record.web_research.evidence_imported = 0;
record.workflow = record.workflow ?? {};
record.workflow.sources = "WEB_RESULTS_RETRIEVED";
record.workflow.evidence = "CANDIDATES_AWAITING_EVALUATION";

fs.writeFileSync(file, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — WEB SEARCH");
console.log(`✓ Caso: ${caseId}`);
console.log("✓ Proveedor: Brave Search");
console.log(`✓ Resultados recuperados: ${results.length}`);
console.log(`✓ Archivo: ${path.relative(ROOT, outFile)}`);
console.log("⚠ Ningún resultado ha sido convertido automáticamente en evidencia.");
