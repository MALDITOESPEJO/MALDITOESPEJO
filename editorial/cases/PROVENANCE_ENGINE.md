# MALDITOESPEJO — PROVENANCE ENGINE

## Objetivo

Determinar y conservar la procedencia de cada evidencia para evitar que varias reproducciones de una misma información sean confundidas con corroboración independiente.

## Regla fundamental

> Una URL adicional no crea por sí sola una nueva línea de evidencia.

La pregunta no es cuántas páginas repiten un dato, sino **de dónde procede el dato que todas están reproduciendo**.

## Cadena de procedencia

`OBSERVACIÓN → EVIDENCIA → DOCUMENTO/REGISTRO → FUENTE DE ORIGEN`

Cuando existe reproducción:

`REPRODUCCIÓN → FUENTE REPRODUCTORA → FUENTE DE ORIGEN → EVIDENCIA ORIGINAL`

## Identificadores

Cada evidencia debe conservar, cuando sea posible:

- `evidence_id`
- `source_id`
- `lineage_id`
- `independence_group`
- `provenance_parent_id`
- `relationship_type`

## Relaciones

Valores permitidos:

- `ORIGINAL`
- `REPRODUCES`
- `QUOTES`
- `DERIVED_FROM`
- `AGGREGATES`
- `ENRICHES`
- `INDEPENDENT_OBSERVATION`
- `UNKNOWN_PROVENANCE`

## Independencia

Fuentes con la misma procedencia no deben contarse como corroboración independiente aunque sean documentos, páginas o medios diferentes.

Ejemplos:

- comunicado oficial → noticia que lo reproduce: misma línea de evidencia;
- informe oficial → varios medios que lo citan: una misma línea de origen;
- dos organismos que observan directamente el mismo fenómeno sin compartir datos: posible independencia, pendiente de evaluación;
- Reuters y AP: solo independientes si no comparten la misma línea de origen para la afirmación concreta.

El motor puede detectar relaciones declaradas, coincidencias y señales de dependencia. **La independencia sustantiva sigue siendo una decisión editorial.**

## Estados

- `ESTABLISHED`
- `PARTIAL`
- `UNKNOWN`
- `CONTESTED`

## Resultado operativo

Para cada evidencia, el motor debe poder responder:

1. ¿Qué fuente la aporta?
2. ¿Cuál es el documento o registro?
3. ¿Es original o reproduce otra fuente?
4. ¿De qué línea de procedencia procede?
5. ¿Comparte origen con otra evidencia?
6. ¿Puede considerarse independiente?

## Regla de seguridad

`MULTIPLES FUENTES ≠ MULTIPLES EVIDENCIAS INDEPENDIENTES`

Si la procedencia no puede determinarse razonablemente, el sistema debe conservar `UNKNOWN_PROVENANCE` y evitar presentar esa evidencia como corroboración independiente.

## Publicación

La procedencia debe quedar resuelta o expresamente declarada como incierta antes de utilizar una evidencia para sostener que una afirmación está corroborada.

## Lenguaje público

La complejidad de la procedencia pertenece al sistema interno. La noticia debe explicar únicamente lo necesario para que el lector entienda qué se sabe, quién lo acredita y qué sigue sin estar confirmado.
