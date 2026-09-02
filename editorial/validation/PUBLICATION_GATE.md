# MALDITOESPEJO — PUBLICATION GATE

## Objetivo

El Publication Gate convierte las condiciones editoriales previas a `published` en una comprobación ejecutable.

No decide si una noticia es verdadera. Comprueba que existe un registro explícito de que las condiciones editoriales ya han sido satisfechas.

## Flujo

`METADATA → VERIFICACIÓN → FUENTES DE PUBLICACIÓN → CONTRADICCIONES → APROBACIÓN HUMANA → PUBLICATION GATE → PUBLISHED`

## Registro

Cada artículo que figure como `published` debe disponer de un registro JSON en:

`editorial/publication-gates/<article-id>.json`

El registro debe acreditar:

- `verification_completed: true`
- `publication_sources_support: true`
- `material_contradictions_resolved: true`
- `human_editorial_approval: true`

El esquema está definido en `PUBLICATION_GATE_SCHEMA.json`.

## Ejecución

```bash
npm run check:publication
```

Un artículo publicado sin registro de gate queda **bloqueado** por la comprobación automática.

## Golden Article

El artículo de empleo del 2 de septiembre de 2026 permanece como caso de referencia. No se crea artificialmente un registro de aprobación para hacerlo pasar: hasta que exista una aprobación editorial explícita y documentada, el gate debe señalarlo.

Esto permite distinguir entre:

- un artículo heredado que aparece como `published`;
- un artículo que ha superado formalmente el nuevo Publication Gate.

## Límite

El gate no sustituye al editor. Una casilla verdadera solo tiene valor si corresponde a un proceso editorial real y documentado.

> **La automatización controla el proceso; la responsabilidad editorial sigue siendo humana.**
