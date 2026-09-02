# CALCULATION PROVENANCE & INVALIDATION ENGINE

## Propósito

Garantizar que toda cifra calculada por MALDITOESPEJO pueda reconstruirse desde sus datos de origen y que una modificación material de esos datos invalide automáticamente la cifra derivada para su revisión.

## Principio central

> **Una cifra calculada no es una fuente: es una conclusión derivada de fuentes.**

## Cadena

`DATO DE ORIGEN → EVIDENCIA → CLAIM DE ENTRADA → CÁLCULO → RESULTADO → CLAIM DERIVADO → ARTÍCULO`

## Identidad del cálculo

Cada cálculo debe conservar:

- `calculation_id`
- claims de entrada
- evidencias de entrada
- valores originales
- unidades
- periodo temporal
- operación
- fórmula
- resultado
- redondeo
- estado

## Regla de dependencia

Un cálculo hereda la incertidumbre de sus entradas.

Si cualquiera de las entradas necesarias pasa a `RECHECK_REQUIRED`, `CONTESTED`, `SUPERSEDED` o `UNKNOWN`, el cálculo no puede seguir presentándose como derivación verificada.

## Invalidación

`CAMBIO MATERIAL EN DATO → CÁLCULO AFECTADO → INVALIDACIÓN → REVISIÓN DE CLAIM DERIVADO → REVISIÓN DE TITULAR/ENTRADILLA → NUEVA DECISIÓN EDITORIAL`

La versión anterior no se elimina. Se conserva para reconstruir qué se sabía y qué cálculo se publicó o evaluó en cada momento.

## Controles

Antes de considerar publicable un cálculo deben comprobarse:

1. existencia de los datos de origen;
2. identidad de las evidencias;
3. misma unidad cuando corresponda;
4. compatibilidad de periodos;
5. fórmula reproducible;
6. resultado reproducible;
7. redondeo razonable;
8. ausencia de entradas superseded o en revisión;
9. dependencia de claims identificable;
10. interpretación que no exceda el cálculo.

## Diferencia entre cálculo y afirmación

`22.345.226 - 22.508.066 = -162.840` es una derivación matemática.

No autoriza por sí sola a escribir:

> “España destruyó 162.840 empleos”.

La interpretación requiere saber qué representan exactamente las cifras. En este ejemplo, una caída de afiliación media no equivale automáticamente a destrucción de empleos.

## Estados

- `VALID`
- `INVALID_INPUTS`
- `STALE_INPUT`
- `SUPERSEDED_INPUT`
- `CONTESTED_INPUT`
- `PERIOD_MISMATCH`
- `UNIT_MISMATCH`
- `RECALCULATION_REQUIRED`
- `EDITORIAL_REVIEW_REQUIRED`

## Publicación parcial

La invalidación de una cifra no bloquea necesariamente toda la pieza.

Solo debe retirarse o revisar la afirmación derivada afectada y aquello que dependa de ella.

Las afirmaciones independientes y verificadas pueden conservar su alcance publicable.

## Regla final

> **Si cambia el dato de origen, cambia la obligación de verificar el cálculo. MALDITOESPEJO nunca debe presentar una cifra derivada como vigente por inercia.**
