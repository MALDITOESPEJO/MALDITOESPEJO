"use client";

import { useState } from "react";
import Link from "next/link";

import { inter, lora, sourceSerif4, libreBaskerville } from "./fonts";
import { articles } from "@/data/articles";
import { sortByNewest } from "@/lib/utils";
import { sections } from "@/data/sections";
import { Wordmark } from "@/components/layout/Navigation";
import { StoryCard } from "@/components/editorial/StoryCard";
import { LatestItem } from "@/components/editorial/LatestItem";
import { KeyFacts } from "@/components/article/KeyFacts";
import { CategoryLabel } from "@/components/ui/CategoryLabel";

/*
  EDITORIAL MOCKUP — simulacion de portada para evaluar el
  lenguaje visual. Contenido DEMO (no es la Home definitiva).

  Sobreponemos --font-display y --font-sans en el wrapper para
  cambiar TODO el sistema tipografico (titulares, navegacion,
  metadatos, cuerpo) sin tocar los componentes existentes, que
  usan estas variables CSS.
*/

type Combo = "A" | "B" | "C" | "D";

const combos: Record<
  Combo,
  { label: string; serif: string; sans: string; name: string }
> = {
  A: {
    label: "A",
    name: "Georgia + Inter",
    serif: "Georgia, 'Times New Roman', Times, serif",
    sans: inter.style.fontFamily,
  },
  B: {
    label: "B",
    name: "Lora + Inter",
    serif: lora.style.fontFamily,
    sans: inter.style.fontFamily,
  },
  C: {
    label: "C",
    name: "Source Serif 4 + Inter",
    serif: sourceSerif4.style.fontFamily,
    sans: inter.style.fontFamily,
  },
  D: {
    label: "D",
    name: "Libre Baskerville + Inter",
    serif: libreBaskerville.style.fontFamily,
    sans: inter.style.fontFamily,
  },
};

const MAIN = {
  title: "El Gobierno aprueba la nueva medida y publica el texto definitivo",
  dek: "La nueva norma entra en vigor durante los próximos meses. El documento oficial, con su anexo de aplicación, ya está publicado y accesible.",
  date: "31 AGOSTO 2026 · 12:32",
  keyFacts: [
    "El Gobierno aprobó la norma este lunes por mayoría.",
    "El texto definitivo fue publicado esta mañana.",
    "La medida entrará en vigor durante los próximos meses.",
    "El procedimiento de aplicación se detalla en el anexo oficial.",
  ],
};

const byNewest = sortByNewest(articles);
const secondary = articles.slice(1, 5);
const latest = byNewest;

function MockupHeader() {
  return (
    <header className="border-b border-border">
      <div className="flex flex-wrap items-center justify-between gap-x-6 gap-y-3 pb-6 pt-2">
        <Wordmark />
        <Link
          href="/search"
          className="text-[0.78rem] font-medium uppercase tracking-[0.06em] text-ink/80 transition-colors hover:text-accent"
        >
          Buscar
        </Link>
      </div>
      <nav aria-label="Secciones" className="border-t border-border">
        <ul className="flex flex-wrap gap-x-6 gap-y-2 py-3.5">
          {sections.map((s) => (
            <li key={s.slug}>
              <Link
                href={s.url}
                className="text-[0.78rem] font-medium uppercase tracking-[0.06em] text-ink/80 transition-colors hover:text-accent"
              >
                {s.name}
              </Link>
            </li>
          ))}
          <li>
            <Link
              href="/lo-ultimo"
              className="text-[0.78rem] font-medium uppercase tracking-[0.06em] text-accent transition-colors hover:text-accent/80"
            >
              Lo último
            </Link>
          </li>
        </ul>
      </nav>
    </header>
  );
}

export function EditorialMockup() {
  const [active, setActive] = useState<Combo>("B");
  const combo = combos[active];

  return (
    <div>
      {/* Selector sencillo */}
      <div className="mb-8 flex flex-wrap items-center gap-3">
        <span className="text-[0.75rem] font-semibold uppercase tracking-[0.12em] text-faint">
          Sistema tipográfico
        </span>
        <div className="flex overflow-hidden rounded-sm border border-border">
          {(Object.keys(combos) as Combo[]).map((key) => (
            <button
              key={key}
              type="button"
              onClick={() => setActive(key)}
              className={`px-4 py-1.5 text-sm font-semibold transition-colors ${
                active === key
                  ? "bg-accent text-white"
                  : "bg-background text-muted hover:text-ink"
              }`}
            >
              {combos[key].label}
            </button>
          ))}
        </div>
        <span className="text-[0.78rem] text-muted">{combo.name}</span>
      </div>

      {/* Simulacion de portada */}
      <div
        className="border border-border bg-background"
        style={
          {
            "--font-display": combo.serif,
            "--font-sans": combo.sans,
            fontFamily: combo.sans,
          } as React.CSSProperties
        }
      >
        {/* Banner DEMO */}
        <div className="bg-accent-soft px-4 py-2 text-center text-[0.68rem] font-semibold uppercase tracking-[0.14em] text-accent">
          Mockup de portada — contenido ficticio de demostración
        </div>

        <div className="px-4 py-6 sm:px-8">
          <MockupHeader />

          {/* HISTORIA PRINCIPAL */}
          <section className="border-b border-border pb-10 pt-8">
            <CategoryLabel slug="politica" className="mb-5" />
            <h2 className="headline-xl max-w-4xl text-ink">{MAIN.title}</h2>
            <p className="dek mt-5 max-w-2xl">{MAIN.dek}</p>
            <p className="metadata mt-5 tabular-nums">{MAIN.date}</p>
          </section>

          {/* CUATRO NOTICIAS SECUNDARIAS */}
          <section aria-label="Noticias secundarias" className="border-b border-border py-10">
            <div className="grid grid-cols-1 gap-x-8 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
              {secondary.map((a) => (
                <StoryCard key={a.slug} article={a} size="md" />
              ))}
            </div>
          </section>

          {/* LO ULTIMO */}
          <section aria-label="Lo último" className="border-b border-border py-10">
            <h3 className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-accent">
              Lo último
            </h3>
            <ol className="mt-4 max-w-2xl">
              {latest.map((a) => (
                <LatestItem key={a.slug} article={a} />
              ))}
            </ol>
          </section>

          {/* LO QUE SABEMOS */}
          <section aria-label="Lo que sabemos" className="py-10">
            <KeyFacts facts={MAIN.keyFacts} />
          </section>

          <p className="border-t border-border pt-5 text-[0.72rem] leading-relaxed text-faint">
            Mockup de evaluación — contenido ficticio. Solo se evalúa el
            lenguaje visual, no los titulares ni los hechos.
          </p>
        </div>
      </div>
    </div>
  );
}
