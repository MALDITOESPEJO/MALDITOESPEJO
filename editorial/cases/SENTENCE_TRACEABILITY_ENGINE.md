# SENTENCE TRACEABILITY ENGINE

## Propósito

Garantizar que cada afirmación factual material del artículo pueda remontarse a uno o varios `claim_id` y, a través de ellos, a evidencia documental concreta.

## Principio central

> **Cada afirmación importante publicada debe poder responder a tres preguntas: qué decimos, qué lo demuestra y de dónde procede esa prueba.**

## Cadena

`FRASE → COMPONENTE FACTUAL → CLAIM → EVIDENCIA → FUENTE → DOCUMENTO/REGISTRO → PROCEDENCIA`

## Alcance

Se aplica con prioridad a:

- titular;
- entradilla/description;
- cifras;
- fechas esenciales;
- hechos centrales;
- atribuciones;
- relaciones causales;
- conclusiones jurídicas, científicas o económicas;
- cualquier afirmación que pueda cambiar la interpretación del lector.

## Regla de no ampliación

La redacción puede simplificar o reorganizar una afirmación verificada, pero no puede aumentar su grado de certeza ni introducir información material que no esté cubierta por los claims aprobados.

## Identificadores

Cada unidad factual trazable debe conservar:

- `sentence_id` — `SEN-########`;
- `claim_ids` — uno o varios claims que sustentan la frase;
- `evidence_ids` — evidencia que respalda esos claims;
- `source_ids` — fuentes correspondientes;
- `traceability_status`.

## Estados

- `TRACEABLE`
- `PARTIALLY_TRACEABLE`
- `UNTRACEABLE`
- `OUT_OF_SCOPE`
- `REVIEW_REQUIRED`

## Titular y entradilla

El titular y la entradilla tienen el nivel de exigencia más alto.

Ninguna afirmación factual material del titular puede quedar únicamente respaldada por contexto general. Debe existir un claim aprobado y evidencia suficiente para esa afirmación.

La entradilla no puede introducir una afirmación que el titular o el alcance publicado no permitan sostener.

## Declaraciones

Cuando una frase atribuye una declaración:

`PERSONA/ENTIDAD → DIJO/AFIRMÓ → CONTENIDO DE LA DECLARACIÓN`

La evidencia debe demostrar que la persona o entidad realizó la declaración. No convierte automáticamente el contenido de la declaración en un hecho.

## Cifras

Una cifra debe poder remontarse a:

`VALOR → UNIDAD → PERIODO → FUENTE → EVIDENCIA`

Si la cifra es calculada:

`DATOS DE ORIGEN → CÁLCULO → RESULTADO → CLAIM DERIVADO`

## Causalidad

Las frases que utilizan relaciones como `causó`, `provocó`, `por`, `debido a` o equivalentes requieren un claim específico y evidencia adecuada. No pueden derivarse únicamente de que dos hechos aparezcan juntos.

## Dependencias

Si un claim depende de otro, la trazabilidad debe conservar la cadena de dependencia. Si la dependencia queda en `RECHECK_REQUIRED`, la frase derivada pasa como mínimo a `REVIEW_REQUIRED`.

## Proveniencia

Dos evidencias que pertenecen al mismo linaje no crean una segunda corroboración independiente. La trazabilidad debe conservar `lineage_id` e `independence_group` cuando estén disponibles.

## Cobertura parcial

Un artículo puede contener afirmaciones verificadas y dejar otras fuera. La trazabilidad no debe forzar la inclusión de claims no verificados para completar una narración.

## Automatización

La máquina puede comprobar correspondencias explícitas, identificadores, alcance y ausencia de claims no aprobados.

No puede garantizar por sí sola que una frase paraphrase correctamente el significado de una evidencia compleja. Cuando la correspondencia semántica sea dudosa:

> `REVIEW_REQUIRED`

## Publicación

`UNTRACEABLE`, `OUT_OF_SCOPE` o una trazabilidad material dudosa en titular, entradilla o afirmación central impiden superar el control de publicación hasta revisión humana.

## Regla final

> **MALDITOESPEJO no solo debe poder demostrar una noticia. Debe poder mostrar, internamente, qué evidencia respalda cada afirmación importante que publica.**

La investigación puede ser compleja; la explicación no debe serlo.
