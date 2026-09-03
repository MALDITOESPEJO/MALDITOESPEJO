#!/usr/bin/env node
import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const INVENTORY = path.join(ROOT, 'editorial/migration/LEGACY_ARTICLE_INVENTORY.json');
const CERT_DIR = path.join(ROOT, 'editorial/migration/certifications');
const target = process.argv[2];

if (!target) {
  console.error('Usage: node scripts/legacy-review-init.mjs <article-file>');
  process.exit(1);
}

const inventory = JSON.parse(fs.readFileSync(INVENTORY, 'utf8'));
const article = (inventory.articles ?? []).find((item) => item.file === target);
if (!article) {
  console.error(`Article not found in legacy inventory: ${target}`);
  process.exit(1);
}
if (article.migration_status !== 'LEGACY_UNREVIEWED') {
  console.error(`Article is not LEGACY_UNREVIEWED: ${article.migration_status}`);
  process.exit(1);
}

const id = article.article_id || path.basename(article.file, path.extname(article.file));
const out = path.join(CERT_DIR, `${id}.json`);
if (fs.existsSync(out)) {
  console.error(`Review record already exists: ${out}`);
  process.exit(1);
}

fs.mkdirSync(CERT_DIR, { recursive: true });
const record = {
  schema: 'legacy-certification/v1',
  article: article.file,
  article_id: article.article_id,
  migration_status: 'LEGACY_IN_REVIEW',
  claims_reconstructed: false,
  evidence_mapped: false,
  verification_completed: false,
  human_editorial_approval: false,
  publication_gate_id: null,
  audit_event_id: null,
  started_at: new Date().toISOString()
};
fs.writeFileSync(out, `${JSON.stringify(record, null, 2)}\n`);
console.log(`Legacy review initialized: ${out}`);
