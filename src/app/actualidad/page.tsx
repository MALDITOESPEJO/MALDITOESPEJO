import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Actualidad",
  description:
    "Actualidad de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/actualidad" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Actualidad — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Actualidad — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles.",
  },
};

export default function ActualidadPage() {
  return <SectionPage sectionSlug="actualidad" />;
}
