"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import type { CSSProperties } from "react";

import { sections } from "@/data/sections";
import { sectionColor } from "@/lib/sectionTheme";
import { MobileNavigation } from "./MobileNavigation";

interface SiteBarsProps {
  /** slug de artículo -> sección, para colorear la barra en las páginas de artículo. */
  articleSections: Record<string, string>;
}

const PAGE_LABELS: Record<string, string> = {
  "lo-ultimo": "Lo último",
  search: "Buscar",
  cookies: "Cookies",
  "aviso-legal": "Aviso legal",
  "politica-de-privacidad": "Privacidad",
};

function SearchIcon() {
  return (
    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.6" strokeLinecap="square" aria-hidden="true">
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/**
 * Cabecera de dos barras:
 * 1) pestañas de sección en celdas con filetes; la activa se rellena de su color.
 * 2) barra de contexto: monograma, nombre de sección y acciones. Toma el color
 *    de la sección (negra en la portada).
 */
export function SiteBars({ articleSections }: SiteBarsProps) {
  const pathname = usePathname() || "/";
  const first = pathname.split("/")[1] ?? "";
  const isHome = pathname === "/";
  const activeSlug = sections.find((s) => s.url === `/${first}`)?.slug ?? articleSections[first];
  const activeName = sections.find((s) => s.slug === activeSlug)?.name;
  const label = isHome ? "Solo hechos · Sin opinión" : activeName ?? PAGE_LABELS[first] ?? "";
  const color = activeSlug ? sectionColor(activeSlug) : undefined;
  const tone = activeSlug ? "color" : "dark";

  return (
    <header className="site-head" data-tone={tone} style={color ? ({ "--sec": color } as CSSProperties) : undefined}>
      <nav className="tabs" aria-label="Secciones principales">
        <Link href="/" className="tab tab-brand">
          MALDITOESPEJO
        </Link>
        {sections.map((s) => (
          <Link key={s.slug} href={s.url} className={`tab${s.slug === activeSlug ? " tab-active" : ""}`} aria-current={s.slug === activeSlug ? "page" : undefined} style={{ "--tab": sectionColor(s.slug) } as CSSProperties}>
            {s.name}
          </Link>
        ))}
        <Link href="/search" className="tab tab-icon" aria-label="Buscar">
          <SearchIcon />
        </Link>
      </nav>

      <div className="bar2">
        <div className="bar2-inner">
          <Link href="/" className="bar2-mark" aria-label="MALDITOESPEJO — portada">
            M<span>E</span>
          </Link>
          {label && <span className="bar2-label">{label}</span>}
          <div className="bar2-actions">
            <Link href="/lo-ultimo" className="pill">
              Lo último
            </Link>
            <MobileNavigation />
          </div>
        </div>
      </div>
    </header>
  );
}
