import Link from "next/link";

import { sections } from "@/data/sections";

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="MALDITOESPEJO — Hechos — portada"
      className="group inline-flex flex-col items-center leading-none"
    >
      <span className="font-sans text-[2rem] font-black uppercase tracking-[-0.055em] text-foreground sm:text-[2.45rem] md:text-[3rem]">
        Maldito<span className="text-accent">espejo</span>
      </span>
      <span className="mt-2 border-t border-ink px-3 pt-1.5 text-[0.68rem] font-bold uppercase tracking-[0.34em] text-ink sm:text-[0.74rem] md:text-[0.8rem]">
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
