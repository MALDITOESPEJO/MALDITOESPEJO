import fs from 'node:fs';
import path from 'node:path';

const root = path.resolve('content/articles');
const out = path.resolve('editorial/migration/LEGACY_ARTICLE_INVENTORY.json');

if (!fs.existsSync(root)) {
  console.error(`Missing articles directory: ${root}`);
  process.exit(1);
}

const files = fs.readdirSync(root)
  .filter((name) => name.endsWith('.md') || name.endsWith('.mdx'))
  .sort();

const articles = files.map((file) => {
  const content = fs.readFileSync(path.join(root, file), 'utf8');
  const hasFrontmatter = content.startsWith('---\n');
  const statusMatch = content.match(/(?:^|\n)status:\s*["']?([^\n"']+)/i);
  const versionMatch = content.match(/(?:^|\n)(?:version|articleVersion):\s*["']?([^\n"']+)/i);
  const idMatch = content.match(/(?:^|\n)(?:article_id|articleId|id):\s*["']?([^\n"']+)/i);

  return {
    file,
    article_id: idMatch?.[1]?.trim() || null,
    current_version: versionMatch?.[1]?.trim() || null,
    declared_status: statusMatch?.[1]?.trim() || null,
    migration_status: 'LEGACY_UNREVIEWED',
    requires_editorial_audit: true,
    has_frontmatter: hasFrontmatter
  };
});

const report = {
  schema: 'legacy-article-inventory/v1',
  generated_at: new Date().toISOString(),
  source_directory: 'content/articles',
  total: articles.length,
  articles
};

fs.mkdirSync(path.dirname(out), { recursive: true });
fs.writeFileSync(out, `${JSON.stringify(report, null, 2)}\n`);
console.log(`Inventory written: ${out}`);
console.log(`Legacy articles found: ${articles.length}`);
