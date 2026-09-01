import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Tecnología",
  description:
    "Tecnología de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/tecnologia" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Tecnología — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Tecnología — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles.",
  },
};

export default function TecnologiaPage() {
  return <SectionPage sectionSlug="tecnologia" />;
}
