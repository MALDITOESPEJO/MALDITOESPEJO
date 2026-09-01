import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Economía",
  description:
    "Economía de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/economia" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Economía — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Economía — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles.",
  },
};

export default function EconomiaPage() {
  return <SectionPage sectionSlug="economia" />;
}
