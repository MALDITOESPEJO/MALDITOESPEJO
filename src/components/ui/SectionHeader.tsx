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
  if (variant === "kicker") {
    const Tag = Heading as ElementType;
    return (
      <Tag className="mb-5 flex items-center gap-3 text-[0.78rem] font-semibold uppercase tracking-[0.16em] text-accent">
        <span>{title}</span>
        <span aria-hidden="true" className="h-px flex-1 bg-border" />
      </Tag>
    );
  }

  const Tag = Heading as ElementType;
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
