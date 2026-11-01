/**
 * Parser de Markdown mínimo y puro para el cuerpo de los artículos.
 * Solo presentación: recibe el texto de un bloque (`ArticleBlock.content`)
 * y devuelve un árbol sencillo que renderiza `MarkdownBlocks`.
 *
 * Soporta: párrafos, subtítulos (##, ###), listas con guion/asterisco,
 * listas numeradas, citas (>), y en línea **negrita**, *cursiva*, `código`
 * y [enlaces](url). No ejecuta HTML: todo se devuelve como texto.
 */

export type Inline =
  | { t: "text"; v: string }
  | { t: "strong"; c: Inline[] }
  | { t: "em"; c: Inline[] }
  | { t: "code"; v: string }
  | { t: "link"; href: string; c: Inline[] };

export type MdBlock =
  | { t: "p"; c: Inline[] }
  | { t: "h"; level: 2 | 3; c: Inline[] }
  | { t: "ul"; items: Inline[][] }
  | { t: "ol"; items: Inline[][] }
  | { t: "quote"; c: Inline[] };

function safeHref(href: string): string | null {
  const h = href.trim();
  if (/^(https?:\/\/|mailto:|\/|#)/i.test(h)) return h;
  return null;
}

export function parseInline(src: string): Inline[] {
  const out: Inline[] = [];
  let buf = "";
  const flush = () => {
    if (buf) out.push({ t: "text", v: buf });
    buf = "";
  };
  let i = 0;
  while (i < src.length) {
    const rest = src.slice(i);
    let m: RegExpMatchArray | null;

    if ((m = rest.match(/^\*\*([^\n]+?)\*\*/))) {
      flush();
      out.push({ t: "strong", c: parseInline(m[1]) });
      i += m[0].length;
    } else if ((m = rest.match(/^`([^`\n]+)`/))) {
      flush();
      out.push({ t: "code", v: m[1] });
      i += m[0].length;
    } else if ((m = rest.match(/^\[([^\]\n]+)\]\(([^)\s]+)\)/))) {
      const href = safeHref(m[2]);
      if (href) {
        flush();
        out.push({ t: "link", href, c: parseInline(m[1]) });
      } else {
        buf += m[1];
      }
      i += m[0].length;
    } else if ((m = rest.match(/^\*([^*\s][^*\n]*?)\*(?!\*)/))) {
      flush();
      out.push({ t: "em", c: parseInline(m[1]) });
      i += m[0].length;
    } else if (rest.startsWith("**")) {
      // Marcador sin pareja: no debe verse nunca en pantalla.
      i += 2;
    } else {
      buf += src[i];
      i += 1;
    }
  }
  flush();
  return out;
}

const BULLET = /^\s*[-*+]\s+(.*)$/;
const ORDERED = /^\s*\d+[.)]\s+(.*)$/;
const HEADING = /^(#{1,6})\s+(.*)$/;
const QUOTE = /^>\s?(.*)$/;

/** Convierte el contenido de un bloque editorial en bloques renderizables. */
export function parseMarkdownBlock(content: string): MdBlock[] {
  const lines = content.replace(/\r\n?/g, "\n").split("\n");
  const blocks: MdBlock[] = [];
  let para: string[] = [];
  let list: { kind: "ul" | "ol"; items: string[] } | null = null;
  let quote: string[] = [];

  const flushAll = () => {
    if (para.length) {
      blocks.push({ t: "p", c: parseInline(para.join(" ").trim()) });
      para = [];
    }
    if (list) {
      blocks.push({ t: list.kind, items: list.items.map(parseInline) } as MdBlock);
      list = null;
    }
    if (quote.length) {
      blocks.push({ t: "quote", c: parseInline(quote.join(" ").trim()) });
      quote = [];
    }
  };

  for (const raw of lines) {
    const line = raw.trimEnd();
    if (!line.trim()) {
      flushAll();
      continue;
    }
    let m: RegExpMatchArray | null;
    if ((m = line.match(HEADING))) {
      flushAll();
      const level = m[1].length <= 2 ? 2 : 3;
      blocks.push({ t: "h", level, c: parseInline(m[2].trim()) });
    } else if ((m = line.match(BULLET))) {
      if (!list || list.kind !== "ul") {
        flushAll();
        list = { kind: "ul", items: [] };
      }
      list.items.push(m[1]);
    } else if ((m = line.match(ORDERED))) {
      if (!list || list.kind !== "ol") {
        flushAll();
        list = { kind: "ol", items: [] };
      }
      list.items.push(m[1]);
    } else if ((m = line.match(QUOTE))) {
      if (!quote.length) flushAll();
      quote.push(m[1]);
    } else {
      if (list || quote.length) flushAll();
      para.push(line.trim());
    }
  }
  flushAll();
  return blocks;
}

/** Texto plano de una cadena Markdown (para resúmenes y metadatos). */
export function stripMarkdown(src: string): string {
  const walk = (nodes: Inline[]): string =>
    nodes.map((n) => (n.t === "text" || n.t === "code" ? n.v : walk(n.c))).join("");
  return walk(parseInline(src));
}

/** Hecho clave en texto plano de una línea (aplana listas y quita marcadores). */
export function factText(src: string): string {
  return stripMarkdown(
    src
      .replace(/^\s*[-*+]\s+/, "")
      .replace(/\s*\n\s*[-*+]\s+/g, " · ")
      .replace(/\s*\n\s*/g, " "),
  );
}
