# SOURCE INDEPENDENCE ENGINE

## Propósito

Impedir que MALDITOESPEJO trate como corroboración independiente varias fuentes que en realidad reproducen, citan, agregan o derivan la misma información de origen.

## Principio central

> **El número de URLs no mide la independencia de la evidencia.**

La unidad de análisis es la procedencia de la evidencia, no el número de páginas encontradas.

## Cadena

`FUENTE → EVIDENCIA → PROCEDENCIA → LINAJE → GRUPO DE INDEPENDENCIA → CORROBORACIÓN REAL`

## Relaciones relevantes

- `ORIGINAL`: evidencia originaria.
- `REPRODUCES`: reproduce otra fuente.
- `QUOTES`: cita otra fuente.
- `DERIVED_FROM`: deriva de otra evidencia.
- `AGGREGATES`: agrega información de otras fuentes.
- `ENRICHES`: añade información sin sustituir el origen.
- `INDEPENDENT_OBSERVATION`: observación potencialmente independiente.
- `UNKNOWN_PROVENANCE`: procedencia desconocida.

## Grupos de independencia

Las evidencias que comparten origen, documento, declaración o cadena de reproducción deben poder agruparse en el mismo `independence_group` cuando corresponda.

Ejemplo:

`DOCUMENTO OFICIAL → MEDIO A → MEDIO B → MEDIO C`

No son cuatro corroboraciones independientes del contenido del documento.

## Reglas

1. Una URL adicional no crea independencia.
2. Una agencia de noticias no es independiente de un medio que reproduce su despacho si ambos dependen del mismo material original.
3. Varias publicaciones que citan el mismo documento comparten la misma línea de evidencia para esa afirmación.
4. Dos observaciones directas realmente separadas pueden constituir corroboración independiente, pero requieren valoración editorial.
5. Una fuente con procedencia desconocida no debe contarse como corroboración independiente.
6. Un agregador debe conducir, cuando sea posible, hacia la fuente original.

## Independencia frente a autoridad

`FUENTE AUTORITATIVA ≠ FUENTE INDEPENDIENTE`

Una fuente puede ser muy autorizada y no aportar una segunda observación independiente.

La independencia y la autoridad son dimensiones distintas.

## Corroboración

La corroboración aumenta cuando existen líneas de evidencia realmente separadas que sostienen la misma afirmación.

No aumenta simplemente porque:

- aparezcan más resultados de búsqueda;
- varios medios publiquen la misma noticia;
- varias páginas reproduzcan el mismo comunicado;
- una noticia cite una agencia y otra cite al primer medio;
- varios documentos tengan el mismo origen administrativo.

## Contradicciones

Si dos fuentes del mismo linaje se contradicen, el conflicto no se resuelve contando una como corroboración frente a otra.

Debe investigarse el documento o hecho de origen.

## Estados

- `INDEPENDENCE_ESTABLISHED`
- `PARTIALLY_INDEPENDENT`
- `SHARED_PROVENANCE`
- `UNKNOWN_INDEPENDENCE`
- `CONTESTED_INDEPENDENCE`
- `EDITORIAL_REVIEW_REQUIRED`

## Automatización

La máquina puede detectar relaciones declaradas, URLs repetidas, documentos comunes, linajes y grupos de independencia.

No puede afirmar por sí sola que dos observaciones son realmente independientes cuando la relación no está documentada.

En caso dudoso:

> **UNKNOWN_INDEPENDENCE → NO CONTAR COMO CORROBORACIÓN INDEPENDIENTE**

## Publicación

La evidencia compartida puede seguir siendo válida para demostrar una afirmación si su fuente de origen es adecuada.

Lo que no puede hacer es crear una falsa sensación de corroboración múltiple.

## Regla final

> **MALDITOESPEJO no cuenta cuántas veces se ha repetido una información. Cuenta cuántas líneas de evidencia independientes puede identificar.**
