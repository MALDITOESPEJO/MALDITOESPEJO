# CONTRADICTION RESOLUTION ENGINE

## Propósito

El Contradiction Resolution Engine determina qué ocurre cuando dos o más evidencias relacionadas con una misma afirmación no coinciden.

No decide automáticamente qué fuente tiene razón. Su función es localizar el conflicto, medir su alcance editorial, separar las afirmaciones afectadas de las no afectadas y establecer qué debe volver a comprobarse.

## Principio central

> **Un conflicto no invalida automáticamente toda una investigación. Afecta a las afirmaciones que realmente dependen de él.**

## Cadena

`EVIDENCIA → PROCEDENCIA → COMPARACIÓN → CONFLICTO → MATERIALIDAD → DEPENDENCIAS → ALCANCE AFECTADO → REVERIFICACIÓN → DECISIÓN EDITORIAL`

## Tipos de conflicto

- `FACTUAL`: dos fuentes ofrecen hechos incompatibles.
- `NUMERICAL`: las cifras no coinciden.
- `TEMPORAL`: las fechas o periodos no coinciden.
- `ATTRIBUTION`: no coincide quién realizó o dijo algo.
- `DOCUMENTARY`: los documentos presentan versiones distintas.
- `LEGAL`: existe discrepancia sobre el contenido, vigencia o alcance de una norma o resolución.
- `PROVENANCE`: no está claro si dos fuentes proceden del mismo origen.
- `INTERPRETIVE`: los datos coinciden pero las conclusiones difieren.

## Materialidad

Un conflicto es material cuando puede cambiar:

1. el titular;
2. la entradilla;
3. el hecho central;
4. una cifra esencial;
5. la atribución principal;
6. el sentido que razonablemente extraería el lector;
7. una conclusión jurídica, científica o causal relevante.

Un conflicto no material puede quedar registrado sin bloquear afirmaciones independientes.

## Regla de independencia

`DOS FUENTES ≠ DOS EVIDENCIAS INDEPENDIENTES`

Una reproducción, cita, agregación o derivación de la misma fuente de origen no resuelve un conflicto simplemente porque aparezca en otra URL.

## Resolución por claim

Cada conflicto debe identificar:

- `claim_id` afectado;
- evidencias enfrentadas;
- relación de procedencia;
- grupo de independencia;
- tipo de conflicto;
- materialidad;
- claims dependientes;
- titular/entradilla afectados;
- acción necesaria.

Las afirmaciones no relacionadas con el conflicto permanecen evaluables de forma independiente.

## Estados

- `NO_CONFLICT`
- `NON_MATERIAL_CONFLICT`
- `MATERIAL_CONFLICT_REQUIRES_RECHECK`
- `CONTESTED`
- `RESOLVED_BY_DOCUMENTARY_EVIDENCE`
- `RESOLVED_BY_SCOPE_REDUCTION`
- `EDITORIAL_REVIEW_REQUIRED`

## Reglas de resolución

El sistema no debe resolver un conflicto por:

- número de fuentes;
- prestigio genérico de una fuente;
- orden de aparición en buscadores;
- fecha más reciente sin comprobar qué representa;
- preferencia por una fuente que favorezca el titular.

La resolución debe atender a autoridad, procedencia, documento original, fecha, alcance de la fuente y naturaleza exacta de la afirmación.

## Publicación parcial

Si el claim A está en conflicto pero los claims B y C están documentalmente verificados y no dependen de A, B y C pueden seguir formando parte de un alcance publicable coherente.

Si el conflicto afecta al titular o a la idea central, debe revisarse el alcance y el titular antes de publicar.

## Fail-safe

Cuando no pueda determinarse razonablemente el alcance del conflicto:

> **NO PUBLICAR TODAVÍA COMO HECHO RESUELTO.**

## Lenguaje público

La resolución técnica permanece interna. El lector debe recibir una explicación sencilla:

- “Las fuentes consultadas ofrecen datos distintos y la cuestión sigue abierta.”
- “El documento oficial confirma X, pero no permite afirmar Y.”
- “La cifra ha sido corregida y MALDITOESPEJO está revisando las afirmaciones afectadas.”

## Límite de automatización

La máquina puede detectar discrepancias, agrupar evidencias, seguir dependencias y proponer el alcance afectado.

No puede decidir por sí sola qué versión es verdadera cuando la cuestión requiere valoración documental o editorial.

La decisión final corresponde al editor humano.

## Regla final

> **Un conflicto localizado debe reducir el alcance de lo que afirmamos, no aumentar nuestra certeza para salvar una historia.**
