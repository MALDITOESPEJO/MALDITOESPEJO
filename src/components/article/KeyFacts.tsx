import type { ElementType } from "react";

interface KeyFactsProps {
  title?: string;
  facts: string[];
  /** Nivel de encabezado. h3 por defecto; usar h2 como bloque de pagina de articulo. */
  as?: "h2" | "h3";
}

/**
 * "LO QUE SABEMOS"
 * Lista breve de hechos confirmados. No interpreta: solo informa.
 */
export function KeyFacts({
  title = "Lo que sabemos",
  facts,
  as: Heading = "h3",
}: KeyFactsProps) {
  const HeadingTag = Heading as ElementType;
  return (
    <section aria-label={title} className="my-8 border-l-2 border-accent pl-5">
      <HeadingTag className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-accent">
        {title}
      </HeadingTag>
      <ul className="mt-4 space-y-3">
        {facts.map((fact, i) => (
          <li key={i} className="flex gap-3">
            <span aria-hidden="true" className="mt-[0.55em] h-1 w-1 shrink-0 rounded-full bg-ink" />
            <span className="text-[1.02rem] leading-relaxed text-ink">
              {fact}
            </span>
          </li>
        ))}
      </ul>
    </section>
  );
}
