"use client";

import Link from "next/link";
import { useMemo, useState } from "react";

import type { Article } from "@/data/types";
import { sectionName } from "@/data/sections";

type SearchClientProps = {
  articles: Article[];
};

export function SearchClient({ articles }: SearchClientProps) {
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return articles.filter(
      (a) =>
        a.title.toLowerCase().includes(q) ||
        a.dek.toLowerCase().includes(q) ||
        a.body.map((b) => b.content).join(" ").toLowerCase().includes(q) ||
        sectionName(a.section).toLowerCase().includes(q)
    );
  }, [articles, query]);

  return (
    <div className="search">
      <div className="search-field">
        <label htmlFor="search-input" className="sr-only">
          Buscar
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Titular, sección o contenido…"
          className="search-input"
        />
      </div>

      {query.trim() === "" ? (
        <p className="search-note">Escribe un término para buscar en el contenido publicado de MALDITOESPEJO.</p>
      ) : results.length === 0 ? (
        <p className="search-note">No se encontraron resultados.</p>
      ) : (
        <>
          <p className="metadata search-count">
            {results.length} {results.length === 1 ? "resultado" : "resultados"}
          </p>
          <ul className="search-results">
            {results.map((a) => (
              <li key={a.slug}>
                <Link href={`/${a.slug}`} className="search-hit">
                  <span className="kicker kicker-sm">{sectionName(a.section)}</span>
                  <span className="headline-md hl">{a.title}</span>
                </Link>
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
