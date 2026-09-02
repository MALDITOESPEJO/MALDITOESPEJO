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
  console.error("Uso: npm run evidence:retrieve -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
const recordPath = casePath;
if (!fs.existsSync(recordPath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(recordPath, "utf8"));
const results = Array.isArray(record.web_results) ? record.web_results : [];
if (!results.length) {
  console.error("✖ No existen resultados web importados para recuperar.");
  process.exit(2);
}

const claims = new Map((record.claims ?? []).map((claim) => [claim.claim_id, claim]));
const candidates = [];
const failed = [];

function cleanHtml(html) {
  return html
    .replace(/<script[\s\S]*?<\/script>/gi, " ")
    .replace(/<style[\s\S]*?<\/style>/gi, " ")
    .replace(/<noscript[\s\S]*?<\/noscript>/gi, " ")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/gi, " ")
    .replace(/&amp;/gi, "&")
    .replace(/&quot;/gi, '"')
    .replace(/&#39;/gi, "'")
    .replace(/\s+/g, " ")
    .trim();
}

function termsFor(text) {
  return text.toLowerCase().split(/[^a-záéíóúüñ0-9]+/i).filter((term) => term.length >= 4).slice(0, 12);
}

for (const result of results) {
  if (!result.url || !/^https?:\/\//i.test(result.url)) {
    failed.push({ result, reason: "URL no recuperable" });
    continue;
  }

  const claim = claims.get(result.claim_id);
  if (!claim) {
    failed.push({ result, reason: "claim_id inexistente" });
    continue;
  }

  try {
    const response = await fetch(result.url, {
      redirect: "follow",
      headers: { "User-Agent": "MALDITOESPEJO-EvidenceBot/1.0" },
      signal: AbortSignal.timeout(15000),
    });
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const contentType = response.headers.get("content-type") ?? "";
    if (!contentType.includes("text/html") && !contentType.includes("text/plain")) {
      throw new Error(`Tipo no textual: ${contentType || "desconocido"}`);
    }

    const raw = await response.text();
    const text = cleanHtml(raw).slice(0, 30000);
    const terms = termsFor(claim.claim);
    const matchedTerms = terms.filter((term) => text.toLowerCase().includes(term));

    candidates.push({
      claim_id: claim.claim_id,
      source_id: result.source_id ?? "SRC-UNRESOLVED",
      url_or_reference: response.url || result.url,
      document_or_record: result.document_or_record ?? result.title,
      source_role: result.source_role ?? "CONTEXT",
      published_at: result.published_at ?? null,
      observed_at: new Date().toISOString(),
      relevant_excerpt_or_data: text.slice(0, 4000),
      lineage_id: result.lineage_id ?? "LIN-UNKNOWN",
      independence_group: result.independence_group ?? "IG-UNKNOWN",
      relationship_type: result.relationship_type ?? "UNKNOWN_PROVENANCE",
      assessment: "UNASSESSED",
      retrieval: {
        http_status: response.status,
        content_type: contentType,
        final_url: response.url,
        matched_claim_terms: matchedTerms,
        match_ratio: terms.length ? matchedTerms.length / terms.length : 0,
      }
    });
  } catch (error) {
    failed.push({ result, reason: error.message });
  }
}

const output = {
  case_id: caseId,
  retrieved_at: new Date().toISOString(),
  candidates,
  failed,
  note: "El contenido fue recuperado automáticamente. Los candidatos permanecen UNASSESSED hasta su evaluación; la recuperación no demuestra por sí sola el claim."
};

const outputPath = path.join(CASES_DIR, `${caseId}.evidence-candidates.json`);
fs.writeFileSync(outputPath, `${JSON.stringify(output, null, 2)}\n`, "utf8");

record.evidence_retrieval = {
  retrieved_at: output.retrieved_at,
  candidates: candidates.length,
  failed: failed.length,
  output_file: path.relative(ROOT, outputPath).replaceAll(path.sep, "/"),
  status: candidates.length ? "CANDIDATES_RETRIEVED" : "NO_CANDIDATES_RETRIEVED"
};
record.workflow = record.workflow ?? {};
record.workflow.evidence = candidates.length ? "DOCUMENTS_RETRIEVED_AWAITING_ASSESSMENT" : "DOCUMENTARY_RETRIEVAL_FAILED";
record.publication = { ...(record.publication ?? {}), allowed: false, reason: "La recuperación documental automática no equivale a aceptación ni verificación." };
fs.writeFileSync(recordPath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — DOCUMENTARY EVIDENCE RETRIEVAL");
console.log(`✓ Caso: ${caseId}`);
console.log(`✓ Documentos recuperados: ${candidates.length}`);
console.log(`⚠ Recuperaciones fallidas: ${failed.length}`);
console.log("⚠ Los candidatos permanecen UNASSESSED hasta evaluación.");
console.log(`✓ Archivo: ${path.relative(ROOT, outputPath)}`);
