import type { Metadata } from "next";

import { SectionPage } from "@/components/section/SectionPage";

export const metadata: Metadata = {
  title: "Mundo",
  description:
    "Mundo de MALDITOESPEJO. Información basada en hechos, datos y declaraciones atribuibles, sin opinión ni interpretación.",
  alternates: { canonical: "/mundo" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Mundo — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Mundo — MALDITOESPEJO",
    description:
      "Información basada en hechos, datos y declaraciones atribuibles.",
  },
};

export default function MundoPage() {
  return <SectionPage sectionSlug="mundo" />;
}
