import fs from "node:fs";
import path from "node:path";
import type { Article, SectionSlug } from "./types";

const CONTENT_DIR = path.join(process.cwd(), "content", "articles");
const VALID_SECTIONS = new Set<SectionSlug>([
  "actualidad",
  "politica",
  "economia",
  "sociedad",
  "mundo",
  "tecnologia",
  "cartagena",
  "cultura",
]);

const LEGACY_PUBLICATION_TIMES: Record<string, string> = {
  "ceuta-crisis-marruecos-septiembre-2026": "11:07",
  "finlandia-defensa-civil-ejercicio-2026": "11:07",
  "petroleo-economia-mundial-septiembre-2026": "11:07",
  "australia-estados-unidos-cooperacion-pacifico-septiembre-2026": "11:18",
  "india-alipay-upi-septiembre-2026": "11:19",
  "ctrack-acceso-archivos-judiciales-septiembre-2026": "11:19",
  "nueva-york-ia-escuelas-septiembre-2026": "11:19",
  "el-nino-intensidad-2026-2027": "11:20",
  "suecia-elecciones-septiembre-2026": "11:20",
  "openai-hugging-face-incidente-ciberseguridad-septiembre-2026": "16:56",
  "cartagena-plan-barrios-diputaciones-2026-2027": "17:01",
  "tres-peliculas-espanolas-preseleccionadas-oscar-septiembre-2026": "17:04",
};

function parseFrontmatter(markdown: string): Record<string, string> {
  const match = markdown.match(/^---\r?\n([\s\S]*?)\r?\n---/);
  if (!match) return {};

  const fields: Record<string, string> = {};
  for (const line of match[1].split(/\r?\n/)) {
    const field = line.match(/^([A-Za-z][\w-]*):\s*(?:"([\s\S]*)"|'([\s\S]*)'|(.*))$/);
    if (field) fields[field[1]] = (field[2] ?? field[3] ?? field[4] ?? "").trim();
  }
  return fields;
}

function markdownBody(markdown: string): string[] {
  const body = markdown.replace(/^---\r?\n[\s\S]*?\r?\n---\r?\n?/, "");
  return body
    .split(/\r?\n\s*\r?\n/)
    .map((block) => block.trim())
    .filter((block) => block && !block.startsWith("#"));
}

function publicationTimestamp(slug: string, meta: Record<string, string>): string {
  const explicitTime = meta.time?.match(/^(?:[01]\d|2[0-3]):[0-5]\d$/)?.[0];
  const time = explicitTime ?? LEGACY_PUBLICATION_TIMES[slug] ?? "00:00";
  return `${meta.date}T${time}`;
}

function loadApprovedArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const loaded: Array<Article | null> = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file): Article | null => {
      const fullPath = path.join(CONTENT_DIR, file);
      const markdown = fs.readFileSync(fullPath, "utf8");
      const meta = parseFrontmatter(markdown);
      // Normaliza acentos además de mayúsculas: "Tecnología", "Económía" o
      // "TECNOLOGIA" deben resolver al mismo slug que "tecnologia". Sin esto,
      // un section con acento pasa el resto de comprobaciones pero no
      // coincide con VALID_SECTIONS y el artículo desaparece en silencio del
      // sitio aunque esté marcado como approved.
      const section = meta.section
        ?.toLowerCase()
        .normalize("NFD")
        .replace(/[\u0300-\u036f]/g, "") as SectionSlug;
      const paragraphs = markdownBody(markdown);

      if (meta.status !== "approved" || !meta.title || !meta.date || !VALID_SECTIONS.has(section)) {
        return null;
      }

      const slug = file.replace(/\.(md|mdx)$/, "");
      const article: Article = {
        slug,
        title: meta.title,
        dek: meta.description ?? "",
        section,
        publishedAt: publicationTimestamp(slug, meta),
        author: { name: meta.author ?? "MALDITOESPEJO" },
        keyFacts: paragraphs.slice(0, 4),
        body: paragraphs.map((content) => ({ type: "fact", content })),
        sources: [],
        isDemo: false,
      };
      return article;
    });

  return loaded
    .filter((article): article is Article => article !== null)
    .sort((a, b) => b.publishedAt.localeCompare(a.publishedAt));
}

/** Fuente editorial única: solo se publican archivos marcados como approved. */
export const articles: Article[] = loadApprovedArticles();
export const baseArticles: Article[] = articles;

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((article) => article.slug === slug);
}
