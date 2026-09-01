import type { Section } from "./types";

export const sections: Section[] = [
  { slug: "actualidad", name: "Actualidad", url: "/actualidad" },
  { slug: "politica", name: "Política", url: "/politica" },
  { slug: "economia", name: "Economía", url: "/economia" },
  { slug: "sociedad", name: "Sociedad", url: "/sociedad" },
  { slug: "mundo", name: "Mundo", url: "/mundo" },
  { slug: "tecnologia", name: "Tecnología", url: "/tecnologia" },
];

export function getSection(slug: string): Section | undefined {
  return sections.find((s) => s.slug === slug);
}

export function sectionName(slug: string): string {
  return getSection(slug)?.name ?? slug;
}
