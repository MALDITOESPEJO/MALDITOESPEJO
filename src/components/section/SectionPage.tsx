import Link from "next/link";

import { articles } from "@/data/articles";
import { getSection } from "@/data/sections";
import type { SectionSlug } from "@/data/types";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";
import { factText } from "@/lib/markdown";

interface SectionPageProps {
  sectionSlug: SectionSlug;
}

/** Portada de sección: mismo lenguaje que la home (titular + carril + rejilla densa). */
export function SectionPage({ sectionSlug }: SectionPageProps) {
  const section = getSection(sectionSlug);
  if (!section) return null;

  const byNewest = sortByNewest(articles.filter((a) => a.section === sectionSlug));
  const lead = byNewest[0];
  const rail = byNewest.slice(1, 7);
  const grid = byNewest.slice(7, 16);
  const archive = byNewest.slice(16);

  return (
    <div className="container-editorial">
      <div className="section-space">
        <SectionHeader title={section.name} eyebrow={`Sección · ${byNewest.length} noticias`} />
      </div>

      {lead && (
        <section aria-label="Noticia principal" className="hero mt-6">
          <div className="hero-main">
            <FeaturedStory article={lead} as="h2" layout="stack" />
          </div>
          {rail.length > 0 && (
            <aside aria-label="Lo último de la sección" className="hero-rail">
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
          <SectionHeader title="Más noticias" as="h2" variant="kicker" />
          <div className="grid-dense">
            {grid.map((a, i) => (
              <StoryCard key={a.slug} article={a} size={i === 0 ? "lg" : "md"} showDek={i === 0} wide={i === 0} />
            ))}
          </div>
        </section>
      )}

      {lead && lead.keyFacts.length > 0 && (
        <section aria-label="Lo que sabemos" className="section-space">
          <div className="facts">
            <h2 className="facts-title">Lo que sabemos</h2>
            <p className="facts-ref">{lead.title}</p>
            <ul className="facts-list">
              {lead.keyFacts.map((fact, i) => (
                <li key={i}>
                  <span>{factText(fact)}</span>
                </li>
              ))}
            </ul>
          </div>
        </section>
      )}

      {archive.length > 0 && (
        <section aria-label="Archivo de la sección" className="section-space pb-4" id="archivo">
          <SectionHeader title="Archivo" as="h2" variant="kicker" />
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
