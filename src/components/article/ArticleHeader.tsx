import type { Article } from "@/data/types";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";
import { ArticleMetaBar } from "./ArticleMetaBar";

interface ArticleHeaderProps {
  article: Article;
}

/**
 * Cabecera del articulo: categoria, titular (unic H1), entradilla,
 * metadatos y, en su caso, imagen informativa. Columna de lectura.
 */
export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="mx-auto w-full max-w-[680px]">
      <CategoryLabel slug={article.section} className="mb-6" />
      <h1 className="headline-xl text-ink">{article.title}</h1>
      <p className="dek mt-6">{article.dek}</p>
      <ArticleMetaBar article={article} />
      <ImageMarshal
        article={article}
        className="mt-6"
        sizes="(max-width: 768px) 100vw, 680px"
      />
    </header>
  );
}
