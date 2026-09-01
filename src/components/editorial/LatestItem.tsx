import Link from "next/link";

import type { Article } from "@/data/types";
import { formatTime } from "@/lib/utils";
import { sectionName } from "@/data/sections";

interface LatestItemProps {
  article: Article;
}

/** Entrada del listado "Lo último": hora, categoria, titular. */
export function LatestItem({ article }: LatestItemProps) {
  return (
    <li className="border-b border-border py-5 last:border-b-0">
      <div className="flex items-baseline gap-4">
        <time
          dateTime={article.publishedAt}
          className="shrink-0 text-[0.85rem] font-semibold tabular-nums text-foreground"
        >
          {formatTime(article.publishedAt)}
        </time>
        <div className="min-w-0">
          <span className="mr-2 text-[0.72rem] font-semibold uppercase tracking-[0.1em] text-muted">
            {sectionName(article.section)}
          </span>
          <Link
            href={`/${article.slug}`}
            className="text-[1.05rem] font-display font-bold leading-snug text-ink transition-colors hover:text-accent"
          >
            {article.title}
          </Link>
        </div>
      </div>
    </li>
  );
}
