import { lora, inter } from "./fonts";

const serif = lora.style.fontFamily;
const sans = inter.style.fontFamily;

interface Row {
  name: string;
  usage: string;
  sample: string;
  style: React.CSSProperties;
}

const rows: Row[] = [
  {
    name: "Display",
    usage: "Titular principal · portada",
    sample: "El Gobierno anuncia una nueva medida",
    style: {
      fontFamily: serif,
      fontWeight: 700,
      fontSize: "clamp(2.1rem, 6vw, 3.5rem)",
      lineHeight: 1.05,
      letterSpacing: "-0.02em",
    },
  },
  {
    name: "Headline L",
    usage: "Titular secundario / sección",
    sample: "La inflación baja al 2,4% en agosto",
    style: {
      fontFamily: serif,
      fontWeight: 700,
      fontSize: "clamp(1.6rem, 4.5vw, 2.4rem)",
      lineHeight: 1.1,
      letterSpacing: "-0.015em",
    },
  },
  {
    name: "Headline M",
    usage: "Tarjeta / noticia secundaria",
    sample: "Sentencia del Supremo sobre el recurso",
    style: {
      fontFamily: serif,
      fontWeight: 700,
      fontSize: "clamp(1.15rem, 2.8vw, 1.5rem)",
      lineHeight: 1.18,
    },
  },
  {
    name: "Headline S",
    usage: "Titular breve / relacionadas",
    sample: "Población crece un 1,8% en un año",
    style: {
      fontFamily: serif,
      fontWeight: 700,
      fontSize: "clamp(1rem, 2.2vw, 1.15rem)",
      lineHeight: 1.25,
    },
  },
  {
    name: "Body",
    usage: "Cuerpo de artículo / desarrollo",
    sample:
      "El dato, publicado esta mañana, sitúa la tasa un 0,3 puntos por debajo del mes anterior. Los hechos confirmados se presentan de forma verificable.",
    style: {
      fontFamily: sans,
      fontSize: "1.0625rem",
      lineHeight: 1.75,
    },
  },
  {
    name: "Meta",
    usage: "Fecha · hora · autor",
    sample: "31 de agosto de 2026 · 09:00 · MALDITOESPEJO",
    style: {
      fontFamily: sans,
      fontSize: "0.8125rem",
      lineHeight: 1.4,
      color: "#6D6D6D",
    },
  },
  {
    name: "Label",
    usage: "Categoría",
    sample: "POLÍTICA",
    style: {
      fontFamily: sans,
      fontWeight: 600,
      fontSize: "0.72rem",
      letterSpacing: "0.14em",
      textTransform: "uppercase",
      color: "#C4302B",
    },
  },
];

export function TypeScale() {
  return (
    <div className="divide-y divide-border border-y border-border">
      {rows.map((row) => (
        <div key={row.name} className="flex flex-col gap-4 py-6 md:flex-row md:items-start md:gap-8">
          <div className="w-full shrink-0 md:w-48">
            <p className="text-[0.8rem] font-semibold text-ink">{row.name}</p>
            <p className="text-xs text-faint">{row.usage}</p>
          </div>
          <div className="min-w-0 flex-1">
            <p className="text-ink" style={row.style}>
              {row.sample}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}
