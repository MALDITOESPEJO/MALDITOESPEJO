#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";
import { spawnSync } from "node:child_process";

const ROOT = process.cwd();
function getArg(name) { const index = process.argv.indexOf(name); return index >= 0 ? process.argv[index + 1] : null; }
function usage() { console.log(`MALDITOESPEJO — AUTOMATED NEWS PIPELINE\n\nUso:\n  npm run pipeline -- --title "Título de la noticia"\n  npm run pipeline -- --input ruta/al/archivo.txt\n  npm run pipeline -- --json ruta/al/entrada.json\n\nEl pipeline investiga, recupera candidatos documentales, resuelve y clasifica fuentes, prepara evidencia para evaluación explícita y controla su trazabilidad antes de redactar.`); }
if (process.argv.includes("--help") || process.argv.includes("-h")) { usage(); process.exit(0); }
const title = getArg("--title"); const inputPath = getArg("--input"); const jsonPath = getArg("--json");
if (!title && !inputPath && !jsonPath) { usage(); process.exit(1); }
function run(script, args, options = {}) {
  console.log(`\n▶ ${script} ${args.join(" ")}`);
  const result = spawnSync(process.execPath, [path.join(ROOT, "scripts", script), ...args], { cwd: ROOT, stdio: "inherit" });
  if (result.status !== 0) { if (options.allowFailure) { console.log(`\n⚠ ${script} no pudo completarse; el caso queda detenido para intervención.`); return false; } console.log(`\n⚠ El pipeline se detiene en ${script}.`); process.exitCode = result.status ?? 1; return false; }
  return true;
}
let investigateArgs; if (title) investigateArgs = ["--title", title]; else if (inputPath) investigateArgs = ["--input", inputPath]; else investigateArgs = ["--json", jsonPath];
if (!run("investigate.mjs", investigateArgs)) process.exit(process.exitCode ?? 1);
const casesDir = path.join(ROOT, "editorial", "cases");
const caseFiles = fs.readdirSync(casesDir).filter((name) => /^CASE-\d{8}\.json$/.test(name));
if (!caseFiles.length) { console.error("✖ No se pudo localizar el caso creado."); process.exit(1); }
const latest = caseFiles.map((name) => ({ name, mtime: fs.statSync(path.join(casesDir, name)).mtimeMs })).sort((a, b) => b.mtime - a.mtime)[0].name;
const caseId = path.basename(latest, ".json");
const stages = [["claims.mjs", ["--case", caseId]], ["research-plan.mjs", ["--case", caseId]], ["web-research.mjs", ["--case", caseId]]];
for (const [script, args] of stages) { if (!run(script, args)) process.exit(process.exitCode ?? 1); }
const webSearchOk = run("search-web.mjs", ["--case", caseId], { allowFailure: true });
if (webSearchOk) {
  const resultsPath = path.join(casesDir, `${caseId}.web-results.json`);
  if (!fs.existsSync(resultsPath)) console.error("✖ La búsqueda terminó sin generar resultados documentales.");
  else run("import-web-results.mjs", ["--input", path.relative(ROOT, resultsPath).replaceAll(path.sep, "/")], { allowFailure: true });
}
const postRetrievalStages = [
  ["resolve-source.mjs", ["--case", caseId]],
  ["source-authority.mjs", ["--case", caseId]],
  ["retrieve-evidence.mjs", ["--case", caseId]],
  ["prepare-evidence-candidates.mjs", ["--case", caseId]],
  ["check-provenance.mjs", ["--case", caseId]],
  ["contrast.mjs", ["--case", caseId]],
  ["resolve-contradictions.mjs", ["--case", caseId]],
  ["evidence-sufficiency.mjs", ["--case", caseId]],
  ["evidence-coverage.mjs", ["--case", caseId]],
  ["enforce-source-independence.mjs", ["--case", caseId]],
  ["temporal-verify.mjs", ["--case", caseId]],
  ["verify.mjs", ["--case", caseId]],
  ["scope.mjs", ["--case", caseId]],
  ["original-article.mjs", ["--case", caseId]],
  ["article-scope-guard.mjs", ["--case", caseId]],
  ["language-guard.mjs", ["--case", caseId]],
  ["check-originality.mjs", ["--case", caseId]],
];
for (const [script, args] of postRetrievalStages) {
  if (!run(script, args, { allowFailure: true })) break;
}
console.log("\nMALDITOESPEJO — PIPELINE FINALIZADO");
console.log(`Caso: ${caseId}`);
console.log("Secuencia: investigación → claims → plan → recuperación web → importación → resolución → autoridad → recuperación documental → preparación de evidencia → procedencia → contraste → resolución de conflictos → suficiencia → cobertura → independencia → temporalidad → verificación → alcance → redacción → controles → originalidad.");
console.log("Importante: preparar candidatos no equivale a aceptarlos. La evidencia solo entra como evidencia aceptada mediante evaluación documental explícita.");
console.log("Las reproducciones del mismo origen no se contabilizan como corroboraciones independientes.");
console.log("La automatización nunca concede aprobación editorial ni publica por sí sola.");
console.log("Siguiente etapa: evaluación/aceptación documental, revisión humana y Publication Gate.");
