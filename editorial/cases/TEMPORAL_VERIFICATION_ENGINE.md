# TEMPORAL VERIFICATION ENGINE

## Propósito

Controlar que una afirmación se evalúe con evidencia temporalmente adecuada y que MALDITOESPEJO no presente como actual, vigente o contemporáneo un dato que pertenece a otro momento.

## Principio central

> **UN DATO CORRECTO EN UNA FECHA NO ES NECESARIAMENTE CORRECTO EN OTRA.**

La fecha forma parte de la evidencia cuando el contenido puede cambiar con el tiempo.

## Cadena

`CLAIM → TEMPORAL REQUIREMENT → EVIDENCE DATES → EFFECTIVE PERIOD → VERSION/CORRECTION → TEMPORAL ASSESSMENT → SUFFICIENCY → VERIFICATION`

## Qué comprueba

Para cada claim:

- fecha de publicación del documento;
- fecha en que se observó la evidencia;
- fecha o periodo al que se refiere el dato;
- fecha de entrada en vigor cuando corresponda;
- fecha de expiración o sustitución cuando exista;
- versiones posteriores y documentos que sustituyen a los anteriores;
- coherencia entre el tiempo expresado por el claim y el tiempo cubierto por la evidencia;
- lenguaje temporal del titular y de la entradilla.

## Claims temporalmente sensibles

Se consideran especialmente sensibles las afirmaciones que contienen o implican:

- hoy, ahora, actualmente, esta semana, este mes;
- vigente, en vigor, sigue, todavía;
- cifras de empleo, precios, mercados, encuestas o estadísticas;
- cargos o funciones actuales de una persona;
- normativa o decisiones vigentes;
- situaciones que pueden cambiar rápidamente;
- estados de empresas, productos, investigaciones o procedimientos.

Un claim puede declarar explícitamente `temporal_requirement: true` cuando el análisis editorial determine que necesita control temporal aunque no utilice una palabra temporal.

## Estados

- `CURRENTLY_SUPPORTED`: la evidencia cubre el periodo requerido.
- `HISTORICALLY_SUPPORTED`: la evidencia respalda el claim para un periodo pasado identificado.
- `PARTIALLY_TIME_ALIGNED`: solo una parte del periodo o alcance está cubierta.
- `STALE_EVIDENCE`: la evidencia es demasiado antigua para el alcance actual del claim.
- `SUPERSEDED`: la evidencia ha sido sustituida por una versión posterior relevante.
- `TEMPORALLY_CONTESTED`: existen evidencias con periodos incompatibles o conflicto temporal material.
- `TEMPORALLY_UNASSESSED`: todavía no puede determinarse la adecuación temporal.

## Regla de interpretación

El motor no decide que una afirmación sea verdadera. Decide si el componente temporal de la documentación es compatible con lo que el claim pretende afirmar.

Ejemplos:

- Un dato oficial de agosto puede respaldar una cifra de agosto, pero no necesariamente una cifra de septiembre.
- Una sentencia de 2025 demuestra qué resolvió el tribunal en esa fecha; no demuestra por sí sola que el mismo estado jurídico siga vigente en 2026.
- Una declaración publicada hoy demuestra que una persona hizo esa declaración hoy; no demuestra automáticamente que el contenido descrito siga siendo cierto.

## Versiones y correcciones

Cuando una evidencia tiene una versión posterior materialmente distinta:

`EVIDENCE v1 → supersedes_id → EVIDENCE v2`

La versión posterior debe utilizarse cuando sea la vigente para el claim. La versión anterior se conserva para auditoría y no cuenta como corroboración independiente.

## Regla para cifras

Todo claim numérico temporalmente sensible debe poder identificar, cuando corresponda:

`VALOR + UNIDAD + PERIODO + FUENTE`

No se debe transformar una cifra mensual, trimestral o anual en una afirmación sobre otro periodo sin una justificación documental o un cálculo explícito.

## Regla para normativa y derecho

Para afirmar que una norma está vigente debe comprobarse, según el caso:

- texto aplicable;
- fecha de entrada en vigor;
- derogación o modificación;
- disposición transitoria relevante;
- versión consolidada cuando sea necesaria.

Una fuente que describe una norma no sustituye al texto jurídico cuando este puede localizarse razonablemente.

## Regla de publicación

Si el claim requiere actualidad y la evidencia no permite establecerla, el resultado es:

> **NO PUBLICAR TODAVÍA COMO HECHO ACTUAL.**

Puede publicarse únicamente un alcance histórico o más limitado si ese alcance está claramente respaldado y supera el resto de controles.

## Automatización y revisión humana

La máquina puede detectar fechas, periodos, versiones, palabras temporales y posibles desajustes. No puede resolver por sí sola todas las cuestiones jurídicas, históricas o contextuales sobre vigencia.

Los casos ambiguos pasan a `REVIEW_REQUIRED` y la decisión final corresponde al editor.

## Lenguaje público

La explicación debe seguir siendo sencilla:

- “Los datos de agosto muestran…”
- “Según la información disponible a 2 de septiembre…”
- “La norma entró en vigor el…”
- “Ese dato corresponde al periodo…”

> **La investigación puede ser compleja; la explicación no debe serlo.**

## Regla de seguridad

`TEMPORALMENTE ADECUADO ≠ VERDADERO`

El control temporal es una condición de calidad de la evidencia, no una garantía de verdad material.
