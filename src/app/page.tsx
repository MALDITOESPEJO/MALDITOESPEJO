import type { Metadata } from "next";
import Link from "next/link";

import { articles } from "@/data/articles";
import { sections } from "@/data/sections";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";
import { SectionStrip } from "@/components/editorial/SectionStrip";

export const metadata: Metadata = { title: { absolute: "MALDITOESPEJO — Solo hechos" }, description: "MALDITOESPEJO es un medio de información basado exclusivamente en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.", alternates: { canonical: "/" }, openGraph: { siteName: "MALDITOESPEJO", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.", type: "website", locale: "es_ES" }, twitter: { card: "summary", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles." } };

const byNewest = sortByNewest(articles);
const featured = byNewest[0];
/* Carril lateral: las 8 siguientes, en formato hora + titular. */
const rail = byNewest.slice(1, 9);
/* Rejilla densa: 9 historias con imagen (la primera a doble ancho y doble alto). */
const grid = byNewest.slice(9, 18);
/* Archivo: lo que queda de la portada, en lista compacta. */
const archive = byNewest.slice(18, 38);
/* Una tira por seccion con contenido. */
const strips = sections
  .map((section) => ({ section, items: byNewest.filter((a) => a.section === section.slug).slice(0, 4) }))
  .filter((s) => s.items.length > 0);

export default function HomePage() {
  return (
    <div className="container-editorial">
      {featured && (
        <section aria-label="Noticia principal" className="hero mt-6">
          <div className="hero-main">
            <FeaturedStory article={featured} as="h1" layout="stack" />
          </div>
          {rail.length > 0 && (
            <aside aria-label="Lo último" className="hero-rail">
              <div className="rail-head">
                <h2>Lo último</h2>
                <Link href="/lo-ultimo">Ver todo →</Link>
              </div>
              <ol>
                {rail.map((a) => (
                  <LatestItem key={a.slug} article={a} />
                ))}
              </ol>
            </aside>
          )}
        </section>
      )}

      {grid.length > 0 && (
        <section aria-label="Más noticias" className="section-space" id="mas-noticias">
          <SectionHeader title="Más noticias" as="h2" variant="kicker" href="/lo-ultimo" />
          <div className="grid-dense">
            {grid.map((a, index) => (
              <StoryCard
                key={a.slug}
                article={a}
                size={index === 0 ? "lg" : "md"}
                showDek={index === 0}
                wide={index === 0}
              />
            ))}
          </div>
        </section>
      )}

      {featured && featured.keyFacts.length > 0 && (
        <section aria-label="Lo que sabemos" className="section-space" id="lo-que-sabemos">
          <div className="facts">
            <h2 className="facts-title">Lo que sabemos</h2>
            <p className="facts-ref">{featured.title}</p>
            <ul className="facts-list">
              {featured.keyFacts.map((fact, i) => (
                <li key={i}>
                  <span>{fact}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {strips.map(({ section, items }) => (
        <SectionStrip key={section.slug} section={section} items={items} />
      ))}

      {archive.length > 0 && (
        <section aria-label="Archivo reciente" className="section-space pb-4" id="archivo">
          <SectionHeader title="Archivo reciente" as="h2" variant="kicker" href="/lo-ultimo" moreLabel="Todo →" />
          <ol className="dense-list">
            {archive.map((a) => (
              <LatestItem key={a.slug} article={a} />
            ))}
          </ol>
        </section>
      )}
    </div>
  );
}
