import fs from "node:fs";
import path from "node:path";
import { execFileSync } from "node:child_process";

const ROOT = process.cwd();
const INVENTORY = path.join(ROOT, "editorial", "migration", "LEGACY_ARTICLE_INVENTORY.json");
const CERT_DIR = path.join(ROOT, "editorial", "migration", "certifications");

// Legacy migration readiness is relevant to changes that can affect the article
// publication surface. An unrelated PR (for example, SEO/Search Console
// verification) must not be blocked by pre-existing legacy migration debt.
// On main pushes we always enforce the gate.
function pullRequestChangesArticles() {
  if (process.env.GITHUB_EVENT_NAME !== "pull_request") return true;
  const baseSha = process.env.GITHUB_BASE_SHA;
  if (!baseSha) return true;
  try {
    const changed = execFileSync("git", ["diff", "--name-only", `${baseSha}...HEAD`], {
      cwd: ROOT,
      encoding: "utf8",
    });
    return changed
      .split(/\r?\n/)
      .some((file) => /^content\/articles\/.*\.md$/i.test(file.trim()));
  } catch {
    // Fail closed if the PR range cannot be inspected.
    return true;
  }
}

if (!pullRequestChangesArticles()) {
  console.log("LEGACY GATE READINESS: NOT APPLICABLE — el PR no modifica artículos.");
  process.exit(0);
}

if (!fs.existsSync(INVENTORY)) {
  console.error("LEGACY GATE: BLOQUEADO — falta el inventario legacy.");
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY, "utf8"));
const articles = Array.isArray(inventory.articles) ? inventory.articles : [];
const blocking = [];
const ready = [];

for (const article of articles) {
  const file = article.file;
  const certPath = path.join(CERT_DIR, file.replace(/\.md$/i, ".json"));
  if (!fs.existsSync(certPath)) {
    blocking.push({ file, reason: "MISSING_CERTIFICATION" });
    continue;
  }
  let cert;
  try {
    cert = JSON.parse(fs.readFileSync(certPath, "utf8"));
  } catch {
    blocking.push({ file, reason: "INVALID_CERTIFICATION_JSON" });
    continue;
  }
  const status = cert.migration_status;
  const decision = cert.decision;
  if (status === "CERTIFIED" || status === "WITHDRAWN") ready.push(file);
  else blocking.push({ file, reason: decision === "REQUIRES_CORRECTION" ? "CORRECTION_REQUIRED" : status || "UNRESOLVED" });
}

console.log(`Legacy articles: ${articles.length}`);
console.log(`Ready for mandatory gate: ${ready.length}`);
console.log(`Blocking migration items: ${blocking.length}`);
for (const item of blocking) console.log(`- ${item.file}: ${item.reason}`);

if (blocking.length) {
  console.log("LEGACY GATE READINESS: BLOCKED");
  console.log("Publication Gate global no puede pasar a enforcement mientras exista legacy sin CERTIFIED o WITHDRAWN.");
  process.exit(1);
}

console.log("LEGACY GATE READINESS: READY");
