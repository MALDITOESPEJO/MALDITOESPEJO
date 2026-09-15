import fs from "node:fs";
import path from "node:path";

const ARTICLES_DIR = path.join(process.cwd(), "content", "articles");
const POLICY_EFFECTIVE_DATE = "2026-09-12";
const PUBLISHABLE_STATUSES = new Set(["approved", "published"]);

function parseFrontmatter(source) {
  const match = source.match(/^---\n([\s\S]*?)\n---/);
  if (!match) return null;
  const values = {};
  for (const line of match[1].split("\n")) {
    const item = line.match(/^([A-Za-z0-9_]+):\s*(.*)$/);
    if (!item) continue;
    values[item[1]] = item[2].replace(/^['\"]|['\"]$/g, "");
  }
  return values;
}

const files = fs.readdirSync(ARTICLES_DIR).filter((file) => file.endsWith(".md")).sort();
const findings = [];

for (const file of files) {
  const source = fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8");
  const meta = parseFrontmatter(source);
  if (!meta || !PUBLISHABLE_STATUSES.has(meta.status)) continue;
  if (!meta.date || meta.date >= POLICY_EFFECTIVE_DATE) continue;

  const hasSources = /^sources:\s*$/m.test(source) || /^sources:\s*\[/m.test(source);
  if (!hasSources) findings.push({ file, date: meta.date, author: meta.author ?? "(sin autor)" });
}

console.log(`Artículos históricos publicables auditados: ${files.length}`);
console.log(`Fecha de corte: ${POLICY_EFFECTIVE_DATE}`);
console.log(`Artículos sin sources: ${findings.length}`);
for (const finding of findings) {
  console.log(`- ${finding.file} | ${finding.date} | autor histórico: ${finding.author}`);
}
