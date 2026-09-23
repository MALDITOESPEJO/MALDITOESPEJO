import Image from "next/image";
import Link from "next/link";
import { sections } from "@/data/sections";

export function Wordmark() {
  return (
    <Link
      href="/"
      aria-label="MALDITOESPEJO — portada"
      className="inline-flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-accent focus-visible:ring-offset-2"
    >
      <Image
        src="/images/malditoespejo-logo.webp"
        alt="MALDITOESPEJO — Solo hechos"
        width={560}
        height={255}
        priority
        sizes="(max-width: 639px) 210px, (max-width: 767px) 260px, 360px"
        className="h-auto w-[210px] sm:w-[260px] md:w-[360px]"
      />
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
