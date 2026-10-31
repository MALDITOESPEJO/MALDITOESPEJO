import Link from "next/link";

import { sectionName } from "@/data/sections";

interface CategoryLabelProps {
  slug: string;
  className?: string;
}

export function CategoryLabel({ slug, className = "" }: CategoryLabelProps) {
  return (
    <Link href={`/${slug}`} className={`kicker hover:underline ${className}`}>
      {sectionName(slug)}
    </Link>
  );
}
