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
}

export function StoryCard({
  article,
  size = "md",
  showImage = true,
  showDek = false,
}: StoryCardProps) {
  const heading = {
    sm: "headline-sm",
    md: "headline-md",
    lg: "headline-lg",
  }[size];

  return (
    <article className="group flex flex-col gap-3">
      {showImage && article.image && (
        <Link href={`/${article.slug}`} aria-label={`Leer: ${article.title}`} className="block overflow-hidden rounded-sm bg-surface">
          <ImageMarshal
            article={article}
            sizes="(max-width: 699px) 100vw, (max-width: 1049px) 50vw, 33vw"
          />
        </Link>
      )}
      <div className="flex flex-col gap-2">
        <CategoryLabel slug={article.section} className="w-fit" />
        <h3 className={heading}>
          <Link
            href={`/${article.slug}`}
            className="text-ink transition-colors group-hover:text-accent"
          >
            {article.title}
          </Link>
        </h3>
        {showDek && (
          <p className={`text-ink ${size === "lg" ? "dek" : "mt-1 text-[0.92rem] leading-relaxed text-muted"}`}>
            {article.dek}
          </p>
        )}
        <time className="metadata" dateTime={article.publishedAt}>
          {formatEditorialMeta(article.publishedAt)}
        </time>
      </div>
    </article>
  );
}
