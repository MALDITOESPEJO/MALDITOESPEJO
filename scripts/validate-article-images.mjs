#!/usr/bin/env node

import fs from "node:fs";
import path from "node:path";

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, "content", "articles");
const IMAGE_DIR = path.join(ROOT, "public", "images");
const IMAGE_EXTENSIONS = [".webp", ".avif", ".jpg", ".jpeg", ".png", ".svg"];

function frontmatter(markdown) {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};
  const data = {};
  for (const line of match[1].split(/\r?\n/)) {
    const matchField = line.match(/^([A-Za-z][\w-]*):\s*(?:\"([\s\S]*)\"|'([\s\S]*)'|(.*))$/);
    if (matchField) data[matchField[1]] = (matchField[2] ?? matchField[3] ?? matchField[4] ?? "").trim();
  }
  return data;
}

function filesIn(dir) {
  if (!fs.existsSync(dir)) return new Set();
  return new Set(fs.readdirSync(dir));
}

const images = filesIn(IMAGE_DIR);
const files = fs.existsSync(ARTICLES_DIR)
  ? fs.readdirSync(ARTICLES_DIR).filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
  : [];

let errors = 0;
for (const file of files) {
  const data = frontmatter(fs.readFileSync(path.join(ARTICLES_DIR, file), "utf8"));
  if (!["approved", "published"].includes(data.status)) continue;

  const slug = file.replace(/\.(md|mdx)$/, "");
  const explicit = data.image?.trim();
  if (explicit && /^(https?:)?\/\//.test(explicit)) continue;
  const candidate = explicit ? explicit.replace(/^\//, "").replace(/^images\//, "") : IMAGE_EXTENSIONS.map((ext) => `${slug}${ext}`).find((name) => images.has(name));
  if (!candidate || !images.has(candidate)) {
    console.error(`X ${file}: artículo ${data.status} sin imagen asociada en public/images`);
    errors += 1;
  }
}

if (errors) {
  console.error(`Fallo: ${errors} artículo(s) aprobado(s)/publicado(s) sin imagen.`);
  process.exit(1);
}
console.log("OK: todos los artículos aprobados/publicados tienen imagen asociada.");
