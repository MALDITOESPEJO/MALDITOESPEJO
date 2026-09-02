# WEB RESEARCH PROVIDER

## Objetivo

Conectar el plan de investigación de MALDITOESPEJO con un proveedor real de búsqueda web sin confundir resultados de búsqueda con evidencia verificada.

## Proveedor inicial recomendado

El adaptador se diseña inicialmente para **Brave Search API**, manteniendo una interfaz desacoplada del proveedor.

La API ofrece búsqueda web y de noticias y devuelve resultados estructurados con URL, contenido y metadatos. La autenticación se realiza mediante `X-Subscription-Token`.

Documentación oficial: https://api-dashboard.search.brave.com/api-reference/web/search/get

## Flujo

`RESEARCH PLAN → PROVIDER SEARCH → RAW RESULTS → NORMALIZATION → CANDIDATE RESULTS → EVIDENCE ACCEPTANCE → PROVENANCE`

## Regla fundamental

El proveedor únicamente recupera información.

`SEARCH RESULT ≠ EVIDENCE ≠ VERIFIED CLAIM`

Un resultado nunca debe marcar automáticamente una afirmación como `SUPPORTS`.

## Configuración

La clave debe existir únicamente como variable de entorno:

`BRAVE_SEARCH_API_KEY`

Nunca debe almacenarse en Git, JSON de casos, frontmatter, logs ni documentación.

## Adaptación

El adaptador debe producir un formato interno estable, independiente del proveedor:

- `query`
- `provider`
- `retrieved_at`
- `title`
- `url`
- `snippet`
- `publisher`
- `published_at`
- `result_type`
- `provider_rank`
- `provider_score`

Los campos que el proveedor no proporcione permanecen `null`; no se inventan.

## Restricciones editoriales

1. Los resultados se almacenan como candidatos.
2. La fuente debe identificarse antes de aceptar evidencia.
3. Debe distinguirse fuente primaria, secundaria, descubrimiento y corroboración.
4. La procedencia debe evaluarse antes de contar una fuente como independiente.
5. El contenido recuperado no autoriza por sí solo la publicación.
6. La aceptación de evidencia requiere evaluación explícita.
7. Las afirmaciones no verificadas permanecen fuera del alcance factual publicable.

## Trazabilidad

Cada ejecución debe conservar:

- identificador del caso;
- conjunto de consultas;
- proveedor utilizado;
- momento de recuperación;
- resultados recibidos;
- URL y título originales;
- relación entre resultado y `claim_id`;
- estado posterior de aceptación.

Esto permite reconstruir qué encontró el sistema y qué decidió posteriormente el proceso editorial.

## Sustitución de proveedor

Brave es el primer adaptador, no una dependencia conceptual del sistema. En el futuro podrán añadirse otros proveedores mediante el mismo contrato de resultados.

La arquitectura de MALDITOESPEJO debe poder cambiar de proveedor sin modificar la lógica de procedencia, contraste, verificación o publicación.

## Principio final

> El buscador encuentra. MALDITOESPEJO investiga. La evidencia se evalúa. La afirmación se verifica. Solo después puede publicarse.
