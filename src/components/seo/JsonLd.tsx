interface JsonLdProps {
  data: Record<string, unknown>;
}

/**
 * Inyecta datos estructurados (JSON-LD) en el cuerpo de la pagina.
 * SSR/Server-Server por defecto.
 */
export function JsonLd({ data }: JsonLdProps) {
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(data) }}
    />
  );
}
