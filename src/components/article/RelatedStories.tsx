import type { Article } from "@/data/types";
import { getArticleBySlug } from "@/data/articles";
import { StoryCard } from "@/components/editorial/StoryCard";
import { SectionHeader } from "@/components/ui/SectionHeader";

interface RelatedStoriesProps {
  article: Article;
}

/**
 * MAS SOBRE ESTE TEMA. Relacion editorial explicita (no algoritmica),
 * limitada a un maximo de 4. Los slugs inexistentes se omiten para no
 * generar enlaces rotos.
 */
export function RelatedStories({ article }: RelatedStoriesProps) {
  const related = (article.relatedArticles ?? [])
    .map((slug) => getArticleBySlug(slug))
    .filter((a): a is Article => Boolean(a))
    .slice(0, 4);

  if (related.length === 0) {
    return null;
  }

  return (
    <section aria-label="Más sobre este tema" className="related">
      <SectionHeader title="Más sobre este tema" as="h2" variant="kicker" />
      <div className="grid-dense related-grid">
        {related.map((item) => (
          <StoryCard key={item.slug} article={item} size="md" />
        ))}
      </div>
    </section>
  );
}
