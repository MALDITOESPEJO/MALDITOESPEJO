# Publication Gate — Registro de autorización

Esta carpeta contiene los registros que autorizan formalmente la publicación de artículos con `status: published`.

## Regla fundamental

Un registro del Publication Gate **no se crea para completar un trámite técnico**. Solo puede existir cuando la investigación y la decisión editorial correspondientes se han realizado realmente.

El Gate comprueba cinco elementos:

1. identificación correcta del artículo;
2. verificación completada;
3. fuentes de publicación que sostienen las afirmaciones publicadas;
4. contradicciones materiales resueltas;
5. aprobación editorial humana.

Todos deben constar como `true` en el registro de autorización.

## Flujo recomendado

`BORRADOR → REVISIÓN → VERIFICACIÓN → APROBACIÓN HUMANA → REGISTRO DEL GATE → PUBLICADO`

La documentación de investigación puede existir antes del registro del Gate. El registro de autorización debe ser el último paso, no el primero.

## Golden Article

El artículo de empleo de agosto de 2026 dispone de un registro de investigación separado en `editorial/validation/GOLDEN_ARTICLE_PUBLICATION_RECORD.md`.

Ese documento **no es una autorización de publicación** y no debe convertirse automáticamente en un archivo `.json` del Gate. El artículo sigue siendo un caso heredado hasta que exista una decisión editorial formal.

## Integridad

- No se inventan aprobaciones.
- No se asignan aprobadores ficticios.
- No se marca `true` una condición que todavía no se haya comprobado.
- La automatización controla el proceso, pero no sustituye al editor.
