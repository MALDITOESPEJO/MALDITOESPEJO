/* ============================================================
   MALDITOESPEJO — TIPOS DE DATOS
   ------------------------------------------------------------
   Estructura de datos editorial. Los articulos viven en /data y
   son intercambiables por un CMS/API sin tocar la interfaz.
   ============================================================ */

export type SectionSlug =
  | "actualidad"
  | "politica"
  | "economia"
  | "sociedad"
  | "mundo"
  | "tecnologia"
  | "cartagena"
  | "cultura";

export interface Section {
  slug: SectionSlug;
  name: string;
  url: string;
}

export interface Author {
  name: string;
  /** La autoria puede ser un organismo/redaccion (p. ej. "MALDITOESPEJO"). */
  isOrganization?: boolean;
  /** Cargo o funcion opcional (p. ej. "Redaccion"). */
  role?: string;
}

/** Naturaleza de la fuente que acredita la informacion. */
export type SourceNature =
  | "comunicado oficial"
  | "documento"
  | "rueda de prensa"
  | "web oficial"
  | "registro oficial"
  | "nota de prensa";

export interface Source {
  /** Identificador estable de la fuente dentro del articulo (p. ej. "source-1").
   *  Los bloques del cuerpo lo referencian via sourceIds. */
  id?: string;
  /** Organismo o persona que respalda la fuente. */
  entity?: string;
  /** Titulo o tipo de la fuente. */
  label: string;
  /** Naturaleza de la fuente. */
  nature?: SourceNature;
  /** Fecha de la fuente, en texto (p. ej. "31 agosto 2026"). */
  date?: string;
  /** Enlace (en DEMO, placeholder claramente ficticio). */
  url?: string;
}

interface ArticleImage {
  src: string;
  alt: string;
  width: number;
  height: number;
}

/** Entrada de la cronologia del suceso (barrida rapida por hora). */
export interface TimelineEntry {
  /** Hora de la entrada (p. ej. "08:15"). */
  time: string;
  text: string;
}

/** Anotacion de actualizacion posterior a la publicacion. */
export interface UpdateEntry {
  /** Hora de la actualizacion, distinguiendo Publicado/Actualizado. */
  time: string;
  text: string;
}

/** Clasificacion editorial de un bloque del cuerpo de la noticia. */
export type ArticleBlockType = "fact" | "statement" | "context" | "pending";

/**
 * Bloque editorial del cuerpo. Permite la trazabilidad
 * CONTENIDO -> ATRIBUCION -> FUENTE:
 * - `type`: que clase de informacion contiene (hecho, declaracion, contexto, pendiente).
 * - `attribution`: quien afirma el contenido (persona, organismo o entidad).
 * - `sourceIds`: identificadores de fuentes (Source.id) que lo respaldan.
 * La clasificacion es estructural y editorial; no obliga a una etiqueta visual.
 */
export interface ArticleBlock {
  type: ArticleBlockType;
  content: string;
  /** Atribucion de la afirmacion (obligatoria para type "statement"). */
  attribution?: string;
  /** Fuentes que respaldan el bloque. */
  sourceIds?: string[];
}

export interface Article {
  /** Identificador opcional; si falta se usa el slug. */
  id?: string;
  slug: string;
  title: string;
  dek: string;
  section: SectionSlug;
  publishedAt: string;
  author: Author;
  /** Marca la hora de la ultima actualizacion, distinguiendo Publicado/Actualizado. */
  updatedAt?: string;
  image?: ArticleImage;
  /** Hechos confirmados. Sin interpretacion. */
  keyFacts: string[];
  /** Hechos objetivamente pendientes de confirmacion. Opcional. */
  unknownFacts?: string[];
  /** Cronologia del suceso, orientada a la lectura rapida. Opcional. */
  timeline?: TimelineEntry[];
  /** Actualizaciones posteriores a la publicacion. Opcional. */
  updates?: UpdateEntry[];
  /** Desarrollo de la noticia: bloques editoriales con trazabilidad. */
  body: ArticleBlock[];
  /** Datos verificables (cifras, fechas, nombres). Opcional. */
  data?: { label: string; value: string }[];
  /** Importe informacion conocida sobre lo que sucede ahora. Sin especulacion. */
  whatsNext?: string[];
  /** Fuentes que acreditan la informacion. */
  sources: Source[];
  /** Slugs de articulos relacionados por criterio editorial. Opcional. */
  relatedArticles?: string[];
  /** Marcado interno para contenido de demostracion. */
  isDemo?: boolean;
}
