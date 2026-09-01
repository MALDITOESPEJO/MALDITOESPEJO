import type { Article, Source } from "@/data/types";

interface ArticleSourcesProps {
  article: Article;
}

/**
 * Bloque FUENTES. Cada fuente identifica organismo/persona, titulo,
 * naturaleza, fecha y enlace. Este componente sostiene el principio
 * SOLO HECHOS: toda afirmacion debe poder volver a su origen.
 * Los enlaces son ficticios (DEMO) y muestran el destino visible.
 */
export function ArticleSources({ article }: ArticleSourcesProps) {
  if (article.sources.length === 0) {
    return null;
  }

  return (
    <section aria-labelledby="fuentes-titulo" className="mx-auto mt-12 w-full max-w-[680px]">
      <h2
        id="fuentes-titulo"
        className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink"
      >
        Fuentes
      </h2>
      <ul className="mt-4 divide-y divide-border border-y border-border">
        {article.sources.map((source, i) => (
          <SourceRow key={i} source={source} />
        ))}
      </ul>
    </section>
  );
}

function SourceRow({ source }: { source: Source }) {
  return (
    <li className="flex flex-col gap-1 py-4">
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-1">
        {source.entity && <span className="font-semibold text-ink">{source.entity}</span>}
        <span className="text-[0.82rem] text-muted">{source.label}</span>
      </div>
      <div className="metadata flex flex-wrap gap-x-3 gap-y-1">
        {source.nature && <span className="capitalize">{source.nature}</span>}
        {source.date && <span>{source.date}</span>}
      </div>
      {source.url && (
        <a
          href={source.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Abrir ${source.label} de ${source.entity ?? "la fuente"} en ventana nueva`}
          className="mt-1 inline-block break-all text-[0.82rem] text-accent underline decoration-accent/40 underline-offset-2 transition-colors hover:text-ink"
        >
          {source.url.replace(/^https?:\/\//, "")}
          <span className="sr-only"> (abre en ventana nueva)</span>
        </a>
      )}
    </li>
  );
}
