/**
 * Un color plano por sección (mecánica "bloque de color a sangre").
 * Todos llevan texto negro con contraste AA o superior.
 */
export const SECTION_COLORS: Record<string, string> = {
  actualidad: "#F0481D",
  politica: "#CD80A2",
  economia: "#5BAB5F",
  sociedad: "#E8C531",
  mundo: "#5B8FE8",
  tecnologia: "#3FB8A9",
  cartagena: "#A58AE6",
  regiondemurcia: "#B6D63F",
  mayores: "#86C5EA",
};

export const DEFAULT_ACCENT = "#F0481D";

export function sectionColor(slug: string | undefined): string {
  return (slug && SECTION_COLORS[slug]) || DEFAULT_ACCENT;
}
