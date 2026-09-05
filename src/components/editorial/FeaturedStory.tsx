import Link from "next/link";

import type { Article } from "@/data/types";
import { formatEditorialMeta } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";

interface FeaturedStoryProps {
  article: Article;
  as?: "h1" | "h2" | "h3";
}

/** Historia principal / noticia dominante de la portada. */
export function FeaturedStory({ article, as: Heading = "h2" }: FeaturedStoryProps) {
  const HeadingTag = Heading as "h1" | "h2" | "h3";

  return (
    <article className="border-b border-border pb-8 md:pb-10">
      <div className="home-lead">
        <div className="flex flex-col justify-center py-1 md:pr-5">
          <CategoryLabel slug={article.section} className="mb-4 w-fit" />
          <HeadingTag className="headline-xl max-w-3xl text-ink">
            <Link href={`/${article.slug}`} className="transition-colors hover:text-accent">
              {article.title}
            </Link>
          </HeadingTag>
          <p className="dek mt-5 max-w-xl">{article.dek}</p>
          <p className="metadata mt-5 tabular-nums">{formatEditorialMeta(article.publishedAt)}</p>
        </div>

        <Link href={`/${article.slug}`} aria-label={`Leer: ${article.title}`} className="block">
          <ImageMarshal
            article={article}
            priority
            sizes="(max-width: 899px) 100vw, 55vw"
            className="rounded-md"
          />
        </Link>
      </div>
    </article>
  );
}
