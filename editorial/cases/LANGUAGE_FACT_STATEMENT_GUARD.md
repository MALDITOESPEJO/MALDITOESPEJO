# LANGUAGE & FACT / STATEMENT GUARD

## Propósito

Evitar que la redacción automática transforme una declaración, una inferencia o una cuestión pendiente en un hecho presentado como propio de MALDITOESPEJO.

> La investigación puede ser compleja; la explicación no debe serlo.

## Regla central

El texto público debe conservar la naturaleza de cada afirmación:

- `FACT`: hecho que MALDITOESPEJO presenta como establecido y respaldado por evidencia.
- `STATEMENT`: declaración atribuida a una persona, empresa, institución o documento. La atribución no convierte la declaración en un hecho propio.
- `CONTEXT`: información explicativa respaldada por evidencia.
- `INFERENCE`: interpretación o conclusión que necesita apoyo específico y no puede presentarse como hecho sin él.
- `UNKNOWN` / `PENDING`: cuestión no resuelta; no puede convertirse silenciosamente en un hecho.

## Riesgo de transformación

El guard debe detectar especialmente estas transformaciones:

`X afirmó que ocurrió Y` → `Y ocurrió`

`X sostiene que causó Y` → `X causó Y`

`Los datos podrían indicar Y` → `Los datos demuestran Y`

`Se investiga si Y` → `Y ocurrió`

`No hay datos suficientes para confirmar Y` → `Y`

Son ejemplos de inflación de certeza o pérdida de atribución.

## Reglas de lenguaje

### 1. Las declaraciones deben mantener atribución

Preferir formas como:

- «X afirmó que…»
- «Según X…»
- «La empresa sostiene que…»
- «El informe señala que…»

No convertirlas en hechos propios salvo que exista evidencia independiente suficiente.

### 2. La certeza debe corresponder a la evidencia

No aumentar automáticamente expresiones como `podría`, `según`, `aparentemente`, `se investiga`, `no está confirmado` o `señala` a expresiones categóricas como `es`, `ocurrió`, `demuestra` o `causó`.

### 3. La causalidad necesita respaldo específico

Una sucesión temporal, una correlación o una declaración de una fuente no bastan por sí solas para afirmar causalidad.

### 4. Titular y entradilla tienen un control más estricto

No podrán presentar como hecho central una afirmación que solo esté respaldada como declaración, inferencia, contexto discutido o cuestión pendiente.

### 5. Los números no pierden su contexto

Un dato debe conservar, cuando sea necesario para entenderlo correctamente, su unidad, periodo, población o ámbito y carácter oficial/estimado.

### 6. Lo pendiente permanece pendiente

Una cuestión no verificada puede aparecer como cuestión abierta si resulta relevante, pero nunca como hecho establecido.

## Funcionamiento del guard

`CLAIM TYPE → DRAFT LANGUAGE → ATTRIBUTION / CERTAINTY CHECK → RISK DETECTION → HUMAN REVIEW`

El sistema puede detectar patrones lingüísticos de riesgo, pero no pretende comprender perfectamente el significado de cada frase. Ante duda debe producir `REVIEW_REQUIRED`, no aprobar por defecto.

## Estados

- `PASS`: no se ha detectado una transformación problemática.
- `PASS_WITH_ATTRIBUTION`: declaración correctamente atribuida.
- `REVIEW_REQUIRED`: existe un posible aumento de certeza, pérdida de atribución, causalidad o ambigüedad.
- `BLOCKED_FACT_STATEMENT_LEAK`: una declaración o afirmación no factual parece haberse convertido en hecho propio.
- `BLOCKED_UNRESOLVED_AS_FACT`: una cuestión pendiente/contestada parece presentarse como hecho.

## Principio de seguridad

Ante una duda semántica relevante:

> `REVIEW_REQUIRED` > aprobación automática.

El guard no determina que una frase sea verdadera. Comprueba que la forma de expresarla no exceda la naturaleza de la evidencia y de la afirmación registrada.
