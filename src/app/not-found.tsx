import Link from "next/link";

import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Página no encontrada",
  robots: { index: false, follow: false },
};

export default function NotFound() {
  return (
    <div className="theme-dark">
    <div className="container-editorial">
      <section className="notfound">
        <p className="notfound-code" aria-hidden="true">404</p>
        <h1 className="headline-lg">Página no encontrada</h1>
        <p className="dek notfound-dek">El contenido que buscas no existe o se ha movido.</p>
        <Link href="/" className="btn-hot">
          Volver a la portada
        </Link>
      </section>
    </div>
    </div>
  );
}
