import Link from "next/link";
import { sections } from "@/data/sections";

export function Wordmark() {
  return (
    <Link href="/" aria-label="MALDITOESPEJO — portada" className="group inline-flex items-baseline">
      <span className="text-[1.65rem] font-black tracking-[-0.07em] text-foreground md:text-[2rem]">MALDITO</span>
      <span className="text-[1.65rem] font-black tracking-[-0.07em] text-accent md:text-[2rem]">ESPEJO</span>
    </Link>
  );
}

export function Navigation() {
  return (
    <nav aria-label="Secciones principales" className="w-full">
      <ul className="flex items-center justify-between gap-5 overflow-x-auto whitespace-nowrap py-0.5 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden">
        {sections.map((section) => (
          <li key={section.slug} className="shrink-0">
            <Link href={section.url} className="text-[.72rem] font-bold uppercase tracking-[.08em] transition-colors hover:text-accent">
              {section.name}
            </Link>
          </li>
        ))}
        <li className="shrink-0">
          <Link href="/lo-ultimo" className="text-[.72rem] font-bold uppercase tracking-[.08em] text-accent">
            Lo último
          </Link>
        </li>
      </ul>
    </nav>
  );
}
