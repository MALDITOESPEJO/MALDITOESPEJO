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
    <div className="mt-8">
      <div className="flex max-w-xl gap-3">
        <label htmlFor="search-input" className="sr-only">
          Buscar
        </label>
        <input
          id="search-input"
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Buscar por titular, sección o contenido…"
          className="h-12 w-full border border-border-strong bg-background px-4 text-[0.95rem] text-ink placeholder:text-faint"
        />
      </div>

      {query.trim() === "" ? (
        <p className="mt-6 text-sm text-muted">
          Escribe un término para buscar en el contenido publicado de MALDITOESPEJO.
        </p>
      ) : results.length === 0 ? (
        <p className="mt-6 text-sm text-muted">No se encontraron resultados.</p>
      ) : (
        <ul className="mt-6 max-w-xl divide-y divide-border border-y border-border">
          {results.map((a) => (
            <li key={a.slug}>
              <Link href={`/${a.slug}`} className="group block py-4">
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-accent">
                  {sectionName(a.section)}
                </span>
                <p className="mt-1 text-[1.05rem] font-display font-bold leading-snug text-ink group-hover:text-accent">
                  {a.title}
                </p>
              </Link>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
