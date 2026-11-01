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
    <section aria-labelledby="actualizaciones-titulo" className="art-block">
      <h2 id="actualizaciones-titulo" className="art-label art-label-hot">
        Actualizaciones
      </h2>
      <ul className="updates">
        {article.updates.map((update: UpdateEntry, i) => (
          <li key={i}>
            <time className="data-value">{update.time}</time>
            <p>{update.text}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
