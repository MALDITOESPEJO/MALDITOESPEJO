import type { Article } from "@/data/types";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";
import { ArticleMetaBar } from "./ArticleMetaBar";

interface ArticleHeaderProps {
  article: Article;
}

/** Cabecera centrada: etiqueta, titular condensado (único H1), entradilla, firma y fecha, imagen con grano. */
export function ArticleHeader({ article }: ArticleHeaderProps) {
  return (
    <header className="art-head">
      <CategoryLabel slug={article.section} className="art-kicker" />
      <h1 className="art-title">{article.title}</h1>
      <p className="art-dek">{article.dek}</p>
      <ArticleMetaBar article={article} />
      <ImageMarshal article={article} priority className="art-figure" sizes="(min-width: 1320px) 1240px, 100vw" />
    </header>
  );
}
