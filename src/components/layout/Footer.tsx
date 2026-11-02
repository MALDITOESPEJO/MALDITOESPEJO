import Link from "next/link";

import { sections } from "@/data/sections";
import { GiantWordmark } from "@/components/ui/GiantWordmark";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="site-footer">
      <div className="container-editorial footer-top">
        <p className="footer-tag">
          Información basada en hechos, datos, documentos y declaraciones atribuibles. Sin opinión ni interpretación.
        </p>
        <nav aria-label="Secciones" className="footer-nav">
          <ul>
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

      <div className="container-editorial footer-giant" aria-hidden="true">
        <GiantWordmark text="MALDITOESPEJO" height={250} cropped />
      </div>

      <div className="container-editorial footer-legal-row">
        <p>© {year} MALDITOESPEJO · Todos los derechos reservados</p>
        <nav aria-label="Información legal">
          <ul>
            <li><Link href="/aviso-legal">Aviso legal</Link></li>
            <li><Link href="/politica-de-privacidad">Privacidad</Link></li>
            <li><Link href="/cookies">Cookies</Link></li>
          </ul>
        </nav>
      </div>
    </footer>
  );
}
