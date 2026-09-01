/*
  Carga de familias candidatas para la evaluacion tipografica.
  Todas se auto-alojan via next/font/google (compatible con Vercel:
  las fuentes se sirven desde el mismo dominio, sin peticiones a
  Google en el navegador).

  Estas familias solo se usan en la ruta de desarrollo /design para
  comparar. La seleccion definitiva se aplicara a los tokens
  --font-display y --font-sans de globals.css cuando se apruebe.
*/

import {
  Inter,
  IBM_Plex_Sans,
  Source_Sans_3,
  Lora,
  Source_Serif_4,
  Libre_Baskerville,
} from "next/font/google";

export const inter = Inter({
  subsets: ["latin"],
  variable: "--specimen-inter",
  display: "swap",
});

export const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--specimen-ibm",
  display: "swap",
});

export const sourceSans3 = Source_Sans_3({
  subsets: ["latin"],
  variable: "--specimen-source-sans",
  display: "swap",
});

export const lora = Lora({
  subsets: ["latin"],
  variable: "--specimen-lora",
  display: "swap",
});

export const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  variable: "--specimen-source-serif",
  display: "swap",
});

export const libreBaskerville = Libre_Baskerville({
  subsets: ["latin"],
  weight: ["400", "700"],
  variable: "--specimen-libre",
  display: "swap",
});
