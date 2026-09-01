import Link from "next/link";

import type { Article } from "@/data/types";
import { formatEditorialMeta } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/CategoryLabel";

interface FeaturedStoryProps {
  article: Article;
  as?: "h1" | "h2" | "h3";
}

/** Historia principal / noticia dominante de la portada. */
export function FeaturedStory({ article, as: Heading = "h2" }: FeaturedStoryProps) {
  const HeadingTag = Heading as "h1" | "h2" | "h3";
  return (
    <article className="border-b border-border pb-10">
      <CategoryLabel slug={article.section} className="mb-5" />

      <HeadingTag className="headline-xl max-w-4xl text-ink">
        <Link
          href={`/${article.slug}`}
          className="transition-colors hover:text-accent"
        >
          {article.title}
        </Link>
      </HeadingTag>

      <p className="dek mt-5 max-w-2xl">{article.dek}</p>

      <p className="metadata mt-5 tabular-nums">
        {formatEditorialMeta(article.publishedAt)}
      </p>
    </article>
  );
}
