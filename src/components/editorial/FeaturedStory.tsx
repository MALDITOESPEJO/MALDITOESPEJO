import Link from "next/link";
import type { Article } from "@/data/types";
import { formatEditorialMeta } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";

interface FeaturedStoryProps {
  article: Article;
  as?: "h1" | "h2" | "h3";
}

/** Historia principal: titular enorme a la izquierda, imagen grande a la derecha. */
export function FeaturedStory({ article, as: Heading = "h2" }: FeaturedStoryProps) {
  const HeadingTag = Heading as "h1" | "h2" | "h3";
  const href = `/${article.slug}`;

  return (
    <article className="w-hero">
      <div className="w-hero-text">
        <div className="w-hero-top">
          <CategoryLabel slug={article.section} />
          <time className="metadata" dateTime={article.publishedAt}>
            {formatEditorialMeta(article.publishedAt)}
          </time>
        </div>
        <HeadingTag className="w-hero-title">
          <Link href={href} className="hl">
            {article.title}
          </Link>
        </HeadingTag>
        <p className="w-hero-dek">{article.dek}</p>
      </div>
      <Link href={href} aria-label={`Leer: ${article.title}`} className="w-hero-media">
        {article.image ? (
          <ImageMarshal article={article} sizes="(min-width: 1024px) 60vw, 100vw" priority />
        ) : (
          <div className="editorial-image-placeholder" aria-hidden="true" />
        )}
      </Link>
    </article>
  );
}
