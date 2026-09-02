#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const CASES_DIR = path.join(ROOT, "editorial", "cases");
const ARTICLES_DIR = path.join(ROOT, "content", "articles");

function arg(name) {
  const i = process.argv.indexOf(name);
  return i >= 0 ? process.argv[i + 1] : null;
}

const caseId = arg("--case");
if (!caseId) {
  console.error("Uso: npm run article:original -- --case CASE-########");
  process.exit(1);
}

const casePath = path.join(CASES_DIR, `${caseId}.json`);
if (!fs.existsSync(casePath)) {
  console.error(`✖ No existe el caso: ${caseId}`);
  process.exit(1);
}

const record = JSON.parse(fs.readFileSync(casePath, "utf8"));
const claims = Array.isArray(record.claims) ? record.claims : [];
const assessments = new Map((record.verification?.claims ?? []).map((item) => [item.claim_id, item]));
const verifiedIds = new Set(record.publishable_scope?.claim_ids ?? []);
const verified = claims.filter((claim) => verifiedIds.has(claim.claim_id) && assessments.get(claim.claim_id)?.status === "VERIFIED");

if (!verified.length) {
  console.error("✖ No existe un alcance factual verificado para redactar.");
  process.exit(2);
}

const section = record.editorial_section ?? record.section ?? "Actualidad";
const author = record.assigned_author ?? record.author ?? "";
const date = record.created_at ?? new Date().toISOString().slice(0, 10);
const central = verified.find((claim) => claim.importance === "CENTRAL") ?? verified[0];
const facts = verified.filter((claim) => claim.type === "FACT" && claim.claim_id !== central.claim_id);
const statements = verified.filter((claim) => claim.type === "STATEMENT");
const context = verified.filter((claim) => claim.type === "CONTEXT");
const excluded = claims.filter((claim) => !verifiedIds.has(claim.claim_id));

const title = central.claim;
const description = central.claim.slice(0, 160);
const body = [];
body.push("## Hechos\n");
body.push(central.claim + "\n");
for (const claim of facts) body.push(claim.claim + "\n");
if (statements.length) {
  body.push("## Declaraciones\n");
  for (const claim of statements) body.push(claim.claim + "\n");
}
if (context.length) {
  body.push("## Contexto\n");
  for (const claim of context) body.push(claim.claim + "\n");
}
if (excluded.length) {
  body.push("## Lo que no se sabe\n");
  body.push("La investigación continúa sobre algunos aspectos de esta historia que todavía no han podido verificarse.\n");
}
body.push("## Fuentes\n");
for (const source of (record.sources ?? []).filter((item) => item.role !== "DISCOVERY")) {
  body.push(`- ${source.description ?? source.source_id ?? "Fuente registrada"}`);
}

const slug = record.draft?.article_path?.replace(/^content\/articles\//, "").replace(/\.md$/, "") ?? caseId.toLowerCase();
const articlePath = path.join(ARTICLES_DIR, `${slug}.md`);
fs.mkdirSync(ARTICLES_DIR, { recursive: true });

const frontmatter = [
  "---",
  `id: \"${caseId.toLowerCase()}\"`,
  `title: \"${title.replaceAll('"', '\\"')}\"`,
  `description: \"${description.replaceAll('"', '\\"')}\"`,
  `date: \"${date}\"`,
  `section: \"${section}\"`,
  `author: \"${author.replaceAll('"', '\\"')}\"`,
  'type: "news"',
  'status: "review"',
  `case_id: \"${caseId}\"`,
  `verified_claims: [${verified.map((claim) => `\"${claim.claim_id}\"`).join(", ")}]`,
  "---",
  "",
].join("\n");

fs.writeFileSync(articlePath, frontmatter + body.join("\n"), "utf8");

record.draft = {
  ...(record.draft ?? {}),
  article_path: path.relative(ROOT, articlePath).replaceAll(path.sep, "/"),
  status: "DRAFT_GENERATED",
  generated_at: new Date().toISOString(),
  source_of_generation: "VERIFIED_CLAIM_SCOPE",
};
record.workflow = { ...(record.workflow ?? {}), draft: "DRAFT_GENERATED" };
record.status = "EDITOR_REVIEW";
record.publication = {
  allowed: false,
  reason: "El borrador contiene exclusivamente claims verificados, pero requiere controles finales y aprobación editorial humana.",
};
fs.writeFileSync(casePath, `${JSON.stringify(record, null, 2)}\n`, "utf8");

console.log("MALDITOESPEJO — ORIGINAL ARTICLE ENGINE");
console.log(`Caso: ${caseId}`);
console.log(`Borrador: ${path.relative(ROOT, articlePath)}`);
console.log(`Claims verificados utilizados: ${verified.length}`);
console.log("Estado: DRAFT_GENERATED");
console.log("Publicación: BLOQUEADA HASTA APROBACIÓN");
