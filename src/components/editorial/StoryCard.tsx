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
  showImage = false,
  showDek = false,
}: StoryCardProps) {
  const heading = {
    sm: "text-[1rem] font-display font-bold leading-snug",
    md: "text-[1.15rem] font-display font-bold leading-snug",
    lg: "text-[1.5rem] font-display font-bold leading-tight",
  }[size];

  return (
    <article className="flex flex-col gap-3">
      {showImage && article.image && (
        <ImageMarshal article={article} sizes="(max-width: 768px) 100vw, 400px" />
      )}
      <div className="flex flex-col gap-2">
        <CategoryLabel slug={article.section} />
        <h3 className={heading}>
          <Link
            href={`/${article.slug}`}
            className="text-ink transition-colors hover:text-accent"
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
