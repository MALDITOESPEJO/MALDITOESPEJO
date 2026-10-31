import type { Metadata, Viewport } from "next";
import { Archivo, Archivo_Narrow, IBM_Plex_Mono, Source_Serif_4 } from "next/font/google";
import "./globals.css";
import { Header } from "@/components/layout/Header";
import { Footer } from "@/components/layout/Footer";
import { CookieBanner } from "@/components/layout/CookieBanner";

/* Titulares y UI: Archivo (variable, hasta 900). Condensada para etiquetas y
   navegacion. Mono para horas y datos. Serif solo para lectura (dek y cuerpo). */
const archivo = Archivo({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700", "800", "900"],
  variable: "--font-sans",
  display: "swap",
});

const archivoNarrow = Archivo_Narrow({
  subsets: ["latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-archivo-narrow",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-plex",
  display: "swap",
});

const sourceSerif4 = Source_Serif_4({
  subsets: ["latin"],
  weight: ["400", "600", "700"],
  variable: "--font-display",
  display: "swap",
});
export const metadata: Metadata = {
  metadataBase: new URL("https://www.malditoespejo.com"),
  title: { default: "MALDITOESPEJO — Solo hechos", template: "%s — MALDITOESPEJO" },
  description: "MALDITOESPEJO es un medio de información basado exclusivamente en hechos, datos y declaraciones atribuibles. Sin opinión ni interpretación.",
  openGraph: { siteName: "MALDITOESPEJO", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles." },
  twitter: { card: "summary", title: "MALDITOESPEJO — Solo hechos", description: "Información basada en hechos, datos y declaraciones atribuibles." },
};
export const viewport: Viewport = { themeColor: "#0b0b0b", width: "device-width", initialScale: 1 };
export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="es" className={`${sourceSerif4.variable} ${archivo.variable} ${archivoNarrow.variable} ${plexMono.variable} h-full`}><body className="flex min-h-full flex-col bg-background font-sans text-foreground antialiased"><a href="#contenido" className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-4 focus:z-[100] focus:bg-ink focus:px-4 focus:py-2 focus:text-sm focus:text-background">Saltar al contenido</a><Header /><main id="contenido" className="flex-1">{children}</main><Footer /><CookieBanner /></body></html>;
}
