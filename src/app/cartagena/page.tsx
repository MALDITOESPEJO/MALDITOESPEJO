import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Cartagena",
  description:
    "Noticias de Cartagena de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/cartagena" },
};

export default function CartagenaPage() {
  return <SectionPage sectionSlug="cartagena" />;
}
