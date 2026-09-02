# EVIDENCE COVERAGE / CLAIM COMPLETENESS ENGINE

## Propósito

Comprobar que las afirmaciones relevantes de una pieza tienen una cobertura documental suficiente antes de que puedan entrar en el texto publicable.

El objetivo no es acumular fuentes, sino responder a una pregunta sencilla:

> **¿Podemos demostrar documentalmente cada cosa importante que estamos diciendo?**

## Principio central

`CLAIM IDENTIFICADO → EVIDENCIA VINCULADA → EVIDENCIA SUFICIENTE → COBERTURA → ARTÍCULO`

La ausencia de cobertura debe reducir el alcance del artículo. Nunca debe rellenarse mediante inferencias no documentadas.

## Cobertura por claim

Cada claim debe clasificarse como:

- `COVERED`: existe evidencia suficiente y compatible.
- `PARTIALLY_COVERED`: existe apoyo parcial; requiere limitar la redacción.
- `UNCOVERED`: no existe evidencia suficiente.
- `CONTESTED`: existe evidencia incompatible pendiente.
- `NOT_REQUIRED`: claim no factual/editorial y correctamente identificado.

## Claims críticos

Reciben prioridad máxima:

1. titular;
2. entradilla;
3. hecho central;
4. cifras principales;
5. fechas esenciales;
6. atribuciones principales;
7. relaciones causales;
8. conclusiones jurídicas o científicas;
9. afirmaciones que puedan cambiar la interpretación del lector.

## Regla del titular

> **Toda afirmación factual del titular debe tener cobertura documental directa dentro del alcance publicable.**

No basta con que el cuerpo del artículo contenga una fuente que permita una interpretación más prudente.

## Regla de la entradilla

La entradilla no puede afirmar más que el titular ni introducir una conclusión que no esté cubierta por evidencia suficiente.

## Cobertura de números

Una cifra requiere, como mínimo:

- valor;
- unidad;
- periodo;
- fuente;
- evidencia concreta;
- coherencia temporal.

Si MALDITOESPEJO calcula la cifra, también requiere la fórmula y los datos de entrada.

## Cobertura de declaraciones

Una fuente puede demostrar que una persona dijo algo.

Eso no demuestra automáticamente que lo dicho sea cierto.

Por tanto:

`DECLARACIÓN → COBERTURA DE LA DECLARACIÓN`

no equivale a:

`DECLARACIÓN → VERDAD DEL CONTENIDO`

## Cobertura de contexto

El contexto también debe estar respaldado cuando contiene hechos, cifras, fechas o relaciones causales.

No se permite introducir “datos conocidos” sin fuente solo porque parezcan secundarios.

## Dependencias

Si un claim B depende de A:

`A NO VERIFICADO → B NO PUEDE ESTAR VERIFICADO COMO HECHO DERIVADO`

La cobertura se propaga hacia abajo, pero no aumenta la certeza de una afirmación.

## Huecos críticos

Un artículo queda bloqueado cuando existe un claim crítico que sea:

- `UNCOVERED`;
- `CONTESTED`;
- `RECHECK_REQUIRED`;
- dependiente de un claim no verificado;
- sustentado únicamente por una reproducción cuando era razonablemente posible localizar la fuente original.

## Publicación parcial

Los claims cubiertos pueden seguir siendo publicables si forman una pieza coherente por sí mismos.

Los claims sin cobertura deben:

- eliminarse;
- reformularse como cuestión abierta, cuando proceda;
- o quedar fuera del alcance publicable.

El titular y la entradilla deben reconstruirse exclusivamente con claims cubiertos.

## Originalidad

Tener cobertura documental no autoriza a copiar la estructura o redacción de una fuente.

`COBERTURA ≠ ORIGINALIDAD`

Ambos controles son independientes.

## Estados del artículo

- `FULLY_COVERED`
- `PARTIALLY_COVERED`
- `CRITICAL_GAP`
- `CONTESTED_COVERAGE`
- `REVIEW_REQUIRED`

## Fail-safe

Cuando exista un hueco documental relevante:

> **NO PUBLICAR TODAVÍA. REDUCIR EL ALCANCE O CONTINUAR LA INVESTIGACIÓN.**

## Lenguaje público

La complejidad de la matriz de cobertura es interna. El lector debe recibir únicamente una explicación clara de aquello que está demostrado y de aquello que permanece abierto.

## Regla final

> **Ninguna afirmación entra en MALDITOESPEJO por ocupar una frase: entra porque podemos respaldarla.**
