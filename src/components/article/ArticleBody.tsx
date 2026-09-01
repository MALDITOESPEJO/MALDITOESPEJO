import type { Article } from "@/data/types";

interface ArticleBodyProps {
  article: Article;
}

/**
 * Cuerpo del articulo (voz editorial en serifa) dentro de la
 * columna de lectura. Renderiza los bloques editoriales; la
 * clasificacion (hecho/declaracion/contexto/pendiente) es
 * estructural y no requiere etiqueta visual.
 */
export function ArticleBody({ article }: ArticleBodyProps) {
  return (
    <div className="prose-editorial">
      {article.body.map((block, i) => (
        <p key={i}>{block.content}</p>
      ))}
    </div>
  );
}
