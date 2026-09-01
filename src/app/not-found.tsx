import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="container-editorial">
      <section className="section-space max-w-xl">
        <p className="text-[0.75rem] font-semibold uppercase tracking-[0.16em] text-accent">
          404
        </p>
        <h1 className="headline-lg mt-3 text-ink">Página no encontrada</h1>
        <p className="dek mt-4">
          El contenido que buscas no existe o se ha movido.
        </p>
        <Link
          href="/"
          className="mt-8 inline-flex items-center bg-ink px-6 py-3 text-sm font-semibold text-background transition-colors hover:bg-accent"
        >
          Volver a la portada
        </Link>
      </section>
    </div>
  );
}
