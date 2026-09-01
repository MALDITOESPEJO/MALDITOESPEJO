import type { Metadata } from "next";

import { articles } from "@/data/articles";
import { sortByNewest } from "@/lib/utils";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { LatestItem } from "@/components/editorial/LatestItem";

export const metadata: Metadata = {
  title: "Lo último",
  description:
    "Lo último de MALDITOESPEJO. Flujo cronológico de toda la información, ordenado por hora: qué está ocurriendo ahora mismo, solo hechos.",
  alternates: { canonical: "/lo-ultimo" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Lo último — MALDITOESPEJO",
    description:
      "Flujo cronológico de toda la información, ordenado por hora. Solo hechos.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Lo último — MALDITOESPEJO",
    description:
      "Flujo cronológico de toda la información, ordenado por hora. Solo hechos.",
  },
};

/* Flujo cronologico general (todas las categorias), de mas reciente
   a mas antiguo. Prioridad: tiempo -> informacion. Sin historia principal.
   No fija un numero de entradas: muestra todo el contenido disponible. */
const byNewest = sortByNewest(articles);

export default function LoUltimoPage() {
  return (
    <div className="container-editorial">
      <p className="mt-6 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-faint">
        <span className="mr-2 inline-block border border-border-strong px-1.5 py-0.5 text-accent">
          DEMO
        </span>
        Contenido ficticio de demostración del sistema visual
      </p>

      {/* LISTA CRONOLOGICA */}
      <section aria-label="Lo último" className="section-space">
        <SectionHeader title="Lo último" eyebrow="En este momento" />
        <ol className="mt-8 max-w-2xl">
          {byNewest.map((a) => (
            <LatestItem key={a.slug} article={a} />
          ))}
        </ol>
      </section>
    </div>
  );
}
