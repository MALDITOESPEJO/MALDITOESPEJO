import Image from "next/image";

import type { Article } from "@/data/types";

interface ImageMarshalProps {
  article: Article;
  sizes?: string;
  priority?: boolean;
  className?: string;
}

/**
 * Renderiza la imagen de un articulo cuando esta existe.
 * Sin imagen real, no se muestra ninguna (no se insertan
 * ilustraciones decorativas por defecto).
 */
export function ImageMarshal({
  article,
  sizes = "(max-width: 768px) 100vw, 800px",
  priority = false,
  className = "",
}: ImageMarshalProps) {
  if (!article.image) {
    return null;
  }

  return (
    <div className={`overflow-hidden ${className}`}>
      <Image
        src={article.image.src}
        alt={article.image.alt}
        width={article.image.width}
        height={article.image.height}
        sizes={sizes}
        priority={priority}
        className="aspect-[16/9] w-full object-cover"
      />
    </div>
  );
}
