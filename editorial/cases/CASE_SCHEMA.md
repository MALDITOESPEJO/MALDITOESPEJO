# MALDITOESPEJO — CASE ENGINE

## 1. Objetivo

Un `case` es la unidad de trabajo que permite transformar una pista informativa en una noticia original, verificable y trazable.

El caso conserva el recorrido completo de la investigación sin confundir la fuente inicial con la evidencia de publicación.

## 2. Flujo

`INPUT → CLAIMS → SOURCES → EVIDENCE → PROVENANCE → CONTRADICTIONS → VERIFICATION → DRAFT → VALIDATION → EDITORIAL GATE`

## 3. Entrada

La entrada puede ser:

- una noticia externa;
- una URL;
- un comunicado;
- un documento;
- una declaración;
- un dato;
- una pista;
- varias fuentes iniciales.

La entrada se registra como `DISCOVERY_INPUT`. No se considera verdadera por el mero hecho de haber sido recibida.

## 4. Identificación

Todo caso debe disponer de un identificador único:

`CASE-########`

Campos mínimos:

- `case_id`
- `created_at`
- `status`
- `input_type`
- `input_reference`
- `editorial_section`
- `assigned_author`

## 5. Estados

- `INPUT`
- `INVESTIGATING`
- `EVIDENCE_READY`
- `VERIFIED`
- `EDITOR_REVIEW`
- `APPROVED`
- `PUBLISHED`
- `RECHECK_REQUIRED`
- `CONTESTED`
- `BLOCKED`

El sistema debe fallar de forma segura: si falta evidencia suficiente, procedencia o resolución de un conflicto material, no puede avanzar automáticamente a publicación.

## 6. Afirmaciones

Cada afirmación material debe tener:

`CLAIM → EVIDENCE → SOURCE → PROVENANCE → ASSESSMENT`

Las afirmaciones se clasifican como:

- `FACT`
- `STATEMENT`
- `CONTEXT`
- `UNKNOWN`
- `PENDING`

## 7. Fuentes

Una fuente puede desempeñar distintos papeles, pero el caso debe distinguir expresamente:

- `DISCOVERY`
- `PUBLICATION`
- `CORROBORATION`
- `CONTEXT`

Una fuente de descubrimiento no se convierte automáticamente en fuente pública.

## 8. Evidencia y procedencia

Cada evidencia debe conservar, cuando sea posible:

- `evidence_id`
- `source_id`
- `lineage_id`
- `independence_group`
- `relationship_type`
- `provenance_status`
- fecha de publicación/observación
- documento o registro de origen

Una URL adicional no constituye por sí misma una nueva evidencia independiente.

## 9. Contradicciones

La investigación debe buscar activamente información que contradiga las afirmaciones centrales.

Si existe una contradicción material y no puede resolverse documentalmente, el caso pasa a `CONTESTED` o `BLOCKED` y requiere revisión humana.

## 10. Redacción

El artículo se genera únicamente desde las afirmaciones y evidencias que han superado los controles.

La estructura pública debe ser clara y propia:

`TITULAR → ENTRADILLA → HECHOS → CONTEXTO → DECLARACIONES → LO QUE NO SE SABE → FUENTES`

No se debe reproducir mecánicamente la estructura narrativa de la fuente de descubrimiento.

## 11. Regla de lenguaje

La investigación puede ser compleja; la explicación no debe serlo.

El sistema debe preferir una afirmación más limitada pero demostrable frente a una afirmación más llamativa sin respaldo suficiente.

## 12. Regla de publicación

El objetivo operativo no es demostrar una verdad absoluta mediante automatización.

El estándar es:

> **No publicar ninguna afirmación que el proceso editorial no pueda respaldar documentalmente.**

La decisión final de publicación corresponde al editor humano.
