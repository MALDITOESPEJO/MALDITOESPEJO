import Link from "next/link";
import type { Article } from "@/data/types";
import { formatEditorialMeta } from "@/lib/utils";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";

interface FeaturedStoryProps { article: Article; as?: "h1" | "h2" | "h3" }

export function FeaturedStory({ article, as: Heading = "h2" }: FeaturedStoryProps) {
  const HeadingTag = Heading as "h1" | "h2" | "h3";
  return (
    <article className="grid grid-cols-1 gap-7 md:grid-cols-[1.35fr_.85fr] md:items-end md:gap-10">
      <div>
        <CategoryLabel slug={article.section} className="mb-5" />
        <HeadingTag className="headline-display max-w-5xl text-ink">
          <Link href={`/${article.slug}`} className="story-hover">{article.title}</Link>
        </HeadingTag>
        <p className="dek mt-5 max-w-2xl md:mt-6">{article.dek}</p>
        <p className="metadata mt-5">{formatEditorialMeta(article.publishedAt)}</p>
      </div>
      {article.image && <div className="order-first md:order-last"><ImageMarshal article={article} sizes="(max-width: 768px) 100vw, 55vw" /></div>}
    </article>
  );
}
