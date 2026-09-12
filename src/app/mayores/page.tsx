import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Mayores",
  description:
    "Noticias para personas mayores de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/mayores" },
};

export default function MayoresPage() {
  return <SectionPage sectionSlug="mayores" />;
}
