import type { ElementType } from "react";

interface UnknownFactsProps {
  facts: string[];
  /** Nivel de encabezado. h3 por defecto; usar h2 como bloque de página de artículo. */
  as?: "h2" | "h3";
}

/** "LO QUE NO SABEMOS": información pendiente de confirmación. Solo si existe. */
export function UnknownFacts({ facts, as: Heading = "h3" }: UnknownFactsProps) {
  if (facts.length === 0) {
    return null;
  }
  const HeadingTag = Heading as ElementType;
  return (
    <section aria-label="Lo que no sabemos" className="unknown">
      <HeadingTag className="art-label">Lo que no sabemos</HeadingTag>
      <ul>
        {facts.map((fact, i) => (
          <li key={i}>{fact}</li>
        ))}
      </ul>
    </section>
  );
}
