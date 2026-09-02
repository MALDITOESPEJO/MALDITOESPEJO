# EDITORIAL IMPACT PROPAGATION ENGINE

## Propósito

El Editorial Impact Propagation Engine identifica qué partes de una investigación y de un artículo pueden quedar afectadas cuando cambia, se corrige, se sustituye o se cuestiona una evidencia.

No decide por sí mismo que una noticia sea falsa ni publica correcciones automáticamente. Su función es localizar el impacto y detener la continuidad automática cuando el cambio puede afectar al contenido publicado.

## Principio fundamental

> **CAMBIO EN LA EVIDENCIA → IMPACTO DOCUMENTAL → CLAIMS AFECTADOS → CÁLCULOS AFECTADOS → FRASES AFECTADAS → TITULAR/ENTRADILLA → REVISIÓN EDITORIAL**

Una modificación material de una fuente no debe quedar aislada en el registro de evidencia.

## Unidad de impacto

La unidad mínima es el vínculo documental:

`EVIDENCE → CLAIM → SENTENCE → ARTICLE`

Los cálculos forman una vía adicional:

`EVIDENCE → INPUT CLAIM → CALCULATION → DERIVED CLAIM → SENTENCE → ARTICLE`

## Cambios relevantes

Se consideran potencialmente relevantes:

- nueva versión de una evidencia;
- `supersedes_id` sobre una evidencia anterior;
- evidencia marcada `SUPERSEDED`;
- evidencia marcada `CONTESTS`;
- cambio material en fecha, periodo, cifra o documento;
- cambio de procedencia;
- contradicción nueva;
- pérdida de suficiencia o verificación de un claim;
- dato de entrada de un cálculo que deja de ser válido.

## Propagación

El motor debe localizar, en este orden:

1. evidencia directamente afectada;
2. claims que dependen de ella;
3. cálculos que utilizan esos claims o evidencias;
4. claims derivados afectados por esos cálculos;
5. frases del artículo vinculadas a esos claims;
6. titular y entradilla cuando estén vinculados;
7. estado editorial que debe revisarse.

## Niveles

### LEVEL_0 — SIN IMPACTO MATERIAL

Cambio documental sin efecto conocido sobre claims o texto publicado.

### LEVEL_1 — IMPACTO LOCAL

Afecta a una evidencia o claim concreto, sin afectar al núcleo de la pieza.

### LEVEL_2 — IMPACTO ARTICULAR

Afecta a varias afirmaciones, cálculos o párrafos y exige reverificación.

### LEVEL_3 — IMPACTO CENTRAL

Afecta al titular, entradilla, afirmación central, cifra esencial, atribución principal o interpretación principal.

### LEVEL_4 — BLOQUEO EDITORIAL

La nueva evidencia deja sin respaldo una afirmación esencial o introduce una contradicción material no resuelta.

## Estados

- `NO_MATERIAL_IMPACT`
- `IMPACT_REVIEW_REQUIRED`
- `CENTRAL_IMPACT_REVIEW_REQUIRED`
- `PUBLICATION_RECHECK_REQUIRED`
- `CORRECTION_REVIEW_REQUIRED`

## Regla de seguridad

Cuando exista duda sobre el alcance del impacto, el sistema debe ampliar la revisión, nunca reducirla automáticamente.

> **MEJOR REVISAR DE MÁS QUE MANTENER PUBLICADA UNA AFIRMACIÓN CUYO RESPALDO HA CAMBIADO.**

## Correcciones

Una corrección no elimina la historia anterior del sistema.

Debe conservarse:

`EVIDENCIA v1 → EVIDENCIA v2 → CLAIMS AFECTADOS → DECISIÓN EDITORIAL`

Si el artículo ya estaba publicado y el cambio afecta al titular, entradilla o una afirmación esencial, el estado debe pasar a revisión de corrección.

## Lenguaje público

El motor es interno. El lector no necesita ver IDs técnicos. La redacción pública debe explicar de forma clara qué ha cambiado y, cuando corresponda, qué parte de la información anterior debe corregirse.

## Límite de automatización

El motor puede localizar dependencias documentadas. No puede decidir por sí solo si una corrección es sustantivamente cierta, si una contradicción está resuelta o qué texto final debe publicar MALDITOESPEJO.

La decisión final corresponde al editor.

## Principio final

**Una evidencia que cambia puede cambiar una frase, un dato, un titular o toda una noticia. El sistema debe encontrar dónde antes de que el cambio llegue al lector.**
