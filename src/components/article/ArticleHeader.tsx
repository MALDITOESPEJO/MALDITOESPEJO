import type { Article } from "@/data/types";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";
import { ArticleMetaBar } from "./ArticleMetaBar";

interface ArticleHeaderProps {
  article: Article;
}

/**
 * Cabecera de artículo: etiqueta, titular mega-condensado (único H1),
 * entradilla, franja de metadatos e imagen a todo el ancho.
 */
export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="article-head">
      <CategoryLabel slug={article.section} className="article-kicker" />
      <h1 className="headline-xl article-title">{article.title}</h1>
      <p className="dek article-dek">{article.dek}</p>
      <ArticleMetaBar article={article} />
      <ImageMarshal
        article={article}
        priority
        className="article-figure"
        sizes="(min-width: 1320px) 1240px, 100vw"
      />
    </header>
  );
}
