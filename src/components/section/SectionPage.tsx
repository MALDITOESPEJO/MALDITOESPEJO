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

/**
 * Pagina de seccion editorial (reutilizada por las 6 secciones).
 * Estructura SOLO HECHOS:
 *   H1 = nombre de seccion
 *   HISTORIA PRINCIPAL (FeaturedStory, h2)
 *   MAS NOTICIAS (StoryCards, jerarquia descendente)
 *   LO ULTIMO (LatestItem, lista cronologica)
 *   LO QUE SABEMOS (KeyFacts del lead, solo si hay datos)
 * Sin imagenes decorativas, sin opinion ni analisis.
 */
export function SectionPage({ sectionSlug }: SectionPageProps) {
  const section = getSection(sectionSlug);
  if (!section) {
    return null;
  }

  const byNewest = sortByNewest(
    articles.filter((a) => a.section === sectionSlug)
  );
  // HERO = noticia principal de la seccion.
  const lead = byNewest[0];
  // MAS NOTICIAS = las siguientes tras el hero (hasta 5 tarjetas).
  const masNoticias = byNewest.slice(1, 6);
  // LO ULTIMO = el resto de la seccion, SIN repetir hero ni mas noticias.
  // Garantiza modulos disjuntos: Hero, MasNoticias y LoUltimo no se solapan.
  const loUltimo = byNewest.slice(6);
  const leadFacts = lead?.keyFacts;

  return (
    <div className="container-editorial">
      {/* Nota de contenido de demostracion */}
      <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-faint">
        <span className="mr-2 inline-block border border-border-strong px-1.5 py-0.5 text-accent">
          DEMO
        </span>
        Contenido ficticio de demostración del sistema visual
      </p>

      {/* SECCION */}
      <section aria-label={section.name} className="section-space">
        <SectionHeader title={section.name} eyebrow="Sección" />
      </section>

      {/* HISTORIA PRINCIPAL */}
      {lead && (
        <section aria-label="Noticia principal" className="section-space">
          <FeaturedStory article={lead} as="h2" />
        </section>
      )}

      {/* MAS NOTICIAS */}
      {masNoticias.length > 0 && (
        <section
          aria-label="Más noticias"
          className="section-space"
          id="mas-noticias"
        >
          <SectionHeader title="Más noticias" as="h2" variant="kicker" />
          <div className="mt-8 space-y-10">
            <StoryCard article={masNoticias[0]} size="lg" showDek />
            {masNoticias.length > 1 && (
              <div className="grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
                {masNoticias.slice(1).map((a, i) => (
                  <StoryCard
                    key={a.slug}
                    article={a}
                    size={i === 0 ? "md" : "sm"}
                  />
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* LO ULTIMO */}
      {loUltimo.length > 0 && (
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
      )}

      {/* LO QUE SABEMOS */}
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
