# SOURCE AUTHORITY & PRIMARY EVIDENCE ENGINE

## Propósito

Determinar qué clase de evidencia representa realmente una fuente recuperada y evitar que una página secundaria sea tratada como si fuera el documento original.

## Cadena

`SOURCE RESOLUTION → SOURCE NATURE → DOCUMENT TYPE → EVIDENCE ROLE → AUTHORITY SCOPE → EDITORIAL ASSESSMENT`

## Distinción fundamental

La autoridad de una fuente depende de **qué afirma y en qué calidad lo afirma**.

Una institución oficial puede demostrar directamente una actuación propia, pero no necesariamente una afirmación externa sobre las consecuencias de esa actuación.

Una sentencia puede demostrar que un tribunal resolvió una cuestión; no demuestra por sí sola que todas las interpretaciones periodísticas sobre ella sean correctas.

Una publicación en redes puede demostrar que una persona hizo esa declaración; no demuestra automáticamente que el hecho declarado sea cierto.

## Clases documentales

- `PRIMARY_DOCUMENT`: documento original emitido por la autoridad, organización o persona relevante.
- `OFFICIAL_DATA`: dato oficial, registro o conjunto de datos identificable.
- `DIRECT_STATEMENT`: declaración directa atribuible a una persona u organización.
- `COURT_OR_LEGAL_RECORD`: resolución, auto, sentencia, expediente o documento jurídico identificable.
- `OFFICIAL_REGISTRY`: registro público o administrativo.
- `INDEPENDENT_OBSERVATION`: observación independiente susceptible de corroboración.
- `SPECIALIST_CONTEXT`: análisis especializado que aporta contexto, no necesariamente prueba del hecho principal.
- `SECONDARY_MEDIA`: información periodística que reproduce o interpreta material de otra fuente.

## Regla de alcance

`FUENTE PRIMARIA ≠ PRUEBA DE TODO EL CLAIM`

El sistema debe comprobar que el documento respalda exactamente la parte de la afirmación que se pretende publicar.

## Señales de fuente primaria

Indicadores favorables:

1. dominio o registro oficial conocido;
2. documento emitido por el sujeto competente;
3. identificación inequívoca del documento o registro;
4. fecha y versión identificables;
5. contenido directo y atribuible;
6. correspondencia con el ámbito de autoridad de la fuente.

Ninguna señal aislada garantiza autenticidad o suficiencia.

## Medios secundarios

Los medios pueden:

- descubrir una historia;
- localizar un documento;
- aportar contexto;
- señalar una contradicción;
- aportar una observación independiente cuando proceda.

Pero una reproducción no se convierte automáticamente en evidencia independiente.

## Casos especiales

### Declaraciones

`PERSONA DICE X` prueba que la persona dijo X.

No prueba automáticamente que X sea verdadero.

### Datos

Debe conservarse:

`valor + unidad + periodo + definición + fuente + fecha/versión`

### Derecho

Debe identificarse, cuando exista:

`tribunal/autoridad + número de asunto o documento + tipo de resolución + fecha + estado procesal`

### Ciencia

Debe identificarse el trabajo, informe, conjunto de datos o institución y distinguir resultados observados de interpretación.

## Resultado

Estados:

- `PRIMARY_DIRECT`
- `OFFICIAL_DIRECT`
- `DIRECT_STATEMENT`
- `SECONDARY_REPRODUCTION`
- `SPECIALIST_CONTEXT`
- `UNRESOLVED`
- `REVIEW_REQUIRED`

El resultado nunca equivale por sí solo a `VERIFIED`.

## Fail-safe

Si no puede determinarse con claridad qué autoridad tiene la fuente sobre el claim, se mantiene `REVIEW_REQUIRED`.

> **La fuente puede ser muy fiable y, aun así, no demostrar la afirmación que queremos publicar.**

## Lenguaje público

La clasificación técnica permanece interna. El artículo debe explicar de forma sencilla quién afirma qué, qué muestran los documentos y qué sigue sin estar demostrado.
