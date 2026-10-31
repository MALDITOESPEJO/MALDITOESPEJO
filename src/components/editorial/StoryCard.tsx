import Link from "next/link";
import { formatEditorialMeta } from "@/lib/utils";
import type { Article } from "@/data/types";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";

interface StoryCardProps {
  article: Article;
  size?: "sm" | "md" | "lg";
  showImage?: boolean;
  showDek?: boolean;
  /** Ocupa dos columnas en la rejilla densa de portada (solo escritorio). */
  wide?: boolean;
}

export function StoryCard({ article, size = "md", showImage = true, showDek = false, wide = false }: StoryCardProps) {
  const heading = { sm: "headline-sm", md: "headline-md", lg: "headline-lg" }[size];
  const href = `/${article.slug}`;

  return (
    <article className={`card${wide ? " card-wide" : ""}`}>
      {showImage && (
        <Link href={href} aria-label={`Leer: ${article.title}`} className="card-media">
          {article.image ? (
            <ImageMarshal article={article} sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw" />
          ) : (
            <div className="editorial-image-placeholder" aria-hidden="true" />
          )}
        </Link>
      )}
      <div className="card-body">
        <CategoryLabel slug={article.section} className="w-fit" />
        <h3 className={heading}>
          <Link href={href} className="hl">
            {article.title}
          </Link>
        </h3>
        {showDek && <p className={size === "lg" ? "dek" : "card-dek"}>{article.dek}</p>}
        <time className="metadata" dateTime={article.publishedAt}>
          {formatEditorialMeta(article.publishedAt)}
        </time>
      </div>
    </article>
  );
}
