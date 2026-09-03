#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INVENTORY = path.join(ROOT, 'editorial/migration/LEGACY_ARTICLE_INVENTORY.json');
const CERT_DIR = path.join(ROOT, 'editorial/migration/certifications');

if (!fs.existsSync(INVENTORY)) {
  console.error('Legacy inventory missing');
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const articles = inventory.articles ?? [];
let errors = 0;

for (const article of articles) {
  if (article.migration_status === 'CERTIFIED') {
    const file = path.join(CERT_DIR, `${article.article_id ?? path.basename(article.file, path.extname(article.file))}.json`);
    if (!fs.existsSync(file)) {
      console.error(`✖ ${article.file}: CERTIFIED without certification record`);
      errors += 1;
      continue;
    }
    let record;
    try { record = JSON.parse(fs.readFileSync(file, 'utf8')); } catch {
      console.error(`✖ ${article.file}: invalid certification JSON`);
      errors += 1;
      continue;
    }
    for (const field of ['article', 'certification_status', 'human_editorial_approval']) {
      if (!(field in record)) {
        console.error(`✖ ${article.file}: certification missing '${field}'`);
        errors += 1;
      }
    }
    if (record.certification_status !== 'CERTIFIED') {
      console.error(`✖ ${article.file}: certification_status must be CERTIFIED`);
      errors += 1;
    }
    if (record.human_editorial_approval !== true) {
      console.error(`✖ ${article.file}: human_editorial_approval must be true`);
      errors += 1;
    }
  } else if (article.migration_status === 'LEGACY_UNREVIEWED' || article.migration_status === 'LEGACY_IN_REVIEW') {
    const certification = article.certification_status;
    if (certification === 'CERTIFIED') {
      console.error(`✖ ${article.file}: inventory status conflicts with CERTIFIED`);
      errors += 1;
    }
  }
}

const uncertifiedPublished = articles.filter((a) =>
  a.migration_status !== 'CERTIFIED' && a.migration_status !== 'WITHDRAWN'
);

console.log(`Legacy articles: ${articles.length}`);
console.log(`Uncertified/unwithdrawn: ${uncertifiedPublished.length}`);
console.log(`Certification errors: ${errors}`);

if (errors > 0) process.exit(1);
process.exit(0);
