import fs from 'node:fs';
import path from 'node:path';

const ROOT = process.cwd();
const ARTICLES_DIR = path.join(ROOT, 'content', 'articles');
const VALIDATION_DIR = path.join(ROOT, 'editorial', 'validation');

const TARGET_STATUSES = new Set(['verified', 'published']);
const requiredSections = [
  /##\s+(?:5\.\s*)?Corroboraci[oó]n y contradicciones/i,
  /##\s+(?:Contradicciones|Corroboraci[oó]n)/i,
];

function parseFrontmatter(content) {
  if (!content.startsWith('---')) return null;
  const end = content.indexOf('\n---', 3);
  if (end === -1) return null;
  const raw = content.slice(3, end).replace(/^\r?\n/, '');
  const metadata = {};
  for (const line of raw.split(/\r?\n/)) {
    const match = line.match(/^([A-Za-z0-9_-]+):\s*["']?([^"']*)["']?\s*$/);
    if (match) metadata[match[1]] = match[2].trim();
  }
  return metadata;
}

function articleIdFor(file, metadata) {
  return metadata.id || path.basename(file, path.extname(file));
}

function findVerificationRecord(articleId) {
  for (const ext of ['.md', '.json']) {
    const candidate = path.join(VALIDATION_DIR, `${articleId}${ext}`);
    if (fs.existsSync(candidate)) return candidate;
  }
  return null;
}

function hasContradictionAssessment(content) {
  return requiredSections.some((pattern) => pattern.test(content));
}

function hasIndependenceAssessment(content) {
  return /(independencia|independiente|misma\s+fuente|misma\s+cadena|misma\s+procedencia|linaje)/i.test(content);
}

function hasExplicitConflictOutcome(content) {
  return /(contradicci[oó]n[^\n]*(?:material|relevante)|no se ha identificado[^\n]*contradicci[oó]n|se ha identificado[^\n]*contradicci[oó]n|conflicto[^\n]*(?:abierto|resuelto|pendiente))/i.test(content);
}

if (!fs.existsSync(ARTICLES_DIR)) {
  console.error(`No existe el directorio de artículos: ${ARTICLES_DIR}`);
  process.exit(1);
}

const articleFiles = fs.readdirSync(ARTICLES_DIR)
  .filter((name) => /\.(md|mdx)$/i.test(name))
  .map((name) => path.join(ARTICLES_DIR, name));

const errors = [];
const checked = [];

for (const file of articleFiles) {
  const content = fs.readFileSync(file, 'utf8');
  const metadata = parseFrontmatter(content);
  if (!metadata || !TARGET_STATUSES.has(metadata.status)) continue;

  const articleId = articleIdFor(file, metadata);
  const record = findVerificationRecord(articleId);
  if (!record) {
    errors.push(`${articleId}: no existe expediente de verificación.`);
    continue;
  }

  const recordContent = fs.readFileSync(record, 'utf8');
  checked.push(articleId);

  if (!hasContradictionAssessment(recordContent)) {
    errors.push(`${articleId}: falta una sección explícita de corroboración/contradicciones.`);
  }
  if (!hasIndependenceAssessment(recordContent)) {
    errors.push(`${articleId}: falta una evaluación explícita de independencia/procedencia de las fuentes.`);
  }
  if (!hasExplicitConflictOutcome(recordContent)) {
    errors.push(`${articleId}: falta una conclusión explícita sobre contradicciones o conflictos.`);
  }
}

if (errors.length) {
  console.error('VALIDACIÓN DE INDEPENDENCIA: BLOQUEADA');
  for (const error of errors) console.error(`- ${error}`);
  process.exit(1);
}

console.log(`VALIDACIÓN DE INDEPENDENCIA: SUPERADA (${checked.length} artículos comprobados)`);
