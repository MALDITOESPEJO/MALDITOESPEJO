import { inter, lora, sourceSerif4, libreBaskerville } from "./fonts";

/*
  TYPOGRAPHY TEST — Combinaciones A-D.
  Sans comun inicial: Inter.
  Cada tarjeta muestra el MISMO contenido editorial demo para comparar
  la experiencia completa (categoria, titular, entradilla, cuerpo,
  metadatos y navegacion), no solo muestras aisladas de letras.
*/

const combos = [
  {
    id: "A",
    name: "A · Georgia + Inter",
    serif: "Georgia, 'Times New Roman', serif",
    sans: inter.style.fontFamily,
    note: "Sistema · alta legibilidad · familiar",
  },
  {
    id: "B",
    name: "B · Lora + Inter",
    serif: lora.style.fontFamily,
    sans: inter.style.fontFamily,
    note: "Contemporanea · cuerpo calido",
  },
  {
    id: "C",
    name: "C · Source Serif 4 + Inter",
    serif: sourceSerif4.style.fontFamily,
    sans: inter.style.fontFamily,
    note: "Neutral · precisa · tecnica",
  },
  {
    id: "D",
    name: "D · Libre Baskerville + Inter",
    serif: libreBaskerville.style.fontFamily,
    sans: inter.style.fontFamily,
    note: "Alta personalidad · elegante",
  },
];

const DEMO = {
  category: "Política",
  title: "El Gobierno aprueba la nueva medida y publica el texto definitivo",
  dek: "La nueva norma establece los cambios que entrarán en vigor durante los próximos meses.",
  paragraphs: [
    "Este lunes el Gobierno ha aprobado la nueva medida y ha publicado el texto definitivo de la norma. La decisión se adoptó en la reunión ordinaria del Consejo de Ministros celebrada a primera hora de la mañana.",
    "El texto establece los cambios que entrarán en vigor durante los próximos meses y recoge las disposiciones concretas sobre el procedimiento afectado. El documento completo, con su anexo de aplicación temporal, está accesible en el boletín correspondiente.",
    "La medida se enmarca en un paquete más amplio cuya tramitación legislativa continúa abierta. Fuentes del ministerio han confirmado las fechas de aplicación, pero no han detallado el impacto presupuestario estimado.",
    "Los hechos confirmados se presentan de forma verificable y con el contexto estrictamente necesario. Cualquier información pendiente de confirmación se indicará de manera explícita cuando esté disponible.",
  ],
  metadata: "31 AGOSTO 2026 · 12:32 · 4 MIN",
  nav: "ACTUALIDAD · POLÍTICA · ECONOMÍA · SOCIEDAD · MUNDO · TECNOLOGÍA",
};

function ComboCard({ combo }: { combo: (typeof combos)[number] }) {
  return (
    <article className="flex flex-col gap-6">
      <div className="flex items-baseline justify-between border-b border-border pb-3">
        <h3 className="text-[0.85rem] font-semibold text-ink">{combo.name}</h3>
        <span className="font-display text-[0.8rem] text-accent">{combo.note}</span>
      </div>

      {/* Categoria */}
      <p
        className="text-[0.72rem] font-semibold uppercase tracking-[0.14em]"
        style={{ fontFamily: combo.sans, color: "#C4302B" }}
      >
        {DEMO.category}
      </p>

      {/* Titular */}
      <h2
        style={{ fontFamily: combo.serif, fontSize: "2.1rem", fontWeight: 700, lineHeight: 1.08, letterSpacing: "-0.01em" }}
      >
        {DEMO.title}
      </h2>

      {/* Entradilla */}
      <p
        style={{ fontFamily: combo.sans, fontSize: "1.2rem", lineHeight: 1.5, color: "#141414" }}
      >
        {DEMO.dek}
      </p>

      {/* Cuerpo */}
      <div
        className="space-y-4"
        style={{ fontFamily: combo.sans, fontSize: "1.02rem", lineHeight: 1.72, color: "#141414" }}
      >
        {DEMO.paragraphs.map((p, i) => (
          <p key={i}>{p}</p>
        ))}
      </div>

      {/* Metadata */}
      <p
        className="mt-1 border-t border-border pt-3"
        style={{ fontFamily: combo.sans, fontSize: "0.78rem", letterSpacing: "0.04em", color: "#6D6D6D" }}
      >
        {DEMO.metadata}
      </p>

      {/* Navegacion */}
      <p style={{ fontFamily: combo.sans, fontSize: "0.72rem", fontWeight: 600, letterSpacing: "0.1em", color: "#6D6D6D" }}>
        {DEMO.nav}
      </p>
    </article>
  );
}

export function TypographyTest() {
  return (
    <div>
      <div className="mb-8 grid grid-cols-1 gap-10 lg:grid-cols-2 2xl:grid-cols-4">
        {combos.map((combo) => (
          <ComboCard key={combo.id} combo={combo} />
        ))}
      </div>
      <p className="max-w-2xl text-xs leading-relaxed text-muted">
        Criterio de selección: legibilidad, personalidad, autoridad editorial,
        lectura en pantalla, titulares grandes y pequeños, cuerpo, móvil,
        diferenciación y coherencia con MALDITOESPEJO. Contenido de
        demostración ficticio.
      </p>
    </div>
  );
}
