# MALDITOESPEJO — DESCOMPOSICIÓN DE AFIRMACIONES

## Objetivo

Una entrada informativa puede contener varias afirmaciones distintas. El sistema debe separarlas antes de buscar evidencia.

La regla es:

`ENTRADA → AFIRMACIONES ATÓMICAS → EVIDENCIA NECESARIA`

No se debe tratar una frase compleja como un único hecho cuando contiene varias afirmaciones que podrían tener fuentes, fechas o grados de certeza diferentes.

## Tipos

- `FACT`: hecho comprobable mediante evidencia documental u observable.
- `STATEMENT`: algo atribuido a una persona, organización o fuente.
- `CONTEXT`: información necesaria para comprender el hecho, pero no el hecho central.
- `UNKNOWN`: cuestión relevante para la que no existe confirmación suficiente.
- `PENDING`: cuestión que requiere una comprobación todavía no realizada.

## Prioridad

- `CENTRAL`: afecta al titular o a la tesis principal.
- `IMPORTANT`: afecta materialmente al artículo.
- `CONTEXTUAL`: aporta contexto.
- `SECONDARY`: interés menor.

## Regla de atomización

Una afirmación debe dividirse cuando contiene dos o más elementos que puedan variar de forma independiente:

- persona + acontecimiento;
- acontecimiento + fecha;
- acontecimiento + cifra;
- causa + consecuencia;
- atribución + hecho independiente;
- hecho + interpretación.

Ejemplo:

`La empresa perdió 20 millones por una caída de ventas del 15%` 

debe convertirse, como mínimo, en:

1. La empresa perdió 20 millones.
2. Las ventas cayeron un 15%.
3. La caída de ventas fue la causa de la pérdida.

Las dos primeras son comprobaciones documentales diferentes; la tercera exige evidencia causal y no puede inferirse automáticamente de las anteriores.

## Regla de no inferencia

El sistema no añadirá causas, intenciones, responsabilidades, fechas exactas ni consecuencias que no estén expresamente contenidas en la entrada o sustentadas posteriormente por evidencia.

## Titular y entradilla

Las afirmaciones utilizadas para el titular y la entradilla reciben prioridad `CENTRAL` y deberán disponer de trazabilidad documental antes de poder publicarse.

## Resultado esperado

Cada claim debe terminar con:

`claim_id → type → importance → verification_status → evidence_required`

La descomposición no verifica la afirmación. Solo determina qué debe comprobarse.
