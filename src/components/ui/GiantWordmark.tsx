interface GiantWordmarkProps {
  text: string;
  /** Altura relativa del rótulo respecto a su ancho (viewBox 1000 × height). */
  height?: number;
  /** Recorta la mitad inferior (pie de página). */
  cropped?: boolean;
  className?: string;
}

/**
 * Rótulo gigante a todo el ancho. SVG con `textLength`: el texto se estira para
 * ocupar siempre el 100 % del contenedor, sea cual sea el ancho de pantalla.
 */
export function GiantWordmark({ text, height = 250, cropped = false, className = "" }: GiantWordmarkProps) {
  return (
    <svg
      className={`giant-wordmark${cropped ? " giant-wordmark-cropped" : ""} ${className}`}
      viewBox={`0 0 1000 ${height}`}
      role="img"
      aria-label={text}
      preserveAspectRatio="none"
    >
      <text
        x="0"
        y={height * 0.93}
        textLength="1000"
        lengthAdjust="spacingAndGlyphs"
        fontSize={height * 1.32}
      >
        {text.toUpperCase()}
      </text>
    </svg>
  );
}
