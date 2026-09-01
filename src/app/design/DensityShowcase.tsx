import { inter, lora } from "./fonts";

const sans = inter.style.fontFamily;
const serif = lora.style.fontFamily;

/*
  DENSIDAD EDITORIAL — alta densidad informativa + baja densidad visual.
  Comparacion de tres estados para calibrar el aire.
*/

function Line({ w }: { w: string }) {
  return (
    <div
      style={{
        height: "7px",
        width: w,
        background: "#141414",
        marginTop: "0.55rem",
      }}
    />
  );
}

function Block({ label, tone, style }: { label: string; tone: string; style: React.CSSProperties }) {
  return (
    <div className="border border-border bg-background" style={style}>
      <p
        style={{
          fontFamily: sans,
          fontSize: "0.68rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.12em",
          color: "#C4302B",
        }}
      >
        {label}
      </p>
      <p
        style={{
          fontFamily: serif,
          fontSize: "0.95rem",
          fontWeight: 700,
          lineHeight: 1.25,
          marginTop: "0.35rem",
        }}
      >
        Titular de noticia en un único bloque editorial
      </p>
      <div className="mt-1">
        <Line w="100%" />
        <Line w="92%" />
      </div>
      <p
        style={{
          fontFamily: sans,
          fontSize: "0.72rem",
          color: "#6D6D6D",
          marginTop: "0.5rem",
        }}
      >
        · 31 ago · {tone}
      </p>
    </div>
  );
}

export function DensityShowcase() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 md:grid-cols-3">
        {/* Demasiado vacio */}
        <div className="rounded-sm border border-border p-4">
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-faint">
            Aire excesivo
          </p>
          <div className="space-y-10">
            <Block label="Política" tone="aire excesivo" style={{ padding: "2rem 2.5rem" }} />
            <Block label="Economía" tone="aire excesivo" style={{ padding: "2rem 2.5rem" }} />
          </div>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted">
            Espacios verticales enormes. Parece vacío, no premium.
          </p>
        </div>

        {/* Densidad equilibrada (objetivo) */}
        <div className="rounded-sm border-2 border-accent p-4">
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent">
            Equilibrio (objetivo)
          </p>
          <div className="space-y-5">
            <Block label="Política" tone="equilibrio" style={{ padding: "1rem" }} />
            <Block label="Economía" tone="equilibrio" style={{ padding: "1rem" }} />
          </div>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted">
            Muchos hechos, pocos elementos decorativos. Cada espacio separa
            jerarquías.
          </p>
        </div>

        {/* Portal saturado */}
        <div className="rounded-sm border border-border p-4">
          <p className="mb-3 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-faint">
            Saturado
          </p>
          <div className="space-y-2">
            <Block label="Política" tone="saturado" style={{ padding: "0.4rem" }} />
            <Block label="Economía" tone="saturado" style={{ padding: "0.4rem" }} />
            <Block label="Sociedad" tone="saturado" style={{ padding: "0.4rem" }} />
            <Block label="Mundo" tone="saturado" style={{ padding: "0.4rem" }} />
          </div>
          <p className="mt-3 text-[0.75rem] leading-relaxed text-muted">
            Todo compite. Sin jerarquía, sin respiro. Portal de 2010.
          </p>
        </div>
      </div>
    </div>
  );
}
