# MALDITOESPEJO — REGLAS EJECUTABLES DE TRAZABILIDAD

## Objetivo

Convertir la regla editorial de trazabilidad en una comprobación automática sin pretender sustituir la verificación humana.

## Nivel 1 — Comprobación estructural

Para cada artículo en estado `verified` o `published`:

1. debe existir un expediente de verificación;
2. debe existir una sección de comprobación de afirmaciones;
3. debe existir una tabla de afirmación, evidencia y evaluación;
4. el expediente debe identificar el `article_id` correcto.

## Nivel 2 — Titular y entradilla

Antes de publicar, el sistema deberá comprobar que el expediente contiene el titular y la descripción del artículo, o referencias explícitas a las afirmaciones que los sostienen.

Si el sistema no puede establecer esa relación, debe bloquear la publicación para revisión humana.

## Nivel 3 — Evidencia

Cada afirmación material registrada debe tener una evidencia localizada y una evaluación. Una fila incompleta es un error, no una simple advertencia.

## Nivel 4 — Límites

El sistema no debe inferir que una fuente es fiable, que una afirmación es verdadera o que una contradicción está resuelta únicamente por coincidencia textual.

La comprobación automática certifica estructura y trazabilidad documental; la decisión sobre suficiencia de la evidencia corresponde al editor.

## Regla de transición

La automatización se incorporará progresivamente. Primero se comprueba que existe la relación documental; después podrá comprobarse la cobertura de afirmaciones materiales con mayor precisión.

No se crearán registros artificiales para hacer pasar artículos históricos o de prueba.
