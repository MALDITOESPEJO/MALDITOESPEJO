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

/**
 * Convierte una fecha editorial local sin zona ("2026-09-25T16:25", hora de
 * Madrid) en ISO 8601 con desfase correcto ("2026-09-25T16:25:00+02:00").
 * Para datos estructurados (JSON-LD), Open Graph y sitemap.
 */
export function toMadridIso(local: string): string {
  const m = local.match(/^(\d{4})-(\d{2})-(\d{2})(?:T(\d{2}):(\d{2}))?/);
  if (!m) return local;
  const [, y, mo, d, h = "00", mi = "00"] = m;
  const probe = new Date(`${y}-${mo}-${d}T${h}:${mi}:00Z`);
  const part = new Intl.DateTimeFormat("en-GB", { timeZone: "Europe/Madrid", timeZoneName: "longOffset" })
    .formatToParts(probe)
    .find((p) => p.type === "timeZoneName")?.value;
  const offset = part && /GMT([+-]\d{2}:\d{2})/.test(part) ? part.replace("GMT", "") : "+01:00";
  return `${y}-${mo}-${d}T${h}:${mi}:00${offset}`;
}
