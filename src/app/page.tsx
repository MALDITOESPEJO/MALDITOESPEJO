import type { Metadata } from "next";

import { articles } from "@/data/articles";
import { sections } from "@/data/sections";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { GiantWordmark } from "@/components/ui/GiantWordmark";
import { DigestBand } from "@/components/editorial/DigestBand";
import { SectionBlock } from "@/components/editorial/SectionBlock";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";

export const metadata: Metadata = { title: { absolute: "MALDITOESPEJO — Solo hechos" }, description: "MALDITOESPEJO es un medio de información basado exclusivamente en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.", alternates: { canonical: "/" }, openGraph: { siteName: "MALDITOESPEJO", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.", type: "website", locale: "es_ES" }, twitter: { card: "summary", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles." } };

const byNewest = sortByNewest(articles);
const featured = byNewest[0];
/* Resumen crema: las 3 siguientes. */
const digest = byNewest.slice(1, 4);
/* Rejilla oscura: 9 historias con imagen. */
const grid = byNewest.slice(4, 13);
/* Bloques de color: las 6 secciones con la noticia más reciente. */
const blocks = sections
  .map((section) => ({ section, items: byNewest.filter((a) => a.section === section.slug).slice(0, 4) }))
  .filter((b) => b.items.length > 0)
  .sort((a, b) => b.items[0].publishedAt.localeCompare(a.items[0].publishedAt))
  .slice(0, 6);
/* Más recientes: lo que queda de la portada, en lista compacta. */
const archive = byNewest.slice(13, 33);

function longDate(iso: string): string {
  return new Date(iso).toLocaleDateString("es-ES", { day: "numeric", month: "long", year: "numeric", timeZone: "UTC" });
}

export default function HomePage() {
  return (
    <>
      <div className="theme-dark">
        <div className="container-editorial">
          <div className="masthead">
            <GiantWordmark text="MALDITOESPEJO" height={250} reflect={90} />
          </div>
          {featured && <FeaturedStory article={featured} as="h1" />}
        </div>
      </div>

      <DigestBand items={digest} dateLabel={featured ? longDate(featured.publishedAt) : ""} />

      {grid.length > 0 && (
        <div className="theme-dark">
          <section aria-label="Más noticias" className="container-editorial w-grid-section" id="mas-noticias">
            <SectionHeader title="Más noticias" as="h2" variant="kicker" href="/lo-ultimo" />
            <div className="grid-dense">
              {grid.map((a) => (
                <StoryCard key={a.slug} article={a} size="md" />
              ))}
            </div>
          </section>
        </div>
      )}

      {blocks.map(({ section, items }) => (
        <SectionBlock key={section.slug} section={section} items={items} />
      ))}

      {archive.length > 0 && (
        <div className="theme-dark">
          <section aria-label="Más recientes" className="container-editorial w-grid-section" id="archivo">
            <SectionHeader title="Más recientes" as="h2" variant="kicker" href="/lo-ultimo" moreLabel="Todo →" />
            <ol className="dense-list">
              {archive.map((a) => (
                <LatestItem key={a.slug} article={a} />
              ))}
            </ol>
          </section>
        </div>
      )}
    </>
  );
}
