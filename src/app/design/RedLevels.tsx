import { inter } from "./fonts";

const sans = inter.style.fontFamily;

/* Tres niveles de uso del rojo de marca, para valorar cuanta
   presencia necesita la identidad. Hipotesis inicial: Nivel 1 o 2. */

function Wordmark({ accent }: { accent: boolean }) {
  return (
    <p
      style={{
        fontFamily: sans,
        fontSize: "1rem",
        fontWeight: 900,
        textTransform: "uppercase",
        letterSpacing: "0.04em",
      }}
    >
      MALDITO<span style={accent ? { color: "#C4302B" } : undefined}>ESPEJO</span>
    </p>
  );
}

function Story({ redLabel, redTitle, redRule }: { redLabel: boolean; redTitle: boolean; redRule: boolean }) {
  return (
    <div className="border-t border-border pt-3">
      <p
        style={{
          fontFamily: sans,
          fontSize: "0.65rem",
          fontWeight: 600,
          textTransform: "uppercase",
          letterSpacing: "0.14em",
          color: redLabel ? "#C4302B" : "#6D6D6D",
        }}
      >
        Política
      </p>
      <p
        style={{
          fontFamily: "Georgia, serif",
          fontSize: "1rem",
          fontWeight: 700,
          lineHeight: 1.2,
          marginTop: "0.35rem",
          color: redTitle ? "#C4302B" : "#141414",
        }}
      >
        El Gobierno aprueba la nueva medida y publica el texto definitivo
      </p>
      <div
        style={{
          marginTop: "0.5rem",
          height: "2px",
          width: "100%",
          background: redRule ? "#C4302B" : "#E4E4E2",
        }}
      />
    </div>
  );
}

interface Level {
  tag: string;
  title: string;
  desc: string;
  redLabel: boolean;
  redTitle: boolean;
  redRule: boolean;
}

const levels: Level[] = [
  {
    tag: "Nivel 1 · mínimo",
    title: "Solo marca + detalles puntuales",
    desc: "El rojo aparece únicamente en ESPEJO, etiquetas muy puntuales y estados interactivos. Máxima sobriedad.",
    redLabel: false,
    redTitle: false,
    redRule: false,
  },
  {
    tag: "Nivel 2 · moderado",
    title: "Marca + categorías + elementos",
    desc: "Rojo en ESPEJO, en las categorías y en pequeñas marcas editoriales. Información siempre protagónica.",
    redLabel: true,
    redTitle: false,
    redRule: true,
  },
  {
    tag: "Nivel 3 · alto",
    title: "Uso mucho más visible",
    desc: "Notoriedad mayor: categorías, titulares y reglas en rojo. Se aleja de la sobriedad buscada.",
    redLabel: true,
    redTitle: true,
    redRule: true,
  },
];

export function RedLevels() {
  return (
    <div>
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {levels.map((lvl) => (
          <div key={lvl.tag} className="border border-border bg-surface p-6">
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent">
              {lvl.tag}
            </p>
            <p className="mt-1 text-[0.95rem] font-semibold text-ink">{lvl.title}</p>
            <p className="mt-2 text-[0.82rem] leading-relaxed text-muted">{lvl.desc}</p>

            <div className="mt-6 rounded-sm bg-background p-4">
              <Wordmark accent />
              <div className="mt-4 space-y-4">
                <Story redLabel={lvl.redLabel} redTitle={lvl.redTitle} redRule={lvl.redRule} />
                <Story redLabel={lvl.redLabel} redTitle={lvl.redTitle} redRule={lvl.redRule} />
              </div>
            </div>
          </div>
        ))}
      </div>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-muted">
        Hipótesis: Nivel 1 o Nivel 2. No buscamos Nivel 3. El rojo es{" "}
        <strong className="text-ink">acento</strong>, no color dominante.
      </p>
    </div>
  );
}
