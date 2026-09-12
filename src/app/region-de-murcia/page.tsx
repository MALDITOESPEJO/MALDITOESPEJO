import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Región de Murcia",
  description:
    "Noticias de la Región de Murcia de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/region-de-murcia" },
};

export default function RegionDeMurciaPage() {
  return <SectionPage sectionSlug="regiondemurcia" />;
}
