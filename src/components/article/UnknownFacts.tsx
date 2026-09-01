import type { ElementType } from "react";

interface UnknownFactsProps {
  facts: string[];
  /** Nivel de encabezado. h3 por defecto; usar h2 como bloque de pagina de articulo. */
  as?: "h2" | "h3";
}

/**
 * "LO QUE NO SABEMOS"
 * Informacion objetivamente pendiente de confirmacion.
 * Solo se usa cuando existen cuestiones pendientes; nunca como
 * recurso decorativo.
 */
export function UnknownFacts({ facts, as: Heading = "h3" }: UnknownFactsProps) {
  if (facts.length === 0) {
    return null;
  }

  const HeadingTag = Heading as ElementType;

  return (
    <section aria-label="Lo que no sabemos" className="my-8 border-l-2 border-border-strong pl-5">
      <HeadingTag className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-muted">
        Lo que no sabemos
      </HeadingTag>
      <ul className="mt-4 space-y-3">
        {facts.map((fact, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-muted" />
            <span className="text-[1.02rem] leading-relaxed text-ink">
              {fact}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
