import { inter } from "./fonts";

const sans = inter.style.fontFamily;

/*
  Variantes de wordmark para evaluar tamano/peso/tracking.
  Estructura fija: MALDITO en ink + ESPEJO en accent. Sin simbolos.
*/

const variants = [
  {
    label: "Actual · black · tracking 0.04em",
    fontWeight: 900,
    letterSpacing: "0.04em",
    fontSize: "1.15rem",
  },
  {
    label: "Tighter · black · tracking 0.01em",
    fontWeight: 900,
    letterSpacing: "0.01em",
    fontSize: "1.15rem",
  },
  {
    label: "Wider · black · tracking 0.08em",
    fontWeight: 900,
    letterSpacing: "0.08em",
    fontSize: "1.15rem",
  },
  {
    label: "Semibold · tracking 0.04em",
    fontWeight: 700,
    letterSpacing: "0.04em",
    fontSize: "1.15rem",
  },
];

export function WordmarkVariants() {
  return (
    <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
      {variants.map((v) => (
        <div key={v.label} className="border border-border bg-background p-6">
          <p className="mb-4 text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-faint">
            {v.label}
          </p>
          <p
            style={{
              fontFamily: sans,
              fontSize: v.fontSize,
              fontWeight: v.fontWeight,
              textTransform: "uppercase",
              letterSpacing: v.letterSpacing,
              lineHeight: 1,
            }}
          >
            MALDITO<span style={{ color: "#C4302B" }}>ESPEJO</span>
          </p>
        </div>
      ))}
    </div>
  );
}
