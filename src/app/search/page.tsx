import type { Metadata } from "next";

import { SearchClient } from "@/components/search/SearchClient";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Búsqueda local sobre el contenido de MALDITOESPEJO.",
};

export default function SearchPage() {
  return (
    <div className="container-editorial">
      <div className="section-space">
        <div className="page-title">
          <p className="kicker mb-3">Archivo completo</p>
          <h1 className="headline-display">Buscar</h1>
          <p className="metadata mt-4">Búsqueda local sobre el contenido publicado de MALDITOESPEJO.</p>
        </div>
      </div>
      <SearchClient articles={articles} />
    </div>
  );
}
