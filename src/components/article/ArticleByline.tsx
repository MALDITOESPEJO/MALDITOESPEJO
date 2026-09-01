import type { Author } from "@/data/types";

interface ArticleBylineProps {
  author: Author;
}

/**
 * Firma del autor. Sostiene tanto el modelo de organismo/redaccion
 * (p. ej. "MALDITOESPEJO") como el de periodista a nombre propio.
 */
export function ArticleByline({ author }: ArticleBylineProps) {
  return (
    <p className="text-[0.82rem] leading-relaxed text-ink">
      <span className="font-semibold">{author.name}</span>
      {author.role ? <span className="text-faint"> · {author.role}</span> : null}
    </p>
  );
}
