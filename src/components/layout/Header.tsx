import Link from "next/link";
import { MobileNavigation } from "./MobileNavigation";
import { Navigation, Wordmark } from "./Navigation";

export function Header() {
  return (
    <header className="border-b-2 border-ink bg-background">
      <div className="container-editorial flex h-[4.75rem] items-center justify-between gap-4 md:h-[5.75rem]">
        <div className="md:hidden"><MobileNavigation /></div>
        <Wordmark />
        <div className="ml-auto flex items-center gap-3">
          <span className="hidden text-[.68rem] font-bold uppercase tracking-[.1em] text-muted sm:block">Solo hechos</span>
          <Link href="/search" aria-label="Buscar" className="flex h-9 w-9 items-center justify-center rounded-full border border-ink transition-colors hover:bg-ink hover:text-background">
            <svg width="17" height="17" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round"><circle cx="11" cy="11" r="7"/><path d="m21 21-4.3-4.3"/></svg>
          </Link>
        </div>
      </div>
      <div className="container-editorial border-t border-border py-3">
        <Navigation />
      </div>
    </header>
  );
}
