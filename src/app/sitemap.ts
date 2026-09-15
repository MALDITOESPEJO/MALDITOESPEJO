import type { MetadataRoute } from "next";
import { articles } from "@/data/articles";
import { sections } from "@/data/sections";
const base = "https://www.malditoespejo.com";
export default function sitemap(): MetadataRoute.Sitemap {
  const staticRoutes: MetadataRoute.Sitemap = [
    { url: base, changeFrequency: "daily", priority: 1 },
    { url: `${base}/lo-ultimo`, changeFrequency: "daily" },
  ];
  const sectionRoutes: MetadataRoute.Sitemap = sections.map((s) => ({ url: `${base}${s.url}`, changeFrequency: "daily", priority: 0.8 }));
  const articleRoutes: MetadataRoute.Sitemap = articles.map((a) => ({ url: `${base}/${a.slug}`, lastModified: new Date(a.publishedAt), changeFrequency: "daily", priority: 0.9 }));
  return [...staticRoutes, ...sectionRoutes, ...articleRoutes];
}
