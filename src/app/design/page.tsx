import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sistema de diseño",
  robots: { index: false, follow: false },
};

export default function DesignPreviewPage() {
  return (
    <main className="container-editorial py-16">
      <p className="text-sm font-semibold uppercase tracking-[0.16em] text-faint">
        MALDITOESPEJO — Preview
      </p>
      <h1 className="headline-xl mt-4 max-w-3xl text-ink">
        Sistema de diseño
      </h1>
      <p className="dek mt-4 max-w-2xl">
        Área interna de desarrollo. Esta ruta no forma parte del contenido
        editorial publicado.
      </p>
    </main>
  );
}
