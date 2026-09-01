import type { Metadata } from "next";

import { SearchClient } from "@/components/search/SearchClient";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Búsqueda local sobre el contenido de MALDITOESPEJO.",
};

export default function SearchPage() {
  return (
    <div className="container-editorial">
      <section className="section-space max-w-2xl">
        <h1 className="headline-lg text-ink">Buscar</h1>
        <p className="metadata mt-3">
          Búsqueda local sobre el contenido de demostración.
        </p>
        <SearchClient />
      </section>
    </div>
  );
}
