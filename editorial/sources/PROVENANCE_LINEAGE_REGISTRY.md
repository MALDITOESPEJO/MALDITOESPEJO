# MALDITOESPEJO — REGISTRO DE LINAJE DE PROCEDENCIA

## 1. Objetivo

Registrar de dónde procede una evidencia y evitar que varias reproducciones de una misma información se cuenten como corroboraciones independientes.

La regla central es:

> **Una URL adicional no crea por sí sola una nueva línea de evidencia.**

## 2. Cadena mínima

```text
OBSERVACIÓN
  ↓
EVIDENCIA
  ↓
DOCUMENTO / REGISTRO ORIGINAL
  ↓
FUENTE DE ORIGEN
```

Cuando existe reproducción:

```text
REPRODUCCIÓN
  ↓
FUENTE REPRODUCTORA
  ↓
FUENTE DE ORIGEN
  ↓
EVIDENCIA ORIGINAL
```

## 3. Campos mínimos

Cada elemento de evidencia que participe en una verificación debe poder identificar, cuando sea posible:

- `evidence_id`
- `source_id`
- `document_or_record`
- `published_at`
- `observed_at`
- `provenance_parent_id`
- `lineage_id`
- `independence_group`
- `relationship_type`
- `evidence_role`
- `notes`

## 4. Lineage ID

`lineage_id` identifica la línea de procedencia de la información.

Ejemplo:

```text
COMUNICADO OFICIAL
      ↓
REUTERS
      ↓
EFE
      ↓
MEDIO LOCAL
```

Si todos reproducen el mismo comunicado, los cuatro elementos pertenecen a la misma línea de procedencia.

No deben contarse como cuatro corroboraciones independientes.

## 5. Independence group

`independence_group` identifica evidencias que dependen del mismo origen o de una cadena materialmente compartida.

Dos elementos solo deben recibir grupos diferentes cuando exista una base razonable para considerar que su obtención fue independiente.

## 6. Tipos básicos de relación

- `ORIGINAL` — evidencia primaria de origen conocido.
- `REPRODUCES` — reproduce información anterior.
- `QUOTES` — atribuye información a otra fuente.
- `DERIVED_FROM` — resultado elaborado a partir de otra evidencia.
- `AGGREGATES` — combina varias fuentes.
- `ENRICHES` — añade metadatos o análisis sin crear necesariamente evidencia independiente.
- `INDEPENDENT_OBSERVATION` — observación obtenida por una vía independiente.
- `UNKNOWN_PROVENANCE` — procedencia todavía no establecida.

## 7. Regla para agencias y medios

Reuters, AP, AFP, EFE y otros medios pueden aportar corroboración independiente, pero solo después de comprobar su procedencia.

No se considerarán independientes simplemente porque publiquen textos separados.

Debe preguntarse:

1. ¿Obtuvieron la información de fuentes distintas?
2. ¿Entrevistaron a personas distintas?
3. ¿Obtuvieron documentos distintos?
4. ¿Realizaron observaciones propias?
5. ¿O están reproduciendo el mismo comunicado, agencia o fuente?

## 8. Regla de agregadores

Los agregadores son útiles para descubrir información.

Si una noticia aparece en un agregador, el sistema debe intentar localizar la fuente original antes de atribuir valor probatorio adicional.

## 9. Regla de datasets

Dos bases de datos que utilicen la misma fuente administrativa o el mismo conjunto de datos de origen no deben considerarse automáticamente independientes.

La metodología y las fuentes de entrada deben conservarse cuando estén disponibles.

## 10. Contradicciones

Si dos líneas de evidencia independientes presentan conclusiones incompatibles, deben conservarse ambas.

El sistema debe generar una señal interna:

`EDITORIAL_CONFLICT_ALERT`

No se resolverá una contradicción mediante mayoría de enlaces o número de publicaciones.

## 11. Estados de procedencia

- `ESTABLISHED` — procedencia documentada.
- `PARTIAL` — parte de la cadena está documentada.
- `UNKNOWN` — procedencia no establecida.
- `CONTESTED` — existen fuentes o evidencias que cuestionan la procedencia.

Una evidencia con procedencia desconocida no debe recibir automáticamente el mismo peso que una evidencia primaria trazable.

## 12. Principio editorial

El registro de procedencia es interno. La noticia pública debe mostrar únicamente las fuentes necesarias para que el lector pueda entender y comprobar la información publicada.

No se publicará una lista de medios utilizados únicamente para descubrir una historia.

## 13. Límite de automatización

El sistema puede detectar relaciones declaradas, duplicaciones y cadenas conocidas.

No puede determinar por sí solo que dos testimonios son realmente independientes ni que una fuente está diciendo la verdad.

Esas decisiones siguen correspondiendo al editor.

> **La investigación puede ser compleja; la explicación no debe serlo.**
