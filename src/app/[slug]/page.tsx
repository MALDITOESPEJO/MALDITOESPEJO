import type { Metadata } from "next";
import { notFound } from "next/navigation";

import { articles, getArticleBySlug } from "@/data/articles";
import type { Article } from "@/data/types";
import { sectionName } from "@/data/sections";
import { ArticleHeader } from "@/components/article/ArticleHeader";
import { ArticleBody } from "@/components/article/ArticleBody";
import { ArticleTimeline } from "@/components/article/ArticleTimeline";
import { ArticleUpdates } from "@/components/article/ArticleUpdates";
import { ArticleSources } from "@/components/article/ArticleSources";
import { RelatedStories } from "@/components/article/RelatedStories";
import { KeyFacts } from "@/components/article/KeyFacts";
import { UnknownFacts } from "@/components/article/UnknownFacts";
import { JsonLd } from "@/components/seo/JsonLd";

interface Props {
  params: Promise<{ slug: string }>;
}

export function generateStaticParams() {
  return articles.map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) {
    return {
      title: "Noticia no encontrada",
      robots: { index: false },
    };
  }

  return {
    title: article.title,
    description: article.dek,
    alternates: { canonical: `/${article.slug}` },
      openGraph: {
        title: article.title,
        description: article.dek,
        url: `/${article.slug}`,
        siteName: "MALDITOESPEJO",
        type: "article",
        publishedTime: article.publishedAt,
        modifiedTime: article.updatedAt ?? article.publishedAt,
        authors: [article.author.name],
        section: sectionName(article.section),
      },
      twitter: {
        card: "summary",
        title: article.title,
        description: article.dek,
      },
  };
}

function articleStructuredData(article: Article): Record<string, unknown> {
  return {
    "@context": "https://schema.org",
    "@type": "NewsArticle",
    headline: article.title,
    description: article.dek,
    datePublished: article.publishedAt,
    dateModified: article.updatedAt ?? article.publishedAt,
    author: [
      article.author.isOrganization
        ? { "@type": "Organization", name: article.author.name }
        : { "@type": "Person", name: article.author.name },
    ],
    publisher: { "@type": "Organization", name: "MALDITOESPEJO" },
    articleSection: sectionName(article.section),
    inLanguage: "es",
    isAccessibleForFree: true,
    mainEntityOfPage: {
      "@type": "WebPage",
      "@id": `/${article.slug}`,
    },
  };
}

export default async function ArticlePage({ params }: Props) {
  const { slug } = await params;
  const article = getArticleBySlug(slug);
  if (!article) notFound();

  return (
    <div className="container-editorial">
      <article className="section-space pb-16 md:pb-24">
        <ArticleHeader article={article} />

        <div className="mx-auto mt-8 w-full max-w-[680px]">
          <KeyFacts facts={article.keyFacts} as="h2" />
        </div>

        <div className="mx-auto mt-10 w-full max-w-[680px]">
          <ArticleBody article={article} />
        </div>

        <div className="mx-auto w-full max-w-[680px]">
          <UnknownFacts facts={article.unknownFacts ?? []} as="h2" />
        </div>

        <ArticleTimeline article={article} />
        <ArticleUpdates article={article} />
        <ArticleSources article={article} />

        <RelatedStories article={article} />
      </article>

      <JsonLd data={articleStructuredData(article)} />
    </div>
  );
}
