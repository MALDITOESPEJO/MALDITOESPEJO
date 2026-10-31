import Link from "next/link";
import type { ElementType } from "react";

interface SectionHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  /** Elemento de encabezado. Por defecto h1 (pagina independiente). */
  as?: "h1" | "h2" | "h3";
  /** kicker: banda de bloque editorial, subordinada a la historia principal. */
  variant?: "page" | "kicker";
  /** Solo en la banda: enlace "Ver todo" a la derecha. */
  href?: string;
  moreLabel?: string;
}

export function SectionHeader({
  title,
  eyebrow,
  description,
  as: Heading = "h1",
  variant = "page",
  href,
  moreLabel = "Ver todo →",
}: SectionHeaderProps) {
  const Tag = Heading as ElementType;

  if (variant === "kicker") {
    return (
      <div className="band">
        <Tag className="band-title">{title}</Tag>
        {href && (
          <Link href={href} className="band-more">
            {moreLabel}
          </Link>
        )}
      </div>
    );
  }

  return (
    <div className="page-title">
      {eyebrow && <p className="kicker mb-3">{eyebrow}</p>}
      <Tag className="headline-display">{title}</Tag>
      {description && <p className="dek mt-4 max-w-xl">{description}</p>}
    </div>
  );
}
