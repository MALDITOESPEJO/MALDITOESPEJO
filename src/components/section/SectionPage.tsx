import { articles } from "@/data/articles";
import { getSection } from "@/data/sections";
import type { SectionSlug } from "@/data/types";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";
import { KeyFacts } from "@/components/article/KeyFacts";

interface SectionPageProps {
  sectionSlug: SectionSlug;
}

export function SectionPage({ sectionSlug }: SectionPageProps) {
  const section = getSection(sectionSlug);
  if (!section) return null;

  const byNewest = sortByNewest(articles.filter((a) => a.section === sectionSlug));
  const lead = byNewest[0];
  const masNoticias = byNewest.slice(1, 6);
  const loUltimo = byNewest.slice(6);
  const leadFacts = lead?.keyFacts;

  return (
    <div className="container-editorial">
      <section aria-label={section.name} className="section-space">
        <SectionHeader title={section.name} eyebrow="Sección" />
      </section>

      {lead && (
        <section aria-label="Noticia principal" className="section-space">
          <FeaturedStory article={lead} as="h2" />
        </section>
      )}

      {masNoticias.length > 0 && (
        <section aria-label="Más noticias" className="section-space" id="mas-noticias">
          <SectionHeader title="Más noticias" as="h2" variant="kicker" />
          <div className="mt-8 space-y-10">
            <StoryCard article={masNoticias[0]} size="lg" showDek />
            {masNoticias.length > 1 && (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {masNoticias.slice(1).map((a, i) => (
                  <StoryCard key={a.slug} article={a} size={i === 0 ? "md" : "sm"} />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {loUltimo.length > 0 && (
        <section aria-label="Lo último" className="section-space" id="lo-ultimo">
          <SectionHeader title="Lo último" as="h2" variant="kicker" />
          <ol className="mt-6 max-w-2xl">
            {loUltimo.map((a) => (
              <LatestItem key={a.slug} article={a} />
            ))}
          </ol>
        </section>
      )}

      {leadFacts && leadFacts.length > 0 && (
        <section aria-label="Lo que sabemos" className="section-space">
          <div className="max-w-2xl">
            <KeyFacts title="Lo que sabemos" facts={leadFacts} as="h2" />
          </div>
        </section>
      )}
    </div>
  );
}
