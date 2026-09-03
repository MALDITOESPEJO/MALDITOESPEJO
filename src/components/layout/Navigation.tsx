import Link from "next/link";

import { sections } from "@/data/sections";

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="MALDITOESPEJO — Hechos — portada"
      className="inline-flex flex-col leading-none"
    >
      <span className="text-[1.15rem] font-black uppercase tracking-[0.04em] text-foreground">
        Maldito
        <span className="text-accent">espejo</span>
      </span>
      <span className="mt-1 text-[0.55rem] font-semibold uppercase tracking-[0.24em] text-ink/70">
        Hechos
      </span>
    </Link>
  );
}

export function Navigation() {
  return (
    <nav aria-label="Secciones principales">
      <ul className="flex items-center gap-6">
        {sections.map((section) => (
          <li key={section.slug}>
            <Link
              href={section.url}
              className="text-[0.8rem] font-medium uppercase tracking-[0.06em] text-ink/80 transition-colors hover:text-accent"
            >
              {section.name}
            </Link>
          </li>
        ))}
        <li>
          <Link
            href="/lo-ultimo"
            className="text-[0.8rem] font-medium uppercase tracking-[0.06em] text-accent transition-colors hover:text-accent/80"
          >
            Lo último
          </Link>
        </li>
      </ul>
    </nav>
  );
}
