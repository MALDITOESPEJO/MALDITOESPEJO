interface GiantWordmarkProps {
  text: string;
  /** Altura relativa del rótulo respecto a su ancho (viewBox 1000 × height). */
  height?: number;
  /** Recorta la mitad inferior (pie de página). */
  cropped?: boolean;
  /** Reflejo de espejo difuminado bajo el rótulo (altura visible en unidades del viewBox). */
  reflect?: number;
  className?: string;
}

/**
 * Rótulo gigante a todo el ancho. SVG con `textLength`: el texto se estira para
 * ocupar siempre el 100 % del contenedor, sea cual sea el ancho de pantalla.
 * Con `reflect` añade un reflejo vertical que se desvanece: el "espejo".
 */
export function GiantWordmark({ text, height = 250, cropped = false, reflect = 0, className = "" }: GiantWordmarkProps) {
  const base = height * 0.93;
  const total = height + reflect;
  const label = text.toUpperCase();
  const common = { x: 0, textLength: 1000, lengthAdjust: "spacingAndGlyphs" as const, fontSize: height * 1.32 };

  return (
    <svg
      className={`giant-wordmark${cropped ? " giant-wordmark-cropped" : ""} ${className}`}
      style={{ aspectRatio: `1000 / ${total}` }}
      viewBox={`0 0 1000 ${total}`}
      role="img"
      aria-label={text}
      preserveAspectRatio="none"
    >
      <text {...common} y={base}>
        {label}
      </text>
      {reflect > 0 && (
        <>
          <defs>
            <linearGradient id="gw-fade" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0" stopColor="#fff" stopOpacity="0.45" />
              <stop offset="1" stopColor="#fff" stopOpacity="0" />
            </linearGradient>
            <mask id="gw-mask" maskUnits="userSpaceOnUse" x="0" y={base} width="1000" height={reflect + height * 0.07}>
              <rect x="0" y={base} width="1000" height={reflect + height * 0.07} fill="url(#gw-fade)" />
            </mask>
          </defs>
          <g mask="url(#gw-mask)" aria-hidden="true">
            <text {...common} y={base} transform={`translate(0 ${base * 2}) scale(1 -1)`}>
              {label}
            </text>
          </g>
        </>
      )}
    </svg>
  );
}
