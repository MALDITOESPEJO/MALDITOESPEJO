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
    <section aria-labelledby="cronologia-titulo" className="art-block">
      <h2 id="cronologia-titulo" className="art-label">
        Cronología
      </h2>
      <ol className="timeline">
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

function TimelineRow({ entry }: { entry: TimelineEntry; last: boolean }) {
  return (
    <li>
      <time className="data-value">{entry.time}</time>
      <p>{entry.text}</p>
    </li>
  );
}
