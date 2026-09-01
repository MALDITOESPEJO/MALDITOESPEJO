import type { Article, TimelineEntry } from "@/data/types";

interface ArticleTimelineProps {
  article: Article;
}

/**
 * CRONOLOGIA del suceso, orientada a la lectura rapida por hora.
 * Se muestra solo cuando el registro cronologico existe.
 */
export function ArticleTimeline({ article }: ArticleTimelineProps) {
  if (!article.timeline || article.timeline.length === 0) {
    return null;
  }

  const entries = article.timeline;

  return (
    <section aria-labelledby="cronologia-titulo" className="mx-auto mt-12 w-full max-w-[680px]">
      <h2
        id="cronologia-titulo"
        className="text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-ink"
      >
        Cronología
      </h2>
      <ol className="mt-5">
        {entries.map((entry, i) => (
          <TimelineRow
            key={i}
            entry={entry}
            last={i === entries.length - 1}
          />
        ))}
      </ol>
    </section>
  );
}

function TimelineRow({ entry, last }: { entry: TimelineEntry; last: boolean }) {
  return (
    <li className="flex gap-4">
      <div className="flex flex-col items-center">
        <span className="mt-1 h-2 w-2 shrink-0 rounded-full bg-ink" />
        {!last && <span aria-hidden="true" className="w-px flex-1 bg-border" />}
      </div>
      <div className={last ? "pb-0" : "pb-6"}>
        <time className="data-value text-[0.82rem] text-ink">{entry.time}</time>
        <p className="mt-1 text-[0.98rem] leading-relaxed text-ink">{entry.text}</p>
      </div>
    </li>
  );
}
