# MALDITOESPEJO — ORIGINAL ARTICLE ENGINE

## 1. Objetivo

Transformar una investigación verificada en una noticia original de MALDITOESPEJO, sin convertir la fuente de descubrimiento en un texto para parafrasear.

El motor redacta únicamente a partir de claims y evidencias disponibles en el caso. No investiga hechos nuevos dentro de la redacción y no rellena vacíos mediante inferencias no documentadas.

## 2. Cadena

`VERIFIED CLAIMS → EDITORIAL HIERARCHY → DRAFT → ORIGINALITY → VERIFIABILITY → EDITORIAL REVIEW`

## 3. Condición de entrada

El motor solo puede generar un borrador publicable cuando el caso contiene un estado de verificación compatible con la redacción.

- `VERIFIED`: permite redactar claims verificados.
- `PARTIALLY_VERIFIED`: solo permite redactar la parte expresamente respaldada.
- `INSUFFICIENT`: no permite presentar la afirmación como hecho.
- `RECHECK_REQUIRED`: bloquea su uso como hecho.
- `CONTESTED`: bloquea la afirmación afectada.

La generación de un borrador nunca equivale a aprobación o publicación.

## 4. Principio de originalidad

MALDITOESPEJO no transforma una noticia en otra noticia.

La fuente de descubrimiento puede haber proporcionado la pista, pero el artículo debe construirse desde la investigación propia del caso.

El motor debe evitar:

- copiar frases de la fuente inicial;
- conservar innecesariamente su orden narrativo;
- reproducir sus subtítulos o estructura;
- introducir datos que solo aparecen en la fuente de descubrimiento y no en la evidencia aceptada;
- convertir una inferencia periodística de terceros en un hecho propio.

## 5. Estructura pública

La estructura ordinaria será:

`TITULAR → ENTRADILLA → HECHOS → CONTEXTO → DECLARACIONES → LO QUE NO SE SABE → FUENTES`

No todas las piezas necesitan todas las secciones. El sistema debe utilizar solo las que tengan contenido documental suficiente.

## 6. Titular

El titular debe expresar el hecho central más sólido.

No puede:

- superar la evidencia disponible;
- convertir una declaración en un hecho;
- ocultar una contradicción material;
- presentar una previsión como un hecho consumado;
- utilizar una cifra que no esté trazada a evidencia.

## 7. Entradilla

La entradilla resume el hecho central y debe poder trazarse a uno o varios claims verificados.

Su nivel de certeza nunca puede superar el del conjunto de evidencias que la sustenta.

## 8. Hechos

Solo se presentan como hechos las afirmaciones con respaldo documental suficiente.

Cada afirmación material debe conservar internamente:

`ARTICLE SENTENCE → CLAIM → EVIDENCE → SOURCE → PROVENANCE`

## 9. Declaraciones

Las declaraciones deben mantenerse como declaraciones.

El sistema debe atribuir claramente quién dijo qué y no convertir una afirmación de una persona u organización en un hecho independiente.

## 10. Contexto

El contexto debe identificarse como tal y no mezclarse con el hecho central.

Debe estar respaldado por la evidencia correspondiente cuando sea material para la comprensión de la noticia.

## 11. Lo que no se sabe

Los claims `UNKNOWN` o `PENDING` pueden utilizarse para explicar qué permanece sin confirmar, pero nunca para completar una historia mediante especulación.

El lenguaje debe ser sencillo: por ejemplo, «Todavía no hay datos suficientes para saberlo» cuando el expediente justifique esa conclusión.

## 12. Fuentes públicas

Solo deben aparecer las fuentes que realmente sustentan la información publicada.

La fuente de descubrimiento no se incluye por el mero hecho de haber originado la investigación.

## 13. Autoría y metadatos

El borrador conserva:

- `case_id`;
- `title`;
- `description`;
- `date`;
- `section`;
- `author`;
- `type`;
- `status`;
- referencias internas a claims y evidencias.

La sección y el autor deben seguir las reglas editoriales de MALDITOESPEJO.

## 14. Estados del borrador

- `DRAFT_GENERATED`
- `ORIGINALITY_REVIEW`
- `VERIFIABILITY_REVIEW`
- `EDITOR_REVIEW`
- `BLOCKED`

Nunca se crea automáticamente un estado `PUBLISHED`.

## 15. Regla de lenguaje

La investigación puede ser compleja; la explicación no debe serlo.

El texto debe distinguir de forma comprensible:

- qué sabemos;
- qué ha dicho alguien;
- qué contexto ayuda a entenderlo;
- qué no podemos confirmar todavía.

## 16. Regla de seguridad

Si una afirmación importante no puede reconstruirse desde la evidencia aceptada, no debe entrar en el artículo como hecho.

> **No publicar ninguna afirmación que el proceso editorial no pueda respaldar documentalmente.**
