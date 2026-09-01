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
    <section aria-labelledby="relacionados-titulo" className="mt-16 border-t border-border pt-10">
      <SectionHeader title="Más sobre este tema" as="h2" variant="kicker" />
      <div className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {related.map((item) => (
          <StoryCard key={item.slug} article={item} size="sm" showDek />
        ))}
      </div>
    </section>
  );
}
