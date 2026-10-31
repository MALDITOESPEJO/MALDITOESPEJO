import Link from "next/link";

import { articles } from "@/data/articles";
import { formatTime, sortByNewest } from "@/lib/utils";

const MAX_ITEMS = 8;

/**
 * Cinta "Lo último": titulares recientes en movimiento continuo.
 * Se pausa con el ratón o el foco. Con movimiento reducido se desplaza a mano.
 * La segunda copia es decorativa (aria-hidden, sin enlaces) para el bucle.
 */
export function Ticker() {
  const items = sortByNewest(articles).slice(0, MAX_ITEMS);
  if (items.length === 0) return null;

  return (
    <div className="ticker" role="region" aria-label="Titulares de última hora">
      <div className="ticker-label">Lo último</div>
      <div className="ticker-viewport">
        <div className="ticker-track">
          <div className="ticker-set">
            {items.map((a) => (
              <Link key={a.slug} href={`/${a.slug}`} className="ticker-item">
                <time dateTime={a.publishedAt}>{formatTime(a.publishedAt)}</time>
                <span>{a.title}</span>
              </Link>
            ))}
          </div>
          <div className="ticker-set" aria-hidden="true">
            {items.map((a) => (
              <span key={a.slug} className="ticker-item">
                <time dateTime={a.publishedAt}>{formatTime(a.publishedAt)}</time>
                <span>{a.title}</span>
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
