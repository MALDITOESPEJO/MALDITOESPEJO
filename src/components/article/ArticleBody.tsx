import type { Article } from "@/data/types";
import { MarkdownBlocks } from "./MarkdownBlocks";

interface ArticleBodyProps {
  article: Article;
}

/**
 * Cuerpo del artículo (serifa de lectura). Cada bloque editorial se
 * interpreta como Markdown: negritas, listas, citas y enlaces.
 */
export function ArticleBody({ article }: ArticleBodyProps) {
  return (
    <div className="prose-editorial">
      {article.body.map((block, i) => (
        <MarkdownBlocks key={i} content={block.content} />
      ))}
    </div>
  );
}
