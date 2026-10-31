import Link from "next/link";

import type { Article } from "@/data/types";
import { formatTime } from "@/lib/utils";
import { sectionName } from "@/data/sections";

interface LatestItemProps {
  article: Article;
}

/** Entrada del carril "Lo último": hora y dia en mono, seccion y titular. */
export function LatestItem({ article }: LatestItemProps) {
  const day = new Date(article.publishedAt)
    .toLocaleDateString("es-ES", { day: "2-digit", month: "short" })
    .replace(".", "");

  return (
    <li className="rail-item">
      <time dateTime={article.publishedAt} className="rail-time">
        {formatTime(article.publishedAt)}
        <small>{day}</small>
      </time>
      <div className="min-w-0">
        <span className="kicker kicker-sm">{sectionName(article.section)}</span>
        <Link href={`/${article.slug}`} className="rail-link hl">
          {article.title}
        </Link>
      </div>
    </li>
  );
}
