# MALDITOESPEJO — CONTRAST ENGINE

## Objetivo

Comparar las evidencias asociadas a una afirmación y determinar si la respaldan, la contradicen o no permiten todavía una conclusión suficiente.

## Cadena

`CLAIM → EVIDENCIAS → PROCEDENCIA → COMPARACIÓN → CONFLICTO → ESTADO`

## Principio

El motor no cuenta enlaces. Compara evidencia.

Una afirmación puede tener:

- una evidencia que la respalda;
- varias evidencias que proceden de la misma fuente original;
- corroboración realmente independiente;
- evidencia parcial;
- evidencia contradictoria;
- evidencia insuficiente.

## Tipos de resultado

- `SUPPORTED`: evidencia suficiente sin conflicto material identificado.
- `PARTIALLY_SUPPORTED`: solo una parte de la afirmación queda respaldada.
- `CONTESTED`: existe evidencia relevante en conflicto.
- `INSUFFICIENT`: no hay evidencia suficiente para sostenerla.
- `UNASSESSED`: todavía no se ha realizado la comparación.

## Conflicto material

Se considera material cuando la discrepancia puede cambiar:

- el titular;
- la entradilla;
- el hecho central;
- una cifra esencial;
- la atribución principal;
- la interpretación que razonablemente obtendría el lector.

Un conflicto material no se resuelve eligiendo automáticamente la fuente que parezca más conveniente.

## Independencia

Antes de contar una corroboración debe comprobarse la procedencia.

`REPRODUCE / QUOTES / DERIVED_FROM` → no constituye automáticamente independencia.

`INDEPENDENT_OBSERVATION` → posible corroboración independiente, pendiente de evaluación editorial.

## Regla de bloqueo

Si existe una contradicción material sin resolver, el claim no puede pasar a `SUPPORTED` ni el caso a publicación.

El sistema debe preferir:

`RECHECK_REQUIRED` o `CONTESTED`

antes que completar artificialmente una verificación.

## Preguntas que debe responder

1. ¿Qué evidencia apoya el claim?
2. ¿Qué evidencia lo contradice?
3. ¿Proceden de la misma línea de origen?
4. ¿Existe corroboración independiente?
5. ¿La diferencia es material?
6. ¿Qué parte de la afirmación permanece sin resolver?

## Lenguaje público

Si existe conflicto relevante, la noticia debe explicarlo de forma sencilla. No se debe ocultar una discrepancia importante detrás de una redacción aparentemente segura.

> La investigación puede ser compleja; la explicación no debe serlo.
