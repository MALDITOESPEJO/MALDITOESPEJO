import { articles } from "@/data/articles";
import { SiteBars } from "./SiteBars";

/** Cabecera global: delega en SiteBars (cliente) el color y la pestaña activa. */
export function Header() {
  const articleSections: Record<string, string> = {};
  for (const a of articles) articleSections[a.slug] = a.section;
  return <SiteBars articleSections={articleSections} />;
}
