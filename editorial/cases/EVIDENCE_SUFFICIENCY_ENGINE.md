# EVIDENCE SUFFICIENCY ENGINE

## 1. Purpose

El Evidence Sufficiency Engine determina, afirmación por afirmación, si la evidencia documental reunida es suficiente para pasar a verificación editorial.

Su función no es decidir si una afirmación es verdadera en sentido absoluto. Decide si existe un respaldo documental suficiente, trazable, pertinente y actual para que la afirmación pueda ser evaluada como verificable bajo las reglas editoriales de MALDITOESPEJO.

> **EVIDENCIA ENCONTRADA ≠ EVIDENCIA SUFICIENTE**

La investigación puede ser compleja; la explicación no debe serlo.

## 2. Lugar en la cadena

`CLAIM → EVIDENCE → SOURCE AUTHORITY → PROVENANCE → INDEPENDENCE → TEMPORALITY → CONTRADICTION → SUFFICIENCY → VERIFICATION`

La suficiencia se evalúa por claim, no por número total de documentos ni por número de enlaces.

## 3. Estados

- `SUFFICIENT`: el respaldo documental reúne las condiciones necesarias para pasar a verificación.
- `PARTIALLY_SUFFICIENT`: solo una parte concreta de la afirmación está respaldada; puede requerir reducir su alcance.
- `INSUFFICIENT`: falta evidencia relevante o la evidencia no permite sostener la afirmación.
- `CONTESTED`: existe una contradicción material no resuelta.
- `UNASSESSED`: todavía no existen datos suficientes para realizar la evaluación.

## 4. Condiciones mínimas

Para considerar suficiente un claim factual se revisa, como mínimo:

1. identidad inequívoca del claim;
2. evidencia vinculada al claim;
3. documento, registro, dato o declaración identificable;
4. fuente identificable;
5. evaluación explícita del respaldo (`SUPPORTS` o, cuando corresponda, `PARTIALLY_SUPPORTS`);
6. autoridad de la fuente compatible con lo que se pretende afirmar;
7. procedencia conocida o suficientemente documentada;
8. control temporal cuando la afirmación lo exige;
9. ausencia de contradicción material pendiente;
10. dependencias necesarias resueltas.

Una fuente que solo demuestra que alguien hizo una declaración no demuestra automáticamente que el contenido de esa declaración sea cierto.

## 5. Intensidad según el tipo de claim

### FACT

Los hechos centrales requieren evidencia primaria, documental u otra evidencia especialmente adecuada. Una única noticia secundaria no debe bastar para un hecho central cuando razonablemente puede localizarse la fuente primaria.

### STATEMENT

La evidencia puede ser suficiente para afirmar que una persona, empresa o institución dijo algo si existe una declaración directa identificable. La redacción debe mantener la atribución y no convertir la declaración en hecho.

### CONTEXT

Debe existir respaldo suficiente para el contexto utilizado. El contexto no puede introducir una conclusión que exceda la evidencia.

### INFERENCE

Una inferencia necesita evidencia específica para la relación que se está estableciendo. La coincidencia temporal o la proximidad entre dos hechos no demuestra por sí sola causalidad.

### UNKNOWN / PENDING

No pueden transformarse automáticamente en claims verificados. Si posteriormente aparece evidencia, el claim debe reevaluarse.

## 6. Casos especiales

### Datos y cifras

Debe poder identificarse valor, unidad, periodo y fuente. Si MALDITOESPEJO calcula una cifra derivada, debe existir una operación reproducible y entradas verificadas.

### Información jurídica

Debe identificarse la resolución, norma, expediente, registro o documento exacto. Una noticia sobre una decisión no sustituye automáticamente al documento jurídico original cuando este está disponible.

### Ciencia

Debe identificarse el estudio, informe, dataset o institución pertinente. La evidencia no permite ampliar una conclusión científica más allá de lo que realmente sostiene.

### Declaraciones públicas

Una publicación directa puede acreditar que la persona publicó o afirmó algo. Para acreditar que el hecho afirmado ocurrió se necesita evidencia adicional adecuada.

## 7. Independencia

Varias reproducciones de una misma información no aumentan automáticamente la suficiencia.

`MULTIPLES URL ≠ MULTIPLES EVIDENCIAS INDEPENDIENTES`

Si varios medios reproducen el mismo documento, comunicado, agencia o fuente original, pertenecen a la misma línea de procedencia salvo que exista una observación independiente real.

## 8. Contradicciones

Una contradicción material reduce la suficiencia del claim hasta que sea resuelta o delimitada.

Se considera material cuando puede cambiar:

- el titular;
- la entradilla;
- el hecho central;
- una cifra esencial;
- la atribución principal;
- o la interpretación que razonablemente hará el lector.

No debe resolverse una contradicción eligiendo automáticamente la fuente más conveniente.

## 9. Suficiencia parcial

`PARTIALLY_SUFFICIENT` no significa que pueda publicarse la afirmación completa.

Puede permitir una pieza limitada únicamente si:

- se identifica la parte realmente respaldada;
- se reduce la redacción a ese alcance;
- el titular y la entradilla no incorporan la parte no respaldada;
- las dependencias necesarias están resueltas;
- y la revisión editorial confirma que el cambio no altera artificialmente el sentido de la historia.

## 10. Relación con Verification Engine

El resultado de este motor no sustituye la verificación.

- `SUFFICIENT` → puede pasar a `VERIFICATION`.
- `PARTIALLY_SUFFICIENT` → puede pasar a revisión para reducir el claim.
- `INSUFFICIENT` → `RECHECK_REQUIRED` o exclusión del alcance publicable.
- `CONTESTED` → no puede tratarse como hecho establecido mientras exista conflicto material.
- `UNASSESSED` → investigación pendiente.

## 11. Regla de seguridad

Nunca debe rellenarse una carencia documental con inferencias, popularidad de la fuente, número de resultados, repetición mediática o plausibilidad.

Si no existe base suficiente:

> **NO PUBLICAR TODAVÍA**

## 12. Límite de automatización

La máquina puede comprobar presencia de campos, coherencia, tipos de fuente, procedencia declarada, temporalidad y contradicciones registradas. No puede garantizar por sí sola autenticidad, independencia real, intención, contexto completo o verdad material.

Los casos dudosos pasan a revisión humana.

## 13. Principio público

El sistema interno puede ser sofisticado. La noticia final debe ser clara.

El lector debe poder distinguir sin esfuerzo:

- qué está demostrado;
- quién ha dicho algo;
- qué contexto ayuda a entenderlo;
- qué sigue sin saberse.
