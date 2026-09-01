import type { Metadata } from "next";

import { articles } from "@/data/articles";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";
import { KeyFacts } from "@/components/article/KeyFacts";
import { NewsletterBlock } from "@/components/editorial/NewsletterBlock";

export const metadata: Metadata = {
  title: {
    absolute: "MALDITOESPEJO — Solo hechos",
  },
  description:
    "MALDITOESPEJO es un medio de información basado exclusivamente en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
  alternates: {
    canonical: "/",
  },
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
    description:
      "Información basada en hechos, datos y declaraciones atribuibles.",
  },
};

/* Portada. Contenido de demostracion (ficticio), reutilizando
   componentes editoriales. Solo hechos: sin opinion ni analisis. */
const byNewest = sortByNewest(articles);
const featured = byNewest[0];
const masNoticias = byNewest.slice(1, 7);
const lead = masNoticias[0];
const grid = masNoticias.slice(1);
const loUltimo = byNewest.slice(1);

export default function HomePage() {
  return (
    <div className="container-editorial">
      {/* Nota de contenido de demostracion */}
      <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-faint">
        <span className="mr-2 inline-block border border-border-strong px-1.5 py-0.5 text-accent">
          DEMO
        </span>
        Contenido ficticio de demostración del sistema visual
      </p>

      {/* HISTORIA PRINCIPAL */}
      <section aria-label="Noticia principal" className="section-space">
        <FeaturedStory article={featured} as="h1" />
      </section>

      {/* MAS NOTICIAS */}
      <section
        aria-label="Más noticias"
        className="section-space"
        id="mas-noticias"
      >
        <SectionHeader title="Más noticias" as="h2" variant="kicker" />
        <div className="mt-8 space-y-12">
          {/* Noticia destacada de la seccion */}
          <StoryCard article={lead} size="lg" showDek />

          {/* Grid con dos noticias */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2">
            {grid.slice(0, 2).map((a) => (
              <StoryCard key={a.slug} article={a} size="md" />
            ))}
          </div>

          {/* Grid con tres noticias */}
          <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {grid.slice(2, 5).map((a) => (
              <StoryCard key={a.slug} article={a} size="sm" />
            ))}
          </div>
        </div>
      </section>

      {/* LO ULTIMO */}
      <section
        aria-label="Lo último"
        className="section-space"
        id="lo-ultimo"
      >
        <SectionHeader title="Lo último" as="h2" variant="kicker" />
        <ol className="mt-6 max-w-2xl">
          {loUltimo.map((a) => (
            <LatestItem key={a.slug} article={a} />
          ))}
        </ol>
      </section>

      {/* LO QUE SABEMOS */}
      <section
        aria-label="Lo que sabemos"
        className="section-space"
        id="lo-que-sabemos"
      >
        <SectionHeader title="Lo que sabemos" as="h2" variant="kicker" />
        <div className="mt-6 max-w-2xl">
          <p className="mb-2 text-[0.82rem] text-muted">
            Hechos confirmados sobre la medida aprobada hoy.
            <span className="ml-2 text-faint">31 AGOSTO 2026</span>
          </p>
          <KeyFacts facts={featured.keyFacts} />
        </div>
      </section>

      {/* NEWSLETTER */}
      <section
        aria-label="Boletín"
        className="section-space"
        id="newsletter"
      >
        <NewsletterBlock />
      </section>
    </div>
  );
}
