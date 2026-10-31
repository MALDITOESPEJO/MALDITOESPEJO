import type { Article, Section } from "@/data/types";
import { SectionHeader } from "@/components/ui/SectionHeader";
import { StoryCard } from "@/components/editorial/StoryCard";

interface SectionStripProps {
  section: Section;
  /** Articulos de la seccion, del mas reciente al mas antiguo. */
  items: Article[];
}

/**
 * Tira por seccion: una historia con imagen a la izquierda y las siguientes
 * como titulares compactos a la derecha. Densa, sin relleno.
 */
export function SectionStrip({ section, items }: SectionStripProps) {
  if (items.length === 0) return null;
  const [first, ...rest] = items;

  return (
    <section aria-label={section.name} className="section-space">
      <SectionHeader title={section.name} as="h2" variant="kicker" href={section.url} />
      <div className="strip">
        <StoryCard article={first} size="md" showDek />
        {rest.length > 0 && (
          <ul className="strip-list">
            {rest.map((a) => (
              <li key={a.slug}>
                <StoryCard article={a} size="sm" showImage={false} />
              </li>
            ))}
          </ul>
        )}
      </div>
    </section>
  );
}
