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
]);

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

function loadApprovedArticles(): Article[] {
  if (!fs.existsSync(CONTENT_DIR)) return [];

  const loaded: Array<Article | null> = fs
    .readdirSync(CONTENT_DIR)
    .filter((file) => file.endsWith(".md") || file.endsWith(".mdx"))
    .map((file): Article | null => {
      const fullPath = path.join(CONTENT_DIR, file);
      const markdown = fs.readFileSync(fullPath, "utf8");
      const meta = parseFrontmatter(markdown);
      const section = meta.section?.toLowerCase() as SectionSlug;
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
        publishedAt: `${meta.date}T00:00:00`,
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
