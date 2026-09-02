# MALDITOESPEJO — VERIFICATION ENGINE

## 1. Objetivo

Convertir el resultado de la investigación documental en un estado de verificación explícito por afirmación y por caso, sin confundir verificación con aprobación editorial.

El motor responde a dos preguntas distintas:

1. **¿Qué afirmaciones podemos respaldar documentalmente?**
2. **¿Puede publicarse una pieza limitada exclusivamente a esas afirmaciones?**

## 2. Cadena

`CLAIM → EVIDENCE → PROVENANCE → CONTRAST → TEMPORAL CHECK → TRACEABILITY → VERIFICATION STATUS → PUBLISHABLE SCOPE`

## 3. Regla principal

Una afirmación solo puede quedar `VERIFIED` cuando:

1. existe evidencia vinculada a la afirmación;
2. la evidencia contiene identificación documental suficiente;
3. la procedencia de la evidencia no es desconocida cuando la afirmación es central;
4. el contraste no presenta una contradicción material pendiente;
5. la evidencia evaluada respalda realmente la afirmación;
6. la afirmación no está clasificada como `UNKNOWN` o `PENDING`.

La existencia de una fuente o de una URL no equivale a verificación.

**Una investigación parcialmente verificada no se considera una investigación totalmente verificada. Pero las afirmaciones que sí estén verificadas pueden utilizarse para una publicación limitada, siempre que el artículo no presente como hechos las partes pendientes, insuficientes o controvertidas.**

## 4. Estados por afirmación

- `VERIFIED`: respaldo documental suficiente y sin conflicto material pendiente.
- `PARTIALLY_VERIFIED`: la evidencia solo respalda una parte de la afirmación.
- `INSUFFICIENT`: no existe respaldo suficiente.
- `RECHECK_REQUIRED`: falta información documental, temporal o de procedencia que debe revisarse.
- `CONTESTED`: existe una contradicción material no resuelta.

## 5. Estados del caso

- `VERIFIED`: todas las afirmaciones centrales necesarias para la pieza están verificadas y no existe bloqueo material sobre su alcance.
- `PARTIALLY_VERIFIED`: existen afirmaciones verificadas que pueden sostener una pieza limitada, pero otras afirmaciones del caso siguen abiertas.
- `RECHECK_REQUIRED`: existe una carencia que requiere nueva comprobación y no hay todavía un alcance publicable suficiente, o la pieza pretendida depende de esa carencia.
- `CONTESTED`: existe una contradicción material que afecta al contenido que se pretende publicar.
- `BLOCKED`: existe una condición crítica que impide continuar.

## 6. Publicación parcial segura

El caso puede entrar en `PARTIALLY_VERIFIED` cuando exista al menos una afirmación publicable con estado `VERIFIED` y el resto pueda excluirse o presentarse claramente como pendiente/atribución.

La publicación parcial exige:

1. seleccionar explícitamente los `claim_id` que forman el **alcance publicable**;
2. excluir del titular y la entradilla toda afirmación no verificada;
3. no presentar como hecho ninguna afirmación `INSUFFICIENT`, `RECHECK_REQUIRED` o `CONTESTED`;
4. conservar las afirmaciones pendientes en el expediente interno;
5. si una afirmación pendiente es relevante para entender la noticia, puede explicarse como pendiente, sin convertirla en hecho;
6. la aprobación humana sigue siendo obligatoria.

Por tanto:

`PARTE VERIFICADA ≠ CASO TOTALMENTE VERIFICADO`

pero:

`PARTE VERIFICADA → PIEZA LIMITADA PUBLICABLE`

cuando el alcance se encuentre explícitamente delimitado.

## 7. Afirmaciones centrales

Las afirmaciones marcadas como `CENTRAL`, así como las afirmaciones `FACT` o `STATEMENT` que formen parte del núcleo de una pieza, reciben el nivel de control más estricto.

El titular y la entradilla no pueden superar el estado documental de las afirmaciones que los sustentan.

Si la afirmación central original está bloqueada, el motor puede proponer un nuevo núcleo editorial únicamente si existe otro claim verificable que permita construir una noticia coherente por sí mismo. No se debe conservar un titular cuyo sentido dependa de la afirmación bloqueada.

## 8. Procedencia

Para una afirmación central, `UNKNOWN` o ausencia de `provenance_status` impide la verificación automática.

Las reproducciones, citas o derivaciones no se cuentan automáticamente como corroboración independiente.

> **Múltiples fuentes no significan necesariamente múltiples evidencias independientes.**

## 9. Contraste

El resultado del contraste tiene prioridad sobre la mera presencia de evidencia:

- `CONTESTED` bloquea `VERIFIED` para la afirmación afectada;
- `PARTIALLY_SUPPORTED` produce como máximo `PARTIALLY_VERIFIED`;
- `INSUFFICIENT` impide `VERIFIED`;
- `SUPPORTED` permite continuar solo si los demás controles también se superan.

Un conflicto localizado en una afirmación no bloquea automáticamente otras afirmaciones independientes del mismo caso. **Sí bloquea cualquier titular, entradilla o párrafo que dependa de la afirmación conflictiva.**

El sistema no elige automáticamente la fuente que resulte más conveniente.

## 10. Control temporal

La evidencia debe ser adecuada al momento de la afirmación. Una fuente antigua no puede utilizarse automáticamente para describir un estado actual cuando el tiempo sea material para la noticia.

Cuando el caso no contenga información temporal suficiente para evaluar un aspecto material, el estado de esa afirmación debe ser `RECHECK_REQUIRED`, no `VERIFIED`.

## 11. Trazabilidad

Toda afirmación importante debe conservar el recorrido:

`CLAIM → EVIDENCE → SOURCE → DOCUMENT/RECORD → PROVENANCE`

El registro de verificación debe conservar los `evidence_id` utilizados para cada afirmación.

## 12. UNKNOWN y PENDING

`UNKNOWN` y `PENDING` son estados editoriales legítimos. No son huecos que el sistema deba rellenar mediante inferencias.

Nunca pueden promocionarse automáticamente a un hecho verificado.

## 13. Verificación y aprobación humana

`VERIFIED` no significa `APPROVED`.

La cadena correcta puede tener dos recorridos:

`VERIFIED → EDITOR_REVIEW → APPROVED → PUBLICATION GATE → PUBLISHED`

`PARTIALLY_VERIFIED → DEFINE PUBLISHABLE SCOPE → EDITOR_REVIEW → APPROVED → PUBLICATION GATE → PUBLISHED`

La aprobación humana sigue siendo obligatoria para la publicación.

## 14. Regla de seguridad

Ante una duda material sobre una afirmación que no sea necesaria para el alcance elegido, el sistema no tiene que bloquear toda la noticia: debe **aislar la parte no verificada y continuar únicamente con lo que sí está demostrado**.

Ante una duda material que afecte al núcleo de la pieza elegida, debe preferir:

**NO PUBLICAR TODAVÍA**

frente a completar artificialmente la verificación.

## 15. Lenguaje público

La complejidad de la comprobación permanece dentro del expediente editorial. La noticia debe explicar de forma sencilla qué está demostrado, qué ha declarado alguien, qué contexto existe y qué sigue sin conocerse.

> **La investigación puede ser compleja; la explicación no debe serlo.**
