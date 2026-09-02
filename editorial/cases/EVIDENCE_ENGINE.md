# MALDITOESPEJO — EVIDENCE ENGINE

## Objetivo

Registrar evidencia documental concreta y vincularla con las afirmaciones que pretende respaldar.

El motor convierte una fuente localizada en un registro auditable. **No decide por sí mismo que una afirmación sea verdadera.**

## Cadena

`CLAIM → EVIDENCE → SOURCE → DOCUMENT/RECORD → PROVENANCE → ASSESSMENT`

## Identificación

Toda evidencia debe disponer de un identificador único:

`EVD-########`

Toda fuente utilizada debe conservar su `source_id` cuando exista en el registro maestro.

## Campos mínimos

- `evidence_id`
- `claim_id`
- `source_id`
- `source_role`
- `document_or_record`
- `observed_at`
- `published_at` cuando exista
- `evidence_role`
- `provenance_status`
- `independence_group`
- `lineage_id`
- `assessment`

## Roles de fuente

- `DISCOVERY`: localiza una posible historia.
- `PUBLICATION`: sustenta una afirmación que MALDITOESPEJO publica.
- `CORROBORATION`: permite contrastar una afirmación con otra línea de evidencia.
- `CONTEXT`: aporta contexto y no necesariamente prueba el hecho central.

## Regla central

Una evidencia solo puede respaldar una afirmación concreta en la medida en que el documento o registro realmente contenga información pertinente para ella.

`SOURCE FOUND ≠ EVIDENCE ACCEPTED`

## Procedencia

La evidencia debe conservar su línea de origen. Si una noticia reproduce un documento oficial, la noticia no crea una segunda línea independiente por el mero hecho de existir.

Se utilizarán:

- `lineage_id`
- `independence_group`
- `relationship_type`
- `provenance_status`

## Evaluación

Estados mínimos:

- `UNASSESSED`
- `SUPPORTS`
- `PARTIALLY_SUPPORTS`
- `DOES_NOT_SUPPORT`
- `CONTESTS`
- `SUPERSEDED`

El estado `SUPPORTS` significa que la evidencia respalda documentalmente la afirmación en el alcance indicado. No significa que toda la historia esté verificada.

## Correcciones

La evidencia materialmente modificada no se sobrescribe silenciosamente. Debe conservarse la versión anterior y enlazarse la nueva mediante `supersedes_id` cuando proceda.

## Regla de publicación

Ningún claim central puede considerarse listo para publicación si no existe evidencia aceptada, con procedencia identificable y evaluación documentada.

## Lenguaje

La investigación puede ser compleja; la explicación no debe serlo.
