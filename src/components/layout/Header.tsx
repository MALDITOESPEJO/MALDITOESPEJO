import Link from "next/link";

import { MobileNavigation } from "./MobileNavigation";
import { Navigation, Wordmark } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur-sm">
      {/* Fila superior: wordmark + buscar + menu movil */}
      <div className="container-editorial flex h-14 items-center justify-between gap-4 md:h-16">
        <div className="md:hidden">
          <MobileNavigation />
        </div>

        <Wordmark />

        <div className="ml-auto flex items-center gap-3">
          <Link
            href="/search"
            aria-label="Buscar"
            className="flex h-10 w-10 items-center justify-center text-ink transition-colors hover:text-accent"
          >
            <svg
              width="19"
              height="19"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </Link>
        </div>
      </div>

      {/* Navegacion de escritorio */}
      <div className="container-editorial hidden justify-center border-t border-border py-3 md:block">
        <Navigation />
      </div>
    </header>
  );
}
