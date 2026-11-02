import type { CSSProperties } from "react";

import { articles } from "@/data/articles";
import { getSection } from "@/data/sections";
import type { SectionSlug } from "@/data/types";
import { sortByNewest } from "@/lib/utils";
import { sectionColor } from "@/lib/sectionTheme";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";

interface SectionPageProps {
  sectionSlug: SectionSlug;
}

/** Página de sección: bloque de color con título y noticia principal; debajo, rejilla oscura. */
export function SectionPage({ sectionSlug }: SectionPageProps) {
  const section = getSection(sectionSlug);
  if (!section) return null;

  const byNewest = sortByNewest(articles.filter((a) => a.section === sectionSlug));
  const lead = byNewest[0];
  const grid = byNewest.slice(1, 13);
  const archive = byNewest.slice(13);

  return (
    <>
      <div className="theme-color sec-page-hero" style={{ "--sec": sectionColor(sectionSlug) } as CSSProperties}>
        <div className="container-editorial">
          <p className="sec-page-count">Sección · {byNewest.length} noticias</p>
          <h1 className="sec-page-title">{section.name}</h1>
          {lead && <FeaturedStory article={lead} as="h2" />}
        </div>
      </div>

      <div className="theme-dark">
        {grid.length > 0 && (
          <section aria-label="Más noticias" className="container-editorial w-grid-section" id="mas-noticias">
            <SectionHeader title="Más noticias" as="h2" variant="kicker" />
            <div className="grid-dense">
              {grid.map((a) => (
                <StoryCard key={a.slug} article={a} size="md" />
              ))}
            </div>
          </section>
        )}

        {archive.length > 0 && (
          <section aria-label="Archivo de la sección" className="container-editorial w-grid-section" id="archivo">
            <SectionHeader title="Archivo" as="h2" variant="kicker" />
            <ol className="dense-list">
              {archive.map((a) => (
                <LatestItem key={a.slug} article={a} />
              ))}
            </ol>
          </section>
        )}
      </div>
    </>
  );
}
