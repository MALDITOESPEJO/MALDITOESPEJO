import Link from "next/link";

import { sectionName } from "@/data/sections";

interface CategoryLabelProps {
  slug: string;
  className?: string;
}

export function CategoryLabel({ slug, className = "" }: CategoryLabelProps) {
  return (
    <Link
      href={`/${slug}`}
      className={`inline-block text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent ${className}`}
    >
      {sectionName(slug)}
    </Link>
  );
}
