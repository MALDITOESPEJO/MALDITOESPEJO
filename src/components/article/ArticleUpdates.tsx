import type { Article, UpdateEntry } from "@/data/types";

interface ArticleUpdatesProps {
  article: Article;
}

/**
 * ACTUALIZACIONES posteriores a la publicacion. Complementa la
 * distincion Publicado/Actualizado de la cabecera: aqui se detallan
 * los cambios incorporados desde entonces.
 */
export function ArticleUpdates({ article }: ArticleUpdatesProps) {
  if (!article.updates || article.updates.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="actualizaciones-titulo" className="mx-auto mt-12 w-full max-w-[680px]">
      <h2
        id="actualizaciones-titulo"
        className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent"
      >
        Actualizaciones
      </h2>
      <ul className="mt-4 bg-surface p-5">
        {article.updates.map((update: UpdateEntry, i) => (
          <li
            key={i}
            className={
              i === 0 ? "flex gap-3" : "mt-3 flex gap-3 border-t border-border pt-3"
            }
          >
            <time className="data-value shrink-0 text-[0.82rem] text-accent">
              {update.time}
            </time>
            <p className="text-[0.95rem] leading-relaxed text-ink">{update.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
