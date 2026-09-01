interface GridInfo {
  label: string;
  note: string;
  cols: number;
}

const info: GridInfo[] = [
  {
    label: "Desktop",
    note: "Contenedor máx. 1180px + gutters 40px. 12 columnas. Aire sin vacío.",
    cols: 12,
  },
  {
    label: "Tablet",
    note: "Gutters 32px. La portada pasa a 2 columnas para noticias secundarias.",
    cols: 6,
  },
  {
    label: "Mobile",
    note: "Gutters 20px. Una sola columna. Prioridad: titular → hecho → lectura.",
    cols: 1,
  },
];

interface GridRowProps {
  field: string;
  active: boolean;
  label: string;
}

function GridRow({ field, active, label }: GridRowProps) {
  return (
    <div className="flex items-center gap-3 text-sm text-muted">
      <span
        className={`h-2.5 w-2.5 shrink-0 rounded-full ${
          active ? "bg-accent" : "bg-border-strong"
        }`}
      />
      <span className={active ? "font-medium text-ink" : ""}>{label}</span>
      <span className="ml-auto font-mono text-[0.8rem] text-faint">{field}</span>
    </div>
  );
}

export function GridShowcase() {
  return (
    <div className="space-y-10">
      {/* Reglas del grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {info.map((g) => (
          <div key={g.label} className="border border-border bg-surface p-6">
            <div className="flex items-baseline justify-between">
              <h3 className="text-[0.8rem] font-semibold uppercase tracking-[0.1em] text-ink">
                {g.label}
              </h3>
              <span className="text-2xl font-display font-bold text-accent">
                {g.cols}
              </span>
            </div>
            <p className="mt-2 text-[0.85rem] leading-relaxed text-muted">
              {g.note}
            </p>
            <div className="mt-4">
              <GridRow field="máx 1200px" active={g.label === "Desktop"} label="Ancho máximo" />
              <GridRow field="1.25–2.5rem" active label="Gutters" />
              <GridRow field="14px" active label="Col-gap base" />
            </div>
          </div>
        ))}
      </div>

      {/* Columnas visibles */}
      <div className="space-y-2">
        <p className="text-xs text-muted">
          Columnas del grid, con col-gap visible (ajusta la ventana para ver
          cada comportamiento):
        </p>

        {/* Desktop / tablet (grid responsive) */}
        <div className="grid grid-cols-2 gap-[14px] md:grid-cols-6 lg:grid-cols-12">
          {Array.from({ length: 12 }).map((_, i) => (
            <div
              key={i}
              className="hidden h-10 items-center justify-center border border-dashed border-border-strong bg-surface text-[0.7rem] text-faint lg:flex"
            >
              {i + 1}
            </div>
          ))}
          {Array.from({ length: 4 }).map((_, i) => (
            <div
              key={`m-${i}`}
              className="hidden h-10 items-center justify-center border border-dashed border-border-strong text-[0.7rem] text-faint md:flex lg:hidden"
            >
              {i + 1}
            </div>
          ))}
          {Array.from({ length: 1 }).map((_, i) => (
            <div
              key={`s-${i}`}
              className="flex h-10 items-center justify-center border border-dashed border-border-strong text-[0.7rem] text-faint md:hidden"
            >
              1 col
            </div>
          ))}
        </div>
      </div>

      {/* Aplicacion: jerarquia portada */}
      <div className="pt-4">
        <p className="mb-4 text-xs text-muted">
          Aplicación editorial — 1 principal · 4 secundarias · últimas (en una
          sola columna de lectura):
        </p>
        <div className="grid grid-cols-1 gap-[14px] md:grid-cols-2 lg:grid-cols-4">
          <div className="grid grid-cols-1 gap-[14px] lg:col-span-2">
            <div className="flex h-40 items-center border border-border bg-background px-4 text-sm font-medium text-ink">
              Historia principal (span 2)
            </div>
            <div className="flex h-24 items-center border border-border bg-background px-4 text-sm text-muted">
              Secundaria
            </div>
          </div>
          <div className="flex h-40 items-center border border-border bg-background px-4 text-sm text-muted">
            Secundaria
          </div>
          <div className="flex h-40 items-center border border-border bg-background px-4 text-sm text-muted">
            Secundaria
          </div>
        </div>
      </div>
    </div>
  );
}
