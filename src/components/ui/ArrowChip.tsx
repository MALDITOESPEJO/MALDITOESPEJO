/** Recuadro con flecha: marca de enlace en tarjetas, destacados y "leer más". */
export function ArrowChip({ className = "" }: { className?: string }) {
  return (
    <span className={`chip-arrow ${className}`} aria-hidden="true">
      <svg width="14" height="10" viewBox="0 0 14 10" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M0 5h12M8 1l4 4-4 4" />
      </svg>
    </span>
  );
}
