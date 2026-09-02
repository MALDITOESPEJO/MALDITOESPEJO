# MALDITOESPEJO — VERIFICATION ENGINE

## 1. Objetivo

Convertir el resultado de la investigación documental en un estado de verificación explícito por afirmación y por caso, sin confundir verificación con aprobación editorial.

El motor responde a una pregunta concreta: **¿podemos respaldar documentalmente esta afirmación con la evidencia disponible?**

## 2. Cadena

`CLAIM → EVIDENCE → PROVENANCE → CONTRAST → TEMPORAL CHECK → TRACEABILITY → VERIFICATION STATUS`

## 3. Regla principal

Una afirmación solo puede quedar `VERIFIED` cuando:

1. existe evidencia vinculada a la afirmación;
2. la evidencia contiene identificación documental suficiente;
3. la procedencia de la evidencia no es desconocida cuando la afirmación es central;
4. el contraste no presenta una contradicción material pendiente;
5. la evidencia evaluada respalda realmente la afirmación;
6. la afirmación no está clasificada como `UNKNOWN` o `PENDING`.

La existencia de una fuente o de una URL no equivale a verificación.

## 4. Estados por afirmación

- `VERIFIED`: respaldo documental suficiente y sin conflicto material pendiente.
- `PARTIALLY_VERIFIED`: la evidencia solo respalda una parte de la afirmación.
- `INSUFFICIENT`: no existe respaldo suficiente.
- `RECHECK_REQUIRED`: falta información documental, temporal o de procedencia que debe revisarse.
- `CONTESTED`: existe una contradicción material no resuelta.

## 5. Estados del caso

- `VERIFIED`: todas las afirmaciones centrales están verificadas y no existe bloqueo material.
- `RECHECK_REQUIRED`: existe una carencia que requiere nueva comprobación.
- `CONTESTED`: existe una contradicción material no resuelta.
- `BLOCKED`: existe una condición crítica que impide continuar.

## 6. Afirmaciones centrales

Las afirmaciones marcadas como `CENTRAL`, así como las afirmaciones `FACT` o `STATEMENT` que formen parte del núcleo publicable, reciben el nivel de control más estricto.

El titular y la entradilla no pueden superar el estado documental de las afirmaciones que los sustentan.

## 7. Procedencia

Para una afirmación central, `UNKNOWN` o ausencia de `provenance_status` impide la verificación automática.

Las reproducciones, citas o derivaciones no se cuentan automáticamente como corroboración independiente.

> **Múltiples fuentes no significan necesariamente múltiples evidencias independientes.**

## 8. Contraste

El resultado del contraste tiene prioridad sobre la mera presencia de evidencia:

- `CONTESTED` bloquea `VERIFIED`;
- `PARTIALLY_SUPPORTED` produce como máximo `PARTIALLY_VERIFIED`;
- `INSUFFICIENT` impide `VERIFIED`;
- `SUPPORTED` permite continuar solo si los demás controles también se superan.

El sistema no elige automáticamente la fuente que resulte más conveniente.

## 9. Control temporal

La evidencia debe ser adecuada al momento de la afirmación. Una fuente antigua no puede utilizarse automáticamente para describir un estado actual cuando el tiempo sea material para la noticia.

Cuando el caso no contenga información temporal suficiente para evaluar un aspecto material, el estado debe ser `RECHECK_REQUIRED`, no `VERIFIED`.

## 10. Trazabilidad

Toda afirmación importante debe conservar el recorrido:

`CLAIM → EVIDENCE → SOURCE → DOCUMENT/RECORD → PROVENANCE`

El registro de verificación debe conservar los `evidence_id` utilizados para cada afirmación.

## 11. UNKNOWN y PENDING

`UNKNOWN` y `PENDING` son estados editoriales legítimos. No son huecos que el sistema deba rellenar mediante inferencias.

Nunca pueden promocionarse automáticamente a un hecho verificado.

## 12. Verificación y aprobación humana

`VERIFIED` no significa `APPROVED`.

La cadena correcta es:

`VERIFIED → EDITOR_REVIEW → APPROVED → PUBLICATION GATE → PUBLISHED`

La aprobación humana sigue siendo obligatoria para la publicación.

## 13. Regla de seguridad

Ante una duda material, el sistema debe preferir:

**NO PUBLICAR TODAVÍA**

frente a completar artificialmente la verificación.

## 14. Lenguaje público

La complejidad de la comprobación permanece dentro del expediente editorial. La noticia debe explicar de forma sencilla qué está demostrado, qué ha declarado alguien, qué contexto existe y qué sigue sin conocerse.

> **La investigación puede ser compleja; la explicación no debe serlo.**
