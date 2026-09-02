# ARTICLE VERSIONING — VERSIONADO EDITORIAL

## Propósito

Mantener una cadena histórica e inmutable de las versiones de una noticia publicada.

Una nueva versión no sustituye documentalmente a la anterior: la enlaza.

## Cadena

`ARTÍCULO v1 → REVISIÓN → DECISIÓN → ARTÍCULO v2 → REVISIÓN → ARTÍCULO v3`

## Identidad

Cada versión publicada debe conservar:

- `article_id`: identidad estable de la noticia.
- `version`: versión incremental (`v1`, `v2`, `v3`...).
- `previous_version`: versión inmediatamente anterior.
- `created_at`: momento de creación de la versión.
- `published_at`: momento de publicación de esa versión.
- `status`: estado editorial de la versión.
- `change_reason`: motivo del cambio.
- `correction_id`: si procede de una corrección.

## Tipos de cambio

- `INITIAL_PUBLICATION`: primera publicación.
- `UPDATE`: se incorpora información nueva sin corregir necesariamente un error anterior.
- `CORRECTION`: se modifica información porque la versión anterior contenía un error material.
- `WITHDRAWAL`: la pieza deja de estar publicada.
- `NO_CHANGE`: revisión que no genera una nueva versión pública.

## Reglas

1. `article_id` permanece estable entre versiones.
2. El número de versión nunca se reutiliza.
3. Una versión nueva debe apuntar a la inmediatamente anterior.
4. Una corrección debe enlazar su `correction_id`.
5. Una actualización no debe etiquetarse como corrección si no existe un error material identificado.
6. Una retirada no borra las versiones históricas.
7. Ninguna automatización modifica silenciosamente una versión publicada.
8. Una versión `PUBLISHED` requiere pasar el Publication Gate vigente.
9. Si una nueva evidencia afecta al titular o a la entradilla, la revisión editorial es obligatoria antes de mantener o sustituir la versión pública.
10. La explicación pública del cambio debe ser comprensible para el lector.

## Inmutabilidad editorial

Una vez publicada una versión, sus metadatos históricos esenciales no deben sobrescribirse para ocultar el estado anterior. Los cambios materiales generan una nueva versión o un registro explícito de retirada/corrección.

## Regla de continuidad

`v2` puede corregir o actualizar `v1`, pero nunca debe hacer desaparecer el hecho de que `v1` existió.

> **La historia de una noticia también forma parte de su trazabilidad.**

La investigación puede ser compleja; la explicación no debe serlo.
