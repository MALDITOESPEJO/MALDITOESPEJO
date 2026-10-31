import Link from "next/link";

import { articles } from "@/data/articles";
import { formatEditorialMeta, sortByNewest } from "@/lib/utils";
import { MobileNavigation } from "./MobileNavigation";
import { Navigation, Wordmark } from "./Navigation";
import { Ticker } from "./Ticker";

function SearchIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2.4"
      strokeLinecap="square"
      aria-hidden="true"
    >
      <circle cx="11" cy="11" r="7" />
      <path d="m21 21-4.3-4.3" />
    </svg>
  );
}

/**
 * Cabecera en tres capas:
 * 1) barra negra de edicion, 2) logotipo grande, 3) barra de secciones
 * pegajosa (es lo unico que se queda fijo al hacer scroll), y debajo la cinta
 * "Lo último".
 */
export function Header() {
  const newest = sortByNewest(articles)[0];

  return (
    <>
      <header>
        <div className="topbar">
          <div className="container-editorial">
            <div className="topbar-inner">
              <span>Solo hechos · Sin opinión</span>
              {newest && <span>Actualizado {formatEditorialMeta(newest.publishedAt)}</span>}
            </div>
          </div>
        </div>

        <div className="container-editorial">
          <div className="logo-row">
            <Wordmark />
          </div>
        </div>
      </header>

      <div className="navbar">
        <div className="container-editorial">
          <div className="navbar-inner">
            <div className="md:hidden">
              <MobileNavigation />
            </div>

            <div className="navbar-nav hidden md:block">
              <Navigation />
            </div>

            <div className="navbar-tools">
              <Link href="/lo-ultimo" className="icon-btn icon-btn-hot md:hidden">
                Lo último
              </Link>
              <Link href="/search" aria-label="Buscar" className="icon-btn">
                <SearchIcon />
              </Link>
            </div>
          </div>
        </div>
      </div>

      <Ticker />
    </>
  );
}
