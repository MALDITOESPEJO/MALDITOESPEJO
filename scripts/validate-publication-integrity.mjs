#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const FIXED_AUTHOR = "Redacción MALDITOESPEJO";
const POLICY_EFFECTIVE_DATE = "2026-09-12";
const PUBLISHABLE_STATUSES = new Set(["approved", "published"]);

function parseFrontmatter(content) {
  const lines = content.split(/\r?\n/);
  if (lines[0]?.trim() !== "---") return null;
  const closing = lines.findIndex((line, index) => index > 0 && line.trim() === "---");
  if (closing === -1) return null;
  const data = {};
  let activeListKey = null;
  for (const line of lines.slice(1, closing)) {
    if (!line.trim()) continue;
    const keyMatch = line.match(/^([A-Za-z0-9_-]+):\s*(.*)$/);
    if (keyMatch) {
      const [, key, rawValue] = keyMatch;
      const value = rawValue.trim().replace(/^['"]|['"]$/g, "");
      if (value === "") {
        data[key] = [];
        activeListKey = key;
      } else {
        data[key] = value;
        activeListKey = null;
      }
      continue;
    }
    const listMatch = line.match(/^\s+-\s+(.+)$/);
    if (listMatch && activeListKey) {
      data[activeListKey].push(listMatch[1].trim().replace(/^['"]|['"]$/g, ""));
      continue;
    }
  }
  return data;
}

function collectArticles(dir) {
  if (!fs.existsSync(dir)) return [];
  return fs.readdirSync(dir, { withFileTypes: true }).flatMap((entry) => {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) return collectArticles(full);
    return entry.isFile() && entry.name.endsWith(".md") ? [full] : [];
  });
}

const legacyBylinePattern = /^\*\*[^*]+\s+·\s+\d{1,2}\s+de\s+[a-záéíóúñ]+\s+de\s+\d{4}(?:\s+·\s+\d{1,2}:\d{2}\s*h)?\s*\*\*$/i;
const files = collectArticles(ARTICLES_DIR);
let errors = 0;
let warnings = 0;

console.log("MALDITOESPEJO — integridad de publicación");
console.log(`Artículos encontrados: ${files.length}`);
console.log("");

for (const file of files) {
  const relative = path.relative(ROOT, file);
  const content = fs.readFileSync(file, "utf8");
  const metadata = parseFrontmatter(content);
  if (!metadata) {
    errors += 1;
    console.log(`✖ ${relative}: frontmatter inválido`);
    continue;
  }

  const normalizedAuthor = metadata.author?.normalize("NFC");
  const isPolicyEra = metadata.date && metadata.date >= POLICY_EFFECTIVE_DATE;
  const isPublishable = PUBLISHABLE_STATUSES.has(metadata.status);

  if (isPolicyEra && isPublishable && normalizedAuthor !== FIXED_AUTHOR.normalize("NFC")) {
    errors += 1;
    console.log(`✖ ${relative}: autor público no permitido ('${metadata.author ?? "sin autor"}')`);
  }

  if (isPolicyEra && isPublishable) {
    const sources = Array.isArray(metadata.sources) ? metadata.sources.filter(Boolean) : [];
    if (sources.length !== 1) {
      errors += 1;
      console.log(`✖ ${relative}: un artículo publicable desde ${POLICY_EFFECTIVE_DATE} debe declarar exactamente una fuente primaria/oficial (actual: ${sources.length})`);
    }
  }

  const body = content.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  const blocks = body.split(/\r?\n\s*\r?\n/).map((block) => block.trim()).filter(Boolean);
  if (blocks.some((block) => legacyBylinePattern.test(block))) {
    if (isPolicyEra && isPublishable) {
      errors += 1;
      console.log(`✖ ${relative}: contiene una firma textual de autor en el cuerpo; la firma pública debe proceder exclusivamente del modelo editorial`);
    } else {
      warnings += 1;
      console.warn(`! ${relative}: contiene una firma textual histórica; el render público la elimina para mantener una única autoría`);
    }
  }
}

console.log("");
console.log(`Errores: ${errors}`);
console.log(`Avisos: ${warnings}`);
console.log(`Resultado: ${errors === 0 ? "INTEGRIDAD SUPERADA" : "INTEGRIDAD BLOQUEADA"}`);
process.exit(errors === 0 ? 0 : 1);
