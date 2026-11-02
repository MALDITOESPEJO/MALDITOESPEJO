import type { Metadata } from "next";

import { SearchClient } from "@/components/search/SearchClient";
import { articles } from "@/data/articles";

export const metadata: Metadata = {
  title: "Buscar",
  description: "Búsqueda local sobre el contenido de MALDITOESPEJO.",
};

export default function SearchPage() {
  return (
    <div className="theme-dark">
      <div className="container-editorial">
        <div className="w-page-head">
          <p className="sec-page-count">Archivo completo</p>
          <h1 className="sec-page-title">Buscar</h1>
          <p className="metadata">Búsqueda local sobre el contenido publicado de MALDITOESPEJO.</p>
        </div>
        <SearchClient articles={articles} />
      </div>
    </div>
  );
}
