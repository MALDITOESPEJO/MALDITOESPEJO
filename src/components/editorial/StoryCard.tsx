import Link from "next/link";
import { formatEditorialMeta } from "@/lib/utils";
import { sectionName } from "@/data/sections";
import type { Article } from "@/data/types";
import { ImageMarshal } from "@/components/ui/ImageMarshal";
import { ArrowChip } from "@/components/ui/ArrowChip";

interface StoryCardProps {
  article: Article;
  size?: "sm" | "md" | "lg";
  showImage?: boolean;
  showDek?: boolean;
  /** Se mantiene por compatibilidad; la rejilla Wire ya no usa tarjetas a doble ancho. */
  wide?: boolean;
}

/** Tarjeta: imagen, titular condensado con flecha, línea discontinua, entradilla y firma. */
export function StoryCard({ article, size = "md", showImage = true, showDek = true }: StoryCardProps) {
  const heading = { sm: "headline-sm", md: "headline-md", lg: "headline-lg" }[size];
  const href = `/${article.slug}`;

  return (
    <article className="card">
      {showImage && (
        <Link href={href} aria-label={`Leer: ${article.title}`} className="card-media">
          {article.image ? (
            <ImageMarshal article={article} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="editorial-image-placeholder" aria-hidden="true" />
          )}
        </Link>
      )}
      <div className="card-head">
        <h3 className={heading}>
          <Link href={href} className="hl">
            {article.title}
          </Link>
        </h3>
        <ArrowChip />
      </div>
      {showDek && article.dek && (
        <>
          <hr className="card-rule" />
          <p className="card-dek">{article.dek}</p>
        </>
      )}
      <div className="card-meta">
        <span>{sectionName(article.section)}</span>
        <time dateTime={article.publishedAt}>{formatEditorialMeta(article.publishedAt)}</time>
      </div>
    </article>
  );
}
