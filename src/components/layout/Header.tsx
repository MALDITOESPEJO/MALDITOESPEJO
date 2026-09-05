import Link from "next/link";

import { MobileNavigation } from "./MobileNavigation";
import { Navigation, Wordmark } from "./Navigation";

export function Header() {
  return (
    <header className="sticky top-0 z-50 bg-background/97 backdrop-blur-md">
      <div className="masthead-strip border-b border-white/10">
        <div className="container-editorial flex h-9 items-center justify-between gap-4 text-[0.62rem] font-semibold uppercase tracking-[0.12em]">
          <span className="hidden sm:block opacity-75">MALDITOESPEJO</span>
          <Link href="/lo-ultimo" className="ml-auto transition-opacity hover:opacity-70 sm:ml-0">
            Lo último
          </Link>
        </div>
      </div>

      <div className="container-editorial border-b border-border">
        <div className="relative flex h-[5.5rem] items-center justify-between md:h-24">
          <div className="flex w-20 items-center md:w-28">
            <div className="md:hidden">
              <MobileNavigation />
            </div>
          </div>

          <Wordmark />

          <div className="flex w-20 justify-end md:w-28">
            <Link
              href="/search"
              aria-label="Buscar"
              className="group flex h-10 w-10 items-center justify-center rounded-full border border-border text-ink transition-colors hover:border-ink hover:bg-surface"
            >
              <svg
                width="18"
                height="18"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              >
                <circle cx="11" cy="11" r="7" />
                <path d="m21 21-4.3-4.3" />
              </svg>
            </Link>
          </div>
        </div>

        <div className="hidden border-t border-border py-3.5 md:block">
          <Navigation />
        </div>
      </div>
    </header>
  );
}
