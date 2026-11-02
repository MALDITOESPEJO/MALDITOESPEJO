import type { Metadata } from "next";

import { articles } from "@/data/articles";
import { sortByNewest } from "@/lib/utils";
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

/* Agrupa por día (YYYY-MM-DD) conservando el orden cronológico inverso. */
const days: { day: string; items: typeof byNewest }[] = [];
for (const a of byNewest) {
  const day = a.publishedAt.slice(0, 10);
  const last = days[days.length - 1];
  if (last && last.day === day) last.items.push(a);
  else days.push({ day, items: [a] });
}

function dayLabel(day: string): string {
  const [y, m, d] = day.split("-").map(Number);
  return new Date(Date.UTC(y, m - 1, d)).toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
    timeZone: "UTC",
  });
}

export default function LoUltimoPage() {
  return (
    <div className="theme-dark">
    <div className="container-editorial">
      <div className="w-page-head">
        <p className="sec-page-count">En este momento</p>
        <h1 className="sec-page-title">Lo último</h1>
      </div>

      {days.map(({ day, items }) => (
        <section key={day} aria-label={dayLabel(day)} className="section-space">
          <div className="band">
            <h2 className="band-title">{dayLabel(day)}</h2>
            <span className="band-more band-count">{items.length}</span>
          </div>
          <ol className="dense-list">
            {items.map((a) => (
              <LatestItem key={a.slug} article={a} />
            ))}
          </ol>
        </section>
      ))}
    </div>
    </div>
  );
}
