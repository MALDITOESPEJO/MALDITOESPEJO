import type { ElementType } from "react";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  /** Elemento de encabezado. Por defecto h1 (pagina independiente). */
  as?: "h1" | "h2" | "h3";
  /** kicker: etiqueta de bloque editorial, subordinada a la historia principal. */
  variant?: "page" | "kicker";
}

export function SectionHeader({
  title,
  eyebrow,
  description,
  as: Heading = "h1",
  variant = "page",
}: SectionHeaderProps) {
  const Tag = Heading as ElementType;

  if (variant === "kicker") {
    return (
      <Tag className="m-0 text-[0.72rem] font-bold uppercase tracking-[0.15em] text-ink">
        {title}
      </Tag>
    );
  }

  return (
    <div className="border-b border-border pb-6">
      {eyebrow && (
        <p className="mb-2 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent">
          {eyebrow}
        </p>
      )}
      <Tag className="headline-display text-[2rem] leading-none text-ink md:text-[2.75rem]">
        {title}
      </Tag>
      {description && <p className="dek mt-4 max-w-xl">{description}</p>}
    </div>
  );
}
