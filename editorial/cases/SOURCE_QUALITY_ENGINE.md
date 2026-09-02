# SOURCE QUALITY ENGINE — MALDITOESPEJO

## Objetivo

Evaluar de forma automática la calidad documental de los candidatos recuperados por la búsqueda web antes de incorporarlos como evidencia aceptada.

## Regla central

> La calidad de una fuente puede evaluarse automáticamente en parte; la verdad de una afirmación no.

El motor no convierte una fuente de alta calidad en una afirmación verdadera. Solo determina si el candidato reúne condiciones suficientes para pasar a evaluación documental.

## Flujo

`RESULTADO WEB → CALIDAD DE FUENTE → CANDIDATO ELEGIBLE → EVIDENCIA → PROCEDENCIA → CONTRASTE → VERIFICACIÓN`

## Factores evaluados

1. **Autoridad** — quién publica o mantiene la información.
2. **Primariedad** — si la fuente es testigo, documento original, registro oficial o fuente directa.
3. **Actualidad** — fecha de publicación, actualización y relación temporal con el hecho.
4. **Identificación documental** — existencia de título, documento, registro o página identificable.
5. **Relevancia** — relación explícita con la afirmación investigada.
6. **Proveniencia** — posibilidad de conocer de dónde procede la información.
7. **Independencia** — posibilidad de que aporte una línea de evidencia distinta.
8. **Completitud** — disponibilidad de datos suficientes para que un editor pueda examinarla.

## Clasificación

- `HIGH_QUALITY_CANDIDATE`: reúne condiciones fuertes para evaluación.
- `MEDIUM_QUALITY_CANDIDATE`: útil, pero requiere comprobaciones adicionales.
- `LOW_QUALITY_CANDIDATE`: puede servir como pista, no como base suficiente.
- `REJECTED`: no debe entrar en el circuito de evidencia.
- `UNKNOWN`: faltan datos para clasificar.

## Fuentes primarias

Las fuentes oficiales, documentos originales, registros públicos y declaraciones directas reciben prioridad, pero **no una presunción automática de verdad**.

Una fuente oficial puede contener errores, información incompleta o una afirmación interesada. Por ello siempre debe pasar por contraste y evaluación.

## Medios de comunicación

Los medios pueden ser:

- fuente de descubrimiento;
- fuente de contexto;
- fuente de corroboración;
- fuente de publicación cuando la información ha sido examinada y resulta apropiada para la afirmación concreta.

La existencia de varias noticias que reproducen el mismo comunicado no constituye corroboración independiente.

## Regla temporal

Una fuente posterior puede confirmar un hecho anterior, pero no debe utilizarse para atribuir retrospectivamente información que todavía no estaba disponible en el momento relevante sin indicarlo.

Las actualizaciones materiales deben conservarse como versiones distintas cuando afecten a la evidencia.

## Independencia

El motor debe detectar señales de posible dependencia:

- misma URL de origen;
- mismo comunicado;
- misma agencia o cable;
- citas textuales coincidentes;
- referencia explícita a otra publicación;
- mismo documento o conjunto de datos.

Estas señales generan una alerta; no permiten decidir por sí solas la independencia sustantiva.

## Puntuación

La puntuación automática es orientativa y nunca sustituye al editor.

Una puntuación alta significa **mejor candidato documental**, no mayor probabilidad matemática de que la afirmación sea cierta.

## Límites

El motor no puede determinar automáticamente:

- si una declaración es verdadera;
- si una institución está mintiendo;
- si dos fuentes son realmente independientes en todos los sentidos;
- si una contradicción es material desde el punto de vista editorial;
- si una afirmación merece publicarse.

Estas cuestiones permanecen bajo revisión editorial.

## Regla de seguridad

Si faltan datos esenciales, el resultado es `UNKNOWN` o `RECHECK_REQUIRED`, nunca una aprobación automática.

> **Buscar no es verificar. Una fuente excelente tampoco convierte por sí sola una afirmación en un hecho.**

## Lenguaje público

La complejidad queda dentro del sistema. El lector debe recibir únicamente una explicación clara de lo que está demostrado, lo que alguien ha afirmado y lo que todavía no se sabe.

> **La investigación puede ser compleja; la explicación no debe serlo.**
