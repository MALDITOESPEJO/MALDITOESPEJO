# CLAIMS ENGINE — MALDITOESPEJO

## 1. Propósito

El Claims Engine convierte una pista, noticia, documento o declaración de entrada en una lista estructurada de afirmaciones que deben comprobarse antes de redactar una noticia original.

Su función no es decidir si algo es verdadero. Su función es responder a una pregunta previa:

> **¿Qué afirmaciones concretas tendríamos que demostrar para poder publicar esta historia?**

La investigación puede ser compleja; la explicación no debe serlo.

## 2. Principio fundamental

Una noticia de entrada no se trata como una afirmación única. Se descompone en unidades verificables.

Ejemplo:

`"Sean Ono Lennon, hijo de John Lennon y Yoko Ono, es padre por primera vez"`

se puede descomponer en:

1. Sean Ono Lennon ha sido padre.
2. Es la primera vez que tiene un hijo.
3. El niño es hijo de Charlotte Kemp Muhl.
4. El niño se llama Aurelius.
5. Sean Ono Lennon es hijo de John Lennon y Yoko Ono.

Cada afirmación puede necesitar una fuente o una clase de evidencia distinta.

## 3. Tipos de afirmación

Cada claim debe pertenecer a uno de estos tipos:

- `FACT`: hecho comprobable documentalmente.
- `STATEMENT`: algo que una persona u organización afirma.
- `CONTEXT`: información contextual necesaria para comprender la noticia.
- `UNKNOWN`: cuestión para la que no existe evidencia suficiente.
- `PENDING`: cuestión que requiere una comprobación adicional.

El sistema nunca debe convertir automáticamente `STATEMENT` en `FACT`.

## 4. Campos mínimos

Cada claim debe contener:

- `claim_id`
- `type`
- `claim`
- `importance`
- `verification_status`
- `evidence_required`

Los claims centrales del titular y de la entradilla tienen prioridad máxima.

## 5. Prioridad

Valores permitidos:

- `CENTRAL`: sin esta afirmación la historia cambia sustancialmente.
- `IMPORTANT`: afecta a la comprensión de la noticia.
- `CONTEXTUAL`: aporta contexto pero no sostiene la tesis principal.
- `SECONDARY`: información accesoria.

Regla:

> **Titular y entradilla deben poder reconstruirse a partir de claims `CENTRAL` o `IMPORTANT` verificados.**

## 6. Estados de verificación

- `UNASSESSED`
- `INVESTIGATING`
- `SUPPORTED`
- `CONTESTED`
- `UNSUPPORTED`
- `UNKNOWN`

`SUPPORTED` no significa automáticamente que pueda publicarse. La publicación exige superar el resto del proceso editorial.

## 7. Evidencia requerida

Para cada claim se debe indicar qué clase de prueba sería suficiente, por ejemplo:

- documento oficial;
- registro público;
- declaración directa;
- dato estadístico oficial;
- resolución judicial;
- publicación científica;
- fuente primaria empresarial;
- evidencia visual o documental;
- corroboración independiente.

## 8. Regla de fuentes

Una fuente utilizada para descubrir una historia no se convierte por ello en fuente de publicación.

El Claims Engine debe conservar la distinción entre:

`DISCOVERY SOURCE ≠ PUBLICATION SOURCE`

Las fuentes secundarias pueden ayudar a localizar información, pero las afirmaciones publicadas deben sostenerse en la evidencia realmente localizada y evaluada por MALDITOESPEJO.

## 9. Regla de procedencia

Cada claim importante deberá poder enlazarse posteriormente con:

`CLAIM → EVIDENCE → PROVENANCE → SOURCE`

Una URL adicional no constituye por sí sola una nueva línea de evidencia.

## 10. Regla de incertidumbre

Cuando una afirmación no pueda comprobarse, el sistema debe conservarla como `UNKNOWN` o `PENDING`.

Nunca debe rellenar el vacío mediante una inferencia presentada como hecho.

Ejemplos de lenguaje permitido:

- “Los datos disponibles no permiten determinarlo.”
- “La fecha exacta no ha sido comunicada.”
- “La organización afirma que…”
- “No se ha encontrado confirmación independiente.”

## 11. Resultado esperado

El Claims Engine entrega una matriz que permite pasar a la investigación:

`INPUT → CLAIMS → SOURCES → EVIDENCE → PROVENANCE → VERIFICATION`

Su objetivo final es que ninguna afirmación relevante llegue a la redacción sin una ruta documental posible.

## 12. Regla de seguridad editorial

Ante una afirmación central sin evidencia suficiente:

> **NO PUBLICAR TODAVÍA.**

El sistema puede pedir más investigación, rebajar la afirmación, convertirla en declaración atribuida o marcarla como cuestión abierta.

Nunca debe inventar certeza.
