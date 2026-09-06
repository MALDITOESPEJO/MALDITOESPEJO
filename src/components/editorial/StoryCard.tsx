import Link from "next/link";
import { formatEditorialMeta } from "@/lib/utils";
import type { Article } from "@/data/types";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { ImageMarshal } from "@/components/ui/ImageMarshal";

interface StoryCardProps { article: Article; size?: "sm" | "md" | "lg"; showImage?: boolean; showDek?: boolean }

export function StoryCard({ article, size = "md", showImage = false, showDek = false }: StoryCardProps) {
  const heading = { sm:"headline-sm", md:"headline-md", lg:"headline-lg" }[size];
  return (
    <article className="group flex flex-col gap-4">
      {showImage && article.image && (
        <Link href={`/${article.slug}`} aria-label={article.title} className="story-hover block overflow-hidden bg-surface">
          <ImageMarshal article={article} sizes="(max-width: 768px) 100vw, 600px" />
        </Link>
      )}
      <div>
        <CategoryLabel slug={article.section} />
        <h3 className={`${heading} mt-2`}><Link href={`/${article.slug}`} className="story-hover">{article.title}</Link></h3>
        {showDek && <p className={`${size === "lg" ? "dek" : "mt-3 text-[.94rem] leading-[1.45] text-muted"}`}>{article.dek}</p>}
        <time className="metadata mt-3 block" dateTime={article.publishedAt}>{formatEditorialMeta(article.publishedAt)}</time>
      </div>
    </article>
  );
}
