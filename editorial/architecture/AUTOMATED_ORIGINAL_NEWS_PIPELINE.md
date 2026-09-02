# PIPELINE DE PRODUCCIÓN AUTOMATIZADA DE NOTICIAS ORIGINALES

## 1. Objetivo final

El objetivo de MALDITOESPEJO es que el editor pueda entregar una noticia, pista, documento o fuente inicial y que el sistema ejecute de forma automatizada el trabajo de investigación documental necesario para producir un artículo **original de MALDITOESPEJO, verificable, trazable y escrito con lenguaje claro**.

La fuente entregada por el editor puede ser una fuente de descubrimiento. No se convierte automáticamente en fuente de publicación.

## 2. Límite de la promesa

El sistema debe aspirar al máximo nivel razonable de exactitud y verificabilidad, pero no debe afirmar que una máquina puede garantizar una verdad absoluta en todos los casos.

Por tanto, el objetivo operativo es:

> **No publicar ninguna afirmación que el sistema y la revisión editorial no puedan respaldar documentalmente.**

“100% cierto” se interpreta como estándar editorial de exigencia: cada afirmación publicable debe estar respaldada por evidencia suficiente, actual, atribuible y revisada. Cuando la evidencia no permita una conclusión segura, el sistema debe detenerse, reducir la afirmación o declarar que el dato sigue abierto.

## 3. Entrada

El editor puede proporcionar:

- una noticia de otro medio;
- una URL;
- un comunicado;
- un documento;
- una declaración;
- un dato;
- una pista de investigación;
- varias fuentes iniciales.

La entrada se registra como **punto de partida**, no como verdad.

## 4. Proceso automático

### ETAPA 1 — DETECCIÓN

Identificar qué afirma la fuente inicial y separar:

- hechos afirmados;
- declaraciones;
- cifras;
- fechas;
- interpretaciones;
- predicciones;
- cuestiones que no están demostradas.

### ETAPA 2 — DESCOMPOSICIÓN

Convertir la noticia inicial en afirmaciones comprobables.

Ejemplo:

`NOTICIA INICIAL → AFIRMACIÓN 1 + AFIRMACIÓN 2 + AFIRMACIÓN 3...`

### ETAPA 3 — BÚSQUEDA DE FUENTES

Buscar prioritariamente:

1. documentos oficiales;
2. registros públicos;
3. bases de datos originales;
4. organismos competentes;
5. declaraciones primarias;
6. fuentes independientes de corroboración;
7. medios secundarios cuando aporten contexto o una pista adicional.

### ETAPA 4 — PROVENIENCIA

Determinar de dónde procede cada dato.

Una segunda página que reproduce exactamente la primera no se considera automáticamente una segunda fuente independiente.

### ETAPA 5 — CONTRASTACIÓN

Para cada afirmación importante:

`AFIRMACIÓN → EVIDENCIA → FUENTE → PROCEDENCIA → CORROBORACIÓN / CONTRADICCIÓN`

### ETAPA 6 — CONTROL TEMPORAL

Comprobar:

- fecha del documento;
- fecha del dato;
- periodo al que se refiere;
- vigencia;
- posibles actualizaciones o correcciones posteriores.

### ETAPA 7 — CONTROL DE CONFLICTOS

Buscar activamente información que contradiga la afirmación.

Si existe una contradicción material:

- no ocultarla;
- no elegir automáticamente una fuente;
- evaluar autoridad y procedencia;
- reducir la afirmación si procede;
- dejar la cuestión abierta cuando no pueda resolverse.

### ETAPA 8 — REDACCIÓN ORIGINAL

El artículo se redacta desde las evidencias verificadas, no mediante sustitución de palabras o paráfrasis mecánica de la noticia inicial.

El sistema debe construir una estructura editorial propia:

`TITULAR → ENTRADILLA → HECHOS → CONTEXTO → DECLARACIONES → LO QUE NO SE SABE → FUENTES`

### ETAPA 9 — CONTROL DE ORIGINALIDAD

La pieza final debe:

- tener estructura propia;
- utilizar una redacción propia;
- no copiar frases innecesariamente;
- no reproducir la organización narrativa de la fuente de descubrimiento;
- basarse en la investigación realizada por MALDITOESPEJO.

### ETAPA 10 — CONTROL DE VERIFICABILIDAD

Antes de permitir publicación, el sistema debe poder responder:

- ¿Qué afirmamos?
- ¿Qué evidencia lo demuestra?
- ¿De dónde procede?
- ¿La fuente sigue vigente?
- ¿Existe contradicción?
- ¿Tenemos corroboración suficiente?
- ¿Qué parte es un hecho?
- ¿Qué parte es una declaración?
- ¿Qué parte es contexto?
- ¿Qué no sabemos?

### ETAPA 11 — CONTROL DE LENGUAJE

La información debe ser comprensible para una persona no especialista.

No se deben trasladar al lector las etiquetas técnicas del sistema.

> **La investigación puede ser compleja; la explicación no debe serlo.**

### ETAPA 12 — GATE EDITORIAL

Solo puede pasar a publicación si se cumplen las condiciones documentales y editoriales establecidas.

Si falla una condición material, el sistema debe:

- bloquear la publicación;
- explicar qué falta;
- identificar las afirmaciones afectadas;
- solicitar nueva evidencia o revisión humana.

## 5. Estados del artículo

`INPUT → INVESTIGATING → EVIDENCE_READY → VERIFIED → EDITOR_REVIEW → APPROVED → PUBLISHED`

Estados de excepción:

`RECHECK_REQUIRED`

`CONTESTED`

`BLOCKED`

## 6. Regla de seguridad editorial

El sistema debe preferir:

`NO PUBLICAR TODAVÍA`

frente a:

`PUBLICAR UNA AFIRMACIÓN NO DEMOSTRADA`.

## 7. Separación entre descubrimiento y publicación

La fuente que proporciona la noticia inicial puede permanecer registrada internamente para reconstruir cómo comenzó la investigación.

Pero el artículo público debe citar las fuentes que realmente sustentan las afirmaciones publicadas.

## 8. Resultado esperado

La salida final no debe ser “una versión reescrita de la noticia recibida”.

Debe ser:

> **Una noticia original de MALDITOESPEJO construida a partir de una investigación documental verificable.**

## 9. Papel humano

La automatización realiza la investigación documental, contraste, trazabilidad, controles y redacción conforme a las reglas del sistema.

El editor conserva la decisión final de publicación, especialmente cuando:

- existe conflicto entre fuentes;
- la evidencia es incompleta;
- una fuente ha sido corregida;
- existe una cuestión interpretativa relevante;
- el impacto editorial exige juicio.

## 10. Principio rector

> **MALDITOESPEJO no transforma una noticia en otra noticia. Transforma una pista en una investigación y una investigación verificada en una noticia original.**
