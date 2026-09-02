# POLÍTICA DE VERSIONADO DE EVIDENCIA

## 1. Propósito

MALDITOESPEJO debe poder reconstruir qué evidencia sustentaba una afirmación en el momento en que fue verificada y qué cambió después.

Una corrección de una fuente, una actualización de datos o una modificación de una afirmación no debe borrar silenciosamente el estado anterior.

> **Una noticia puede cambiar; su historial de verificación no debe desaparecer.**

## 2. Principio de inmutabilidad

Cuando una evidencia ya ha sido utilizada para una verificación material, su registro histórico no se sobrescribe para convertirlo en el nuevo estado.

El nuevo estado se registra como una nueva versión que referencia el estado anterior mediante `supersedes_id`.

Cadena básica:

`EVIDENCIA v1 → EVIDENCIA v2 → EVIDENCIA v3`

## 3. Qué puede generar una nueva versión

Debe crearse una nueva versión cuando exista un cambio material en:

- cifra o dato relevante;
- fecha o periodo al que se refiere el dato;
- documento oficial;
- contenido de una declaración relevante;
- fuente que corrige expresamente una información anterior;
- interpretación necesaria para sostener una afirmación;
- estado de una evidencia (por ejemplo, de establecido a cuestionado).

Cambios puramente técnicos o de formato no requieren necesariamente una nueva versión si no alteran el significado ni la trazabilidad.

## 4. Correcciones de fuentes

Si una fuente publica una corrección:

1. se conserva la evidencia anterior;
2. se registra la nueva versión;
3. se enlazan ambas mediante `supersedes_id`;
4. se conserva el mismo `lineage_id` cuando pertenecen a la misma línea de procedencia;
5. se reevalúan las afirmaciones que dependían del dato corregido;
6. se revisa el estado de verificación de la noticia;
7. si la corrección afecta al titular, entradilla o afirmación central, la publicación queda pendiente de revisión editorial.

## 5. Impacto sobre las afirmaciones

Una evidencia corregida no implica automáticamente que toda la noticia sea falsa.

El sistema debe identificar qué afirmaciones dependían de esa evidencia y marcar esas afirmaciones para nueva evaluación.

Regla:

`EVIDENCIA CORREGIDA → AFIRMACIONES AFECTADAS → REVERIFICACIÓN → DECISIÓN EDITORIAL`

## 6. Estado de verificación

Una noticia previamente marcada como `verified` puede volver temporalmente a estado de revisión si aparece información material nueva o una corrección de una fuente.

Estados orientativos:

- `verified`: la evidencia disponible ha sido comprobada y no existe incidencia material conocida;
- `recheck_required`: existe un cambio que exige nueva comprobación;
- `contested`: existe una contradicción material no resuelta;
- `superseded`: una evidencia o versión anterior ha sido sustituida por otra, conservándose el historial.

La automatización puede detectar que una evidencia cambió. No puede decidir por sí sola si el cambio invalida una noticia.

## 7. Corrección posterior a la publicación

Si el cambio se detecta después de publicar:

- el registro histórico se conserva;
- se identifica el artículo afectado;
- se identifican las afirmaciones afectadas;
- se determina si procede actualizar el texto;
- se determina si procede una nota de corrección o actualización pública;
- se documenta la decisión editorial.

La corrección pública debe ser proporcional a la importancia del error y clara para el lector.

## 8. Regla del titular

Si una evidencia corregida afecta al titular o a la tesis central, no basta con modificar una cifra secundaria.

Debe repetirse la revisión completa de:

`TITULAR → ENTRADILLA → AFIRMACIONES PRINCIPALES → EVIDENCIAS → VERIFICACIÓN`

## 9. Regla de trazabilidad

Toda nueva versión material debe conservar, como mínimo:

- `evidence_id` nuevo;
- `version`;
- `created_at`;
- `effective_at`, cuando proceda;
- `supersedes_id`;
- `lineage_id`;
- `source_id`;
- estado de procedencia;
- explicación breve del cambio.

## 10. Regla de lenguaje claro

El historial interno puede ser técnico. La explicación pública no.

El lector debe poder entender qué ocurrió sin conocer el sistema interno de identificadores.

Ejemplos:

- “La fuente corrigió posteriormente la cifra publicada.”
- “Hemos actualizado la información porque el dato oficial fue corregido.”
- “La información sigue abierta porque los datos disponibles no coinciden.”

> **La investigación puede ser compleja; la explicación no debe serlo.**

## 11. Prohibiciones

No se permite:

- sobrescribir silenciosamente evidencia material ya utilizada;
- eliminar el estado histórico porque una fuente lo corrigió;
- mantener `verified` sin reevaluar una afirmación material afectada;
- tratar una nueva URL como nueva evidencia independiente sin analizar su procedencia;
- convertir una corrección de fuente en una nueva corroboración independiente.

## 12. Responsabilidad

El versionado preserva el historial. La decisión sobre la relevancia editorial del cambio corresponde al editor humano.

La automatización controla la trazabilidad y puede activar una alerta. No sustituye el juicio editorial.
