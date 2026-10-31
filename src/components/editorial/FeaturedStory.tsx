import Link from "next/link";
import type { Article } from "@/data/types";
import { formatEditorialMeta } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";

interface FeaturedStoryProps {
  article: Article;
  as?: "h1" | "h2" | "h3";
  /**
   * stack: titular enorme arriba e imagen debajo (portada).
   * split: texto a la izquierda e imagen a la derecha (paginas de seccion).
   */
  layout?: "stack" | "split";
}

export function FeaturedStory({ article, as: Heading = "h2", layout = "split" }: FeaturedStoryProps) {
  const HeadingTag = Heading as "h1" | "h2" | "h3";
  const href = `/${article.slug}`;

  const media = (sizes: string) =>
    article.image ? (
      <ImageMarshal article={article} sizes={sizes} priority />
    ) : (
      <div className="editorial-image-placeholder editorial-image-placeholder-featured" aria-hidden="true" />
    );

  if (layout === "stack") {
    return (
      <article className="lead">
        <div className="lead-meta">
          <CategoryLabel slug={article.section} />
          <time className="metadata" dateTime={article.publishedAt}>
            {formatEditorialMeta(article.publishedAt)}
          </time>
        </div>
        <HeadingTag className="headline-xl lead-title">
          <Link href={href} className="hl">
            {article.title}
          </Link>
        </HeadingTag>
        <p className="dek lead-dek">{article.dek}</p>
        <Link href={href} aria-label={`Leer: ${article.title}`} className="lead-media">
          {media("(min-width: 1024px) 66vw, 100vw")}
        </Link>
      </article>
    );
  }

  return (
    <article className="lead border-b-2 border-ink pb-8 md:pb-10">
      <div className="home-lead">
        <div className="flex flex-col justify-center py-1 md:pr-5">
          <div className="lead-meta">
            <CategoryLabel slug={article.section} />
          </div>
          <HeadingTag className="headline-xl max-w-3xl">
            <Link href={href} className="hl">
              {article.title}
            </Link>
          </HeadingTag>
          <p className="dek lead-dek">{article.dek}</p>
          <time className="metadata mt-5" dateTime={article.publishedAt}>
            {formatEditorialMeta(article.publishedAt)}
          </time>
        </div>
        <Link href={href} aria-label={`Leer: ${article.title}`} className="lead-media lead-media-flush">
          {media("(max-width: 899px) 100vw, 700px")}
        </Link>
      </div>
    </article>
  );
}
