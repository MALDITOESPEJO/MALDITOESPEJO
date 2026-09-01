import type { CSSProperties } from "react";

import {
  inter,
  ibmPlexSans,
  sourceSans3,
  lora,
  sourceSerif4,
  libreBaskerville,
} from "./fonts";

const serifCandidates = [
  { label: "Georgia (sistema)", fontFamily: "Georgia, 'Times New Roman', serif" },
  { label: "Lora", fontFamily: lora.style.fontFamily },
  { label: "Source Serif 4", fontFamily: sourceSerif4.style.fontFamily },
  { label: "Libre Baskerville", fontFamily: libreBaskerville.style.fontFamily },
];

const sansCandidates = [
  { label: "Inter", fontFamily: inter.style.fontFamily },
  { label: "IBM Plex Sans", fontFamily: ibmPlexSans.style.fontFamily },
  { label: "Source Sans 3", fontFamily: sourceSans3.style.fontFamily },
];

interface SpecimenProps {
  label: string;
  style: CSSProperties;
}

function Specimen({ label, style }: SpecimenProps) {
  return (
    <div className="border border-border bg-background p-6 md:p-8">
      <p className="mb-5 text-[0.7rem] font-semibold uppercase tracking-[0.14em] text-accent">
        {label}
      </p>

      <div style={style}>
        <p className="mt-2 text-sm text-faint">
          Entradilla · La medida fue aprobada este lunes y entra en vigor el 1
          de enero.
        </p>
        <p className="mt-1 text-xs text-faint">
          Metadatos · 31 de agosto de 2026 · MALDITOESPEJO
        </p>
        <div className="mt-6">
          <p style={{ fontSize: "2rem", fontWeight: 700, lineHeight: 1.1 }}>
            El Gobierno anuncia una nueva medida
          </p>
        </div>
        <div className="mt-6">
          <p style={{ fontSize: "1.25rem", fontWeight: 700, lineHeight: 1.2 }}>
            La inflación baja al 2,4% en agosto
          </p>
        </div>
        <p className="mt-6" style={{ fontSize: "1.0625rem", lineHeight: 1.75 }}>
          Cuerpo de lectura del artículo. Los hechos confirmados se presentan
          de forma verificable, con el contexto estrictamente necesario para
          comprender lo ocurrido. Sin interpretación ni opinión del periodista.
        </p>
      </div>

      <div className="mt-6 border-t border-border pt-4">
        <p className="text-sm" style={{ ...style, fontWeight: 600 }}>
          Navegación · Actualidad &nbsp;·&nbsp; Política &nbsp;·&nbsp; Economía
        </p>
      </div>
    </div>
  );
}

export function TypographySpecimen() {
  return (
    <div className="space-y-10">
      <section>
        <h3 className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Serif — Titulares
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-2">
          {serifCandidates.map((f) => (
            <Specimen key={f.label} label={f.label} style={{ fontFamily: f.fontFamily }} />
          ))}
        </div>
      </section>

      <section>
        <h3 className="mb-4 text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">
          Sans — Interfaz / navegación / metadatos
        </h3>
        <div className="grid grid-cols-1 gap-6 md:grid-cols-3">
          {sansCandidates.map((f) => (
            <Specimen key={f.label} label={f.label} style={{ fontFamily: f.fontFamily }} />
          ))}
        </div>
      </section>
    </div>
  );
}
