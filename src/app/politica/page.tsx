import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Política",
  description:
    "Política de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/politica" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Política — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Política — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles.",
  },
};

export default function PoliticaPage() {
  return <SectionPage sectionSlug="politica" />;
}
