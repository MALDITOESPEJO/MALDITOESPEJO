import type { Article } from "@/data/types";

export function formatDateTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleDateString("es-ES", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export function formatTime(iso: string): string {
  const d = new Date(iso);
  return d.toLocaleTimeString("es-ES", {
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Formato compacto de portada: "31 AGOSTO 2026 · 12:32". */
export function formatEditorialMeta(iso: string): string {
  const d = new Date(iso);
  const day = d
    .toLocaleDateString("es-ES", { day: "2-digit" })
    .padStart(2, "0");
  const month = d
    .toLocaleDateString("es-ES", { month: "long" })
    .toUpperCase();
  const year = d.getFullYear();
  const time = formatTime(iso);
  return `${day} ${month} ${year} · ${time}`;
}

/** Ordena los articulos de mas reciente a mas antiguo. */
export function sortByNewest(articles: Article[]): Article[] {
  return [...articles].sort(
    (a, b) => new Date(b.publishedAt).getTime() - new Date(a.publishedAt).getTime()
  );
}
