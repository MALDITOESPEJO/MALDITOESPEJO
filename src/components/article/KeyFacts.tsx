import type { ElementType } from "react";
import { factText } from "@/lib/markdown";

interface KeyFactsProps {
  title?: string;
  facts: string[];
  /** Nivel de encabezado. h3 por defecto; usar h2 como bloque de página de artículo. */
  as?: "h2" | "h3";
}

/** "LO QUE SABEMOS": hechos confirmados en bloque negro numerado. Sin interpretar. */
export function KeyFacts({ title = "Lo que sabemos", facts, as: Heading = "h3" }: KeyFactsProps) {
  const HeadingTag = Heading as ElementType;
  return (
    <section aria-label={title} className="facts facts-compact">
      <HeadingTag className="facts-title">{title}</HeadingTag>
      <ul className="facts-list">
        {facts.map((fact, i) => (
          <li key={i}>
            <span>{factText(fact)}</span>
          </li>
        ))}
      </ul>
    </section>
  );
}
