import Link from "next/link";

import type { Article } from "@/data/types";
import { sectionName } from "@/data/sections";
import { factText } from "@/lib/markdown";

interface DigestBandProps {
  items: Article[];
  /** Fecha del bloque, p. ej. "2 de noviembre de 2026". */
  dateLabel: string;
}

/** Bloque crema "Lo que sabemos hoy": tres columnas con filetes y texto que se desvanece. */
export function DigestBand({ items, dateLabel }: DigestBandProps) {
  if (items.length === 0) return null;

  return (
    <section aria-label="Lo que sabemos hoy" className="theme-cream digest">
      <div className="container-editorial">
        <div className="digest-head">
          <span className="chip">{dateLabel}</span>
          <h2 className="digest-title">Lo que sabemos hoy</h2>
          <Link href="/lo-ultimo" className="digest-more">
            Ver todo →
          </Link>
        </div>
        <div className="digest-cols">
          {items.map((a) => (
            <article key={a.slug} className="digest-col">
              <h3 className="digest-h">
                <Link href={`/${a.slug}`}>{a.title}</Link>
              </h3>
              <p className="digest-by">{sectionName(a.section)}</p>
              <p className="digest-text">{a.keyFacts.slice(0, 2).map(factText).join(" ")}</p>
              <Link href={`/${a.slug}`} className="digest-read">
                Leer →
              </Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}
