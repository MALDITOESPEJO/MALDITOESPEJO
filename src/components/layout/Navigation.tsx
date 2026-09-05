import Link from "next/link";

import { sections } from "@/data/sections";

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="MALDITOESPEJO — Hechos — portada"
      className="group inline-flex flex-col items-center leading-none"
    >
      <span className="font-sans text-[1.65rem] font-black uppercase tracking-[-0.055em] text-foreground sm:text-[2rem] md:text-[2.35rem]">
        Maldito<span className="text-accent">espejo</span>
      </span>
      <span className="mt-1.5 border-t border-ink px-2 pt-1 text-[0.52rem] font-bold uppercase tracking-[0.34em] text-ink">
        Hechos
      </span>
    </Link>
  );
}

export function Navigation() {
  return (
    <nav aria-label="Secciones principales">
      <ul className="news-nav">
        {sections.map((section) => (
          <li key={section.slug}>
            <Link href={section.url} className="news-nav-link">
              {section.name}
            </Link>
          </li>
        ))}
        <li>
          <Link href="/lo-ultimo" className="news-nav-link news-nav-link-active">
            Lo último
          </Link>
        </li>
      </ul>
    </nav>
  );
}
