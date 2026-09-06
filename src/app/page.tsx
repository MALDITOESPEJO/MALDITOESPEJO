import type { Metadata } from "next";
import { articles } from "@/data/articles";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";

export const metadata: Metadata = {
  title: { absolute: "MALDITOESPEJO — Solo hechos" },
  description: "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
  alternates: { canonical: "/" },
  openGraph: { siteName: "MALDITOESPEJO", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles.", type: "website", locale: "es_ES" },
  twitter: { card: "summary", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles." },
};

const byNewest = sortByNewest(articles);
const featured = byNewest[0];
const secondary = byNewest.slice(1, 5);
const latest = byNewest.slice(5);

export default function HomePage() {
  return (
    <div className="container-editorial pb-20 md:pb-28">
      <section className="pt-8 md:pt-10" aria-label="Actualidad">
        <div className="home-rule mb-5 flex items-center justify-between pt-3">
          <span className="text-[.7rem] font-black uppercase tracking-[.12em]">Las noticias de hoy</span>
          <time className="metadata">6 SEP 2026</time>
        </div>
        {featured && <FeaturedStory article={featured} as="h1" />}
      </section>

      {secondary.length > 0 && (
        <section className="mt-10 border-y-2 border-ink py-7 md:mt-14 md:py-9" aria-label="Más noticias">
          <SectionHeader title="Más noticias" as="h2" variant="kicker" />
          <div className="mt-6 grid grid-cols-1 gap-0 md:grid-cols-2 md:divide-x md:divide-border">
            {secondary.map((article, index) => (
              <div key={article.slug} className={`${index % 2 === 0 ? "md:pr-7" : "md:pl-7"} ${index > 0 ? "border-t border-border pt-7 md:border-t-0 md:pt-0" : ""} ${index > 1 ? "md:mt-8 md:border-t md:pt-8" : ""}`}>
                <StoryCard article={article} size="md" showImage showDek />
              </div>
            ))}
          </div>
        </section>
      )}

      <section className="mt-12 md:mt-16" id="lo-ultimo" aria-label="Lo último">
        <div className="home-rule pt-3">
          <SectionHeader title="Lo último" as="h2" variant="kicker" />
        </div>
        <div className="mt-2 max-w-4xl">
          {latest.map((article) => <LatestItem key={article.slug} article={article} />)}
        </div>
      </section>
    </div>
  );
}
