import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Cartagena",
  description:
    "Noticias de Cartagena de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/cartagena" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Cartagena — MALDITOESPEJO",
    description:
      "Noticias de Cartagena basadas en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Cartagena — MALDITOESPEJO",
    description: "Noticias de Cartagena basadas en hechos, datos y declaraciones atribuibles.",
  },
};

export default function CartagenaPage() {
  return <SectionPage sectionSlug="cartagena" />;
}
