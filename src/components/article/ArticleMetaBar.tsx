import type { Article } from "@/data/types";
import { formatEditorialMeta, formatTime } from "@/lib/utils";
import { ArticleByline } from "./ArticleByline";

interface ArticleMetaBarProps {
  article: Article;
}

/**
 * Franja de metadatos del articulo: autor y distincion
 * Publicado / Actualizado (cuando proceda).
 */
export function ArticleMetaBar({ article }: ArticleMetaBarProps) {
  const hasUpdate =
    Boolean(article.updatedAt) && article.updatedAt !== article.publishedAt;

  return (
    <div className="mt-6 border-y border-border py-4">
      <ArticleByline author={article.author} />
      <div className="metadata mt-2 flex flex-wrap items-center gap-x-4 gap-y-1">
        <span>
          <span className="font-semibold uppercase tracking-[0.08em] text-ink">
            Publicado
          </span>{" "}
          {formatEditorialMeta(article.publishedAt)}
        </span>
        {hasUpdate && article.updatedAt && (
          <span>
            <span className="font-semibold uppercase tracking-[0.08em] text-accent">
              Actualizado
            </span>{" "}
            <time dateTime={article.updatedAt}>{formatTime(article.updatedAt)}</time>
          </span>
        )}
      </div>
    </div>
  );
}
