import type { Metadata } from "next";

import { articles } from "@/data/articles";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";
import { KeyFacts } from "@/components/article/KeyFacts";

export const metadata: Metadata = {
  title: { absolute: "MALDITOESPEJO — Solo hechos" },
  description:
    "MALDITOESPEJO es un medio de información basado exclusivamente en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
  alternates: { canonical: "/" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "MALDITOESPEJO — Solo hechos",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "MALDITOESPEJO — Solo hechos",
    description: "Información basada en hechos, datos y declaraciones atribuibles.",
  },
};

const byNewest = sortByNewest(articles);
const featured = byNewest[0];
const masNoticias = byNewest.slice(1, 7);
const lead = masNoticias[0];
const grid = masNoticias.slice(1);
const loUltimo = byNewest.slice(1);

export default function HomePage() {
  return (
    <div className="container-editorial">
      {featured && (
        <section aria-label="Noticia principal" className="section-space">
          <FeaturedStory article={featured} as="h1" />
        </section>
      )}

      {lead && (
        <section aria-label="Más noticias" className="section-space" id="mas-noticias">
          <SectionHeader title="Más noticias" as="h2" variant="kicker" />
          <div className="mt-8 space-y-12">
            <StoryCard article={lead} size="lg" showDek />
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
              {grid.slice(0, 2).map((a) => (
                <StoryCard key={a.slug} article={a} size="md" />
              ))}
            </div>
            <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
              {grid.slice(2, 5).map((a) => (
                <StoryCard key={a.slug} article={a} size="sm" />
              ))}
            </div>
          </div>
        </section>
      )}

      <section aria-label="Lo último" className="section-space" id="lo-ultimo">
        <SectionHeader title="Lo último" as="h2" variant="kicker" />
        <ol className="mt-6 max-w-2xl">
          {loUltimo.map((a) => (
            <LatestItem key={a.slug} article={a} />
          ))}
        </ol>
      </section>

      {featured && featured.keyFacts.length > 0 && (
        <section aria-label="Lo que sabemos" className="section-space" id="lo-que-sabemos">
          <SectionHeader title="Lo que sabemos" as="h2" variant="kicker" />
          <div className="mt-6 max-w-2xl">
            <KeyFacts facts={featured.keyFacts} />
          </div>
        </section>
      )}
    </div>
  );
}
