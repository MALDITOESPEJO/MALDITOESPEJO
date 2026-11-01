import type { ReactNode } from "react";
import { parseMarkdownBlock, type Inline } from "@/lib/markdown";

function renderInline(nodes: Inline[]): ReactNode[] {
  return nodes.map((n, i) => {
    switch (n.t) {
      case "text":
        return n.v;
      case "strong":
        return <strong key={i}>{renderInline(n.c)}</strong>;
      case "em":
        return <em key={i}>{renderInline(n.c)}</em>;
      case "code":
        return <code key={i}>{n.v}</code>;
      case "link": {
        const external = /^https?:\/\//i.test(n.href);
        return (
          <a key={i} href={n.href} {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}>
            {renderInline(n.c)}
          </a>
        );
      }
    }
  });
}

/** Renderiza el contenido Markdown de un bloque editorial como HTML semántico. */
export function MarkdownBlocks({ content }: { content: string }) {
  return (
    <>
      {parseMarkdownBlock(content).map((b, i) => {
        switch (b.t) {
          case "p":
            return <p key={i}>{renderInline(b.c)}</p>;
          case "h":
            return b.level === 2 ? (
              <h2 key={i} className="prose-h">{renderInline(b.c)}</h2>
            ) : (
              <h3 key={i} className="prose-h prose-h3">{renderInline(b.c)}</h3>
            );
          case "ul":
            return (
              <ul key={i} className="prose-list">
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ul>
            );
          case "ol":
            return (
              <ol key={i} className="prose-list prose-list-ol">
                {b.items.map((it, j) => (
                  <li key={j}>{renderInline(it)}</li>
                ))}
              </ol>
            );
          case "quote":
            return <blockquote key={i} className="prose-quote">{renderInline(b.c)}</blockquote>;
        }
      })}
    </>
  );
}
