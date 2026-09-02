# CLAIM DEPENDENCY & UNCERTAINTY PROPAGATION ENGINE

## Propósito

Garantizar que una afirmación derivada nunca pueda presentar un grado de certeza superior al de las afirmaciones de las que depende, y que un cambio material en una afirmación fundamental active automáticamente la revisión de sus consecuencias.

## Principio central

> **Una afirmación derivada no puede ser más cierta que la evidencia de la que depende.**

La unidad de propagación es la afirmación (`claim`), no el artículo completo.

## Cadena

`CLAIM FUNDAMENTAL → DEPENDENCIA → CLAIM DERIVADO → CÁLCULO / INTERPRETACIÓN → TITULAR / ENTRADILLA → ALCANCE PUBLICABLE`

## Tipos de dependencia

- `DIRECT`: relación documental directa.
- `DERIVED`: la segunda afirmación se obtiene de la primera.
- `CONDITIONAL`: la segunda depende de que se cumpla una condición.
- `CONTEXTUAL`: la segunda necesita la primera como contexto factual.
- `EDITORIAL`: relación necesaria para una decisión o formulación editorial.

Las dependencias deben declararse. El sistema no las inventa por similitud temática.

## Propagación de incertidumbre

Estados que obligan a revisar una dependencia:

`PENDING`, `UNKNOWN`, `CONTESTED`, `RECHECK_REQUIRED`, `INSUFFICIENT`

Regla:

`DEPENDENCIA NO VERIFICADA → CLAIM DEPENDIENTE NO PUEDE QUEDAR VERIFIED`

Si la dependencia se vuelve `PARTIALLY_VERIFIED`, la afirmación derivada como máximo puede quedar parcialmente verificada y debe revisarse su formulación.

Si la dependencia se vuelve `VERIFIED`, la afirmación dependiente no queda automáticamente verificada: todavía necesita su propia evidencia y evaluación.

## Propagación material

Cuando cambia una afirmación fundamental, el sistema identifica:

- claims dependientes;
- cálculos que utilizan sus valores;
- conclusiones derivadas;
- titular;
- entradilla/description;
- alcance publicable;
- cualquier elemento editorial marcado como dependiente.

El cambio no implica automáticamente que todo el artículo sea inválido. Se revisa únicamente el alcance afectado y sus dependencias.

## Cálculos

Un cálculo no puede mejorar la certeza de sus entradas.

Ejemplo:

`DATO A (RECHECK_REQUIRED) → DIFERENCIA A-B → RECHECK_REQUIRED`

La operación matemática puede ser correcta y, aun así, el resultado no estar listo para publicación como hecho si uno de sus datos de entrada no está verificado.

## Titular y entradilla

El titular y la entradilla son elementos críticos.

Si dependen de un claim que pasa a estado bloqueado, pendiente o controvertido:

`ALERTA → REVISAR TITULAR/ENTRADILLA → REDUCIR ALCANCE O CONTINUAR INVESTIGACIÓN`

No se permite mantener una formulación categórica basada en una dependencia que ya no está respaldada.

## Casos parcialmente verificables

Una investigación puede contener:

- claims verificados;
- claims parcialmente verificados;
- claims pendientes;
- claims controvertidos.

Los claims verificados no quedan bloqueados por defecto si son independientes del claim afectado y forman una historia coherente por sí mismos.

## Estados del motor

- `STABLE`
- `DEPENDENCIES_AFFECTED`
- `UNCERTAINTY_PROPAGATED`
- `MATERIAL_REVIEW_REQUIRED`
- `BLOCKED`

## Automatización

La máquina puede calcular el grafo, detectar ciclos y propagar estados formalmente.

No puede decidir por sí sola si una relación causal o interpretativa existe realmente. Las relaciones ambiguas requieren decisión editorial.

## Regla de seguridad

> **Si una afirmación de la que depende otra deja de estar respaldada, la afirmación dependiente vuelve a revisión.**

## Regla de MALDITOESPEJO

> **La investigación puede ser compleja; la explicación no debe serlo.**

La complejidad del grafo permanece dentro del sistema. El lector solo debe recibir una explicación clara de lo que está confirmado, lo que se atribuye a alguien y lo que sigue abierto.
