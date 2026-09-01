import type { Metadata } from "next";

import { articles, getArticleBySlug } from "@/data/articles";
import { sortByNewest } from "@/lib/utils";
import { Wordmark } from "@/components/layout/Navigation";
import { CategoryLabel } from "@/components/ui/CategoryLabel";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { FeaturedStory } from "@/components/editorial/FeaturedStory";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";
import { NewsletterBlock } from "@/components/editorial/NewsletterBlock";
import { KeyFacts } from "@/components/article/KeyFacts";
import { UnknownFacts } from "@/components/article/UnknownFacts";

import {
  inter,
  ibmPlexSans,
  sourceSans3,
  lora,
  sourceSerif4,
  libreBaskerville,
} from "./fonts";
import { TypographyTest } from "./TypographyTest";
import { TypographySpecimen } from "./TypographySpecimen";
import { TypeScale } from "./TypeScale";
import { GridShowcase } from "./GridShowcase";
import { RedLevels } from "./RedLevels";
import { DensityShowcase } from "./DensityShowcase";
import { WordmarkVariants } from "./WordmarkVariants";
import { EditorialMockup } from "./EditorialMockup";

export const metadata: Metadata = {
  title: "Sistema de diseño",
  robots: { index: false, follow: false },
};

const byNewest = sortByNewest(articles);
const featured = byNewest[0];
const latest = byNewest.slice(1, 6);
const gridArticles = byNewest.slice(1, 5);
const keyFactsDemo = getArticleBySlug("gobierno-anuncia-medida-demonstracion")!;

const specimenFonts = [
  inter.variable,
  ibmPlexSans.variable,
  sourceSans3.variable,
  lora.variable,
  sourceSerif4.variable,
  libreBaskerville.variable,
].join(" ");

const anchors = [
  { href: "#wordmark", label: "Wordmark" },
  { href: "#typography", label: "Tipografía" },
  { href: "#color", label: "Color" },
  { href: "#grid", label: "Grid" },
  { href: "#density", label: "Densidad" },
];

function Showcase({
  id,
  title,
  children,
}: {
  id?: string;
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section id={id} className="mb-16 scroll-mt-24">
      <h2 className="border-b border-border pb-3 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-faint">
        {title}
      </h2>
      <div className="pt-8">{children}</div>
    </section>
  );
}

export default function DesignPreviewPage() {
  return (
    <div className={specimenFonts}>
      <div className="container-editorial">
        <p className="mt-10 inline-block bg-accent-soft px-3 py-1 text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-accent">
          Ruta de desarrollo — Preview del sistema de diseño
        </p>

        <h1 className="headline-xl mt-4 max-w-3xl text-ink">
          Fundaciones visuales de MALDITOESPEJO
        </h1>
        <p className="dek mt-4 max-w-2xl">
          Evaluación conjunta de identidad, tipografía, color, grid y
          densidad. Todo el contenido es demostración ficticia.
        </p>

        {/* Navegacion por anclas */}
        <nav aria-label="Secciones del sistema de diseño" className="mt-8">
          <ul className="flex flex-wrap gap-x-6 gap-y-2 text-[0.8rem] font-medium text-muted">
            {anchors.map((a) => (
              <li key={a.href}>
                <a href={a.href} className="transition-colors hover:text-accent">
                  {a.label}
                </a>
              </li>
            ))}
          </ul>
        </nav>
      </div>

      <div className="container-editorial mt-14">
        {/* TYPOGRAPHY TEST — comparacion de combinaciones */}
        <Showcase id="typography" title="TYPOGRAPHY TEST — combinaciones (sans común: Inter)">
          <TypographyTest />
        </Showcase>

        {/* Escala tipografica */}
        <Showcase title="Escala tipográfica">
          <TypeScale />
        </Showcase>

        {/* Muestras aisladas (7 alternativas) */}
        <Showcase title="Muestras aisladas de familias (exploración)">
          <TypographySpecimen />
        </Showcase>

        {/* Wordmark */}
        <Showcase id="wordmark" title="Wordmark">
          <div className="bg-surface px-6 py-8">
            <Wordmark />
          </div>
        </Showcase>

        {/* Wordmark variantes */}
        <Showcase title="Wordmark — variantes a evaluar">
          <WordmarkVariants />
        </Showcase>

        {/* Grid */}
        <Showcase id="grid" title="Grid, columnas y flexibilidad">
          <GridShowcase />
        </Showcase>

        {/* Densidad / aire */}
        <Showcase id="density" title="Aire y densidad editorial">
          <DensityShowcase />
        </Showcase>

        {/* Color */}
        <Showcase id="color" title="Color — acento de marca">
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-6">
            {[
              { name: "background", value: "#FFFFFF" },
              { name: "ink", value: "#141414" },
              { name: "muted", value: "#6D6D6D" },
              { name: "border", value: "#E4E4E2" },
              { name: "surface", value: "#F6F6F4" },
              { name: "accent", value: "#C4302B" },
            ].map((c) => (
              <div key={c.name} className="border border-border">
                <div
                  className="h-20 w-full"
                  style={{ backgroundColor: c.value }}
                />
                <div className="p-2 text-xs">
                  <p className="font-medium text-ink">{c.name}</p>
                  <p className="text-faint">{c.value}</p>
                </div>
              </div>
            ))}
          </div>
          <p className="mt-6 max-w-2xl text-sm leading-relaxed text-muted">
            Uso del acento <code className="font-mono text-ink">#C4302B</code>: el
            rojo aparece con moderación, reservado a categorías, pequeños
            elementos editoriales y estados interactivos. Nunca como color
            dominante.
          </p>
        </Showcase>

        {/* Rojo: niveles */}
        <Showcase title="Rojo de marca — tres niveles a valorar">
          <RedLevels />
        </Showcase>

        {/* Jerarquia de portada */}
        <Showcase title="Jerarquía de portada — 1 principal + secundarias + últimas">
          <div className="space-y-12">
            <FeaturedStory article={featured} />
            <div className="grid grid-cols-1 gap-x-10 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {gridArticles.map((a) => (
                <StoryCard key={a.slug} article={a} size="md" />
              ))}
            </div>
          </div>
        </Showcase>

        {/* Lo ultimo */}
        <Showcase title="Lo último — listado cronológico">
          <ol className="max-w-2xl">
            {latest.map((a) => (
              <LatestItem key={a.slug} article={a} />
            ))}
          </ol>
        </Showcase>

        {/* Categoria */}
        <Showcase title="Etiqueta de categoría">
          <CategoryLabel slug="economia" />
        </Showcase>

        {/* Encabezado de seccion */}
        <Showcase title="Encabezado de sección">
          <SectionHeader
            title="Economía"
            eyebrow="Sección"
            description="Datos, cifras y decisiones económicas verificables."
          />
        </Showcase>

        {/* Lo que sabemos / lo que no sabemos */}
        <Showcase title="Lo que sabemos / Lo que no sabemos">
          <div className="grid grid-cols-1 gap-10 lg:grid-cols-2">
            <div>
              <KeyFacts facts={keyFactsDemo.keyFacts} />
            </div>
            <div>
              <UnknownFacts facts={keyFactsDemo.unknownFacts ?? []} />
            </div>
          </div>
        </Showcase>

        {/* Newsletter */}
        <Showcase title="Newsletter integrada">
          <NewsletterBlock />
        </Showcase>

        {/* EDITORIAL MOCKUP */}
        <Showcase id="editorial-mockup" title="EDITORIAL MOCKUP — simulacion de portada (DEMO)">
          <EditorialMockup />
        </Showcase>
      </div>
    </div>
  );
}
