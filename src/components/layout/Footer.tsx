import Link from "next/link";

import { sections } from "@/data/sections";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container-editorial py-12 md:py-16">
        <p className="footer-mark" aria-label="MALDITOESPEJO">
          Maldito<span>espejo</span>
        </p>

        <div className="mt-8 grid gap-10 md:grid-cols-[minmax(0,26rem)_1fr] md:items-start">
          <p className="text-base leading-snug text-white/80">
            Información basada en hechos, datos, documentos y declaraciones
            atribuibles. Sin opinión ni interpretación.
          </p>

          <nav aria-label="Secciones" className="footer-nav">
            <ul className="flex flex-wrap gap-x-7 gap-y-3 md:justify-end">
              {sections.map((s) => (
                <li key={s.slug}>
                  <Link href={s.url}>{s.name}</Link>
                </li>
              ))}
              <li>
                <Link href="/lo-ultimo" className="footer-hot">
                  Lo último
                </Link>
              </li>
            </ul>
          </nav>
        </div>

        <div className="footer-legal mt-12 flex flex-col gap-3 border-t border-white/20 pt-6 md:flex-row md:items-center md:justify-between">
          <p>© {year} MALDITOESPEJO · Todos los derechos reservados</p>
          <nav aria-label="Información legal">
            <ul className="flex flex-wrap gap-x-6 gap-y-2">
              <li><Link href="/aviso-legal">Aviso legal</Link></li>
              <li><Link href="/politica-de-privacidad">Privacidad</Link></li>
              <li><Link href="/cookies">Cookies</Link></li>
            </ul>
          </nav>
        </div>
      </div>
    </footer>
  );
}
