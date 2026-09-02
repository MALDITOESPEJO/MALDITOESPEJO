# PUBLISHED ARTICLE CORRECTION ENGINE

## Propósito

Convertir un cambio material en una evidencia ya utilizada por una noticia publicada en una revisión editorial trazable, sin borrar el estado histórico de la pieza.

## Principio

> **Una noticia publicada no queda congelada frente a nueva evidencia. Pero una corrección tampoco debe borrar lo que se publicó anteriormente.**

## Cadena

`CAMBIO EN EVIDENCIA → IMPACTO → CLAIM AFECTADO → FRASES AFECTADAS → TITULAR/ENTRADILLA → REVALIDACIÓN → DECISIÓN EDITORIAL → CORRECCIÓN/ACTUALIZACIÓN`

## Estados

- `NO_IMPACT`
- `REVIEW_REQUIRED`
- `UPDATE_REQUIRED`
- `CORRECTION_REQUIRED`
- `CORRECTION_PUBLISHED`
- `REVALIDATED`
- `CONTESTED`

## Cuándo se activa

El motor debe poder activarse cuando una evidencia:

- sea corregida;
- sea sustituida por una nueva versión;
- quede obsoleta;
- sea impugnada o contradicha;
- pierda validez temporal;
- cambie un dato utilizado en un cálculo;
- revele que una afirmación publicada tenía un alcance excesivo.

## Propagación

El impacto se propaga únicamente por relaciones documentadas:

`EVIDENCE → CLAIM → CALCULATION → SENTENCE → ARTICLE ELEMENT`

No se presume que todo el artículo queda invalidado porque cambie una evidencia.

## Corrección frente a actualización

**Actualización:** la noticia sigue siendo sustancialmente correcta y se incorpora información posterior.

**Corrección:** existe un error material en lo publicado que exige modificar la representación de los hechos.

La clasificación final corresponde al editor.

## Titular y entradilla

Si el cambio afecta una afirmación presente en titular o entradilla, la pieza debe pasar como mínimo a `REVIEW_REQUIRED` y no puede considerarse revalidada automáticamente.

Si el cambio demuestra que el titular o entradilla era materialmente incorrecto, el resultado recomendado es `CORRECTION_REQUIRED`.

## Historial

Nunca se sobrescribe silenciosamente el estado anterior. Cada corrección debe conservar:

- versión anterior;
- versión nueva;
- evidencia que provocó el cambio;
- claims afectados;
- elementos afectados;
- fecha;
- responsable editorial;
- decisión adoptada;
- explicación pública cuando proceda.

## Regla de seguridad

Si no puede determinarse con suficiente seguridad qué parte de la pieza queda afectada, el resultado es `REVIEW_REQUIRED`, no `NO_IMPACT`.

## Lenguaje público

La explicación al lector debe ser clara y proporcional. No se expondrá la complejidad interna del sistema salvo que sea relevante para entender la corrección.

> **La investigación puede ser compleja; la explicación no debe serlo.**

## Límite de automatización

El sistema puede localizar dependencias y señalar impacto. No decide por sí solo si existe un error periodístico, ni si corresponde corregir, actualizar, retirar o mantener una noticia.

## Regla final

> **Cuando cambia la evidencia, MALDITOESPEJO no reescribe a ciegas: identifica el impacto, vuelve a comprobar las afirmaciones afectadas y deja la decisión final en manos del editor.**
