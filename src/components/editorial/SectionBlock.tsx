import Link from "next/link";
import type { CSSProperties } from "react";

import type { Article, Section } from "@/data/types";
import { formatEditorialMeta } from "@/lib/utils";
import { sectionColor } from "@/lib/sectionTheme";
import { ImageMarshal } from "@/components/ui/ImageMarshal";
import { ArrowChip } from "@/components/ui/ArrowChip";

interface SectionBlockProps {
  section: Section;
  /** Del más reciente al más antiguo. El primero es la historia principal del bloque. */
  items: Article[];
}

/** Bloque de color a sangre: historia principal + fila de tarjetas + "Leer más…". */
export function SectionBlock({ section, items }: SectionBlockProps) {
  if (items.length === 0) return null;
  const [lead, ...rest] = items;
  const cards = rest.slice(0, 3);

  return (
    <section
      aria-label={section.name}
      className="theme-color sec-block"
      style={{ "--sec": sectionColor(section.slug) } as CSSProperties}
    >
      <div className="container-editorial">
        <div className="sec-lead">
          <div className="sec-lead-text">
            <Link href={section.url} className="sec-label">
              {section.name}
            </Link>
            <h2 className="sec-title">
              <Link href={`/${lead.slug}`} className="hl">
                {lead.title}
              </Link>
            </h2>
            <p className="sec-dek">{lead.dek}</p>
            <time className="sec-meta" dateTime={lead.publishedAt}>
              {formatEditorialMeta(lead.publishedAt)}
            </time>
          </div>
          <Link href={`/${lead.slug}`} aria-label={`Leer: ${lead.title}`} className="sec-lead-media">
            {lead.image ? <ImageMarshal article={lead} sizes="(min-width: 1024px) 55vw, 100vw" /> : <div className="editorial-image-placeholder" aria-hidden="true" />}
          </Link>
        </div>

        <div className="sec-row">
          {cards.map((a) => (
            <article key={a.slug} className="sec-card">
              <Link href={`/${a.slug}`} aria-label={`Leer: ${a.title}`} className="sec-card-media">
                {a.image ? <ImageMarshal article={a} sizes="(min-width: 1024px) 22vw, 50vw" /> : <div className="editorial-image-placeholder" aria-hidden="true" />}
              </Link>
              <div className="card-head">
                <h3 className="sec-card-title">
                  <Link href={`/${a.slug}`} className="hl">
                    {a.title}
                  </Link>
                </h3>
                <ArrowChip />
              </div>
              <hr className="card-rule" />
              <p className="sec-card-dek">{a.dek}</p>
              <time className="sec-meta" dateTime={a.publishedAt}>
                {formatEditorialMeta(a.publishedAt)}
              </time>
            </article>
          ))}
          <Link href={section.url} className="sec-more">
            <span>Leer más de {section.name}…</span>
            <span className="sec-more-foot">
              Entrar <ArrowChip />
            </span>
          </Link>
        </div>
      </div>
    </section>
  );
}
