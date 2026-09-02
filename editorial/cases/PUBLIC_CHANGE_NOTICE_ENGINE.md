# PUBLIC CHANGE NOTICE ENGINE

## Propósito

Definir cómo MALDITOESPEJO comunica al lector los cambios realizados en una noticia ya publicada.

La comunicación pública debe ser clara, breve, proporcional y trazable. El lector no necesita conocer la arquitectura interna del sistema, pero sí debe poder entender qué cambió y por qué.

## Tipos públicos

### ACTUALIZADO

Se utiliza cuando aparece información nueva, se completa el contexto o cambia una circunstancia posterior sin que la versión anterior contuviera necesariamente un error.

Forma visible recomendada:

> **Actualizado:** [fecha y hora]. Se ha añadido información sobre [qué ha cambiado].

### CORREGIDO

Se utiliza cuando una afirmación publicada era incorrecta o contenía un error material.

Forma visible recomendada:

> **Corregido:** [fecha y hora]. Una versión anterior de esta información indicaba [descripción breve]. El dato correcto es [dato correcto].

La explicación debe identificar el error de forma comprensible, sin ocultarlo ni exagerarlo.

### RETIRADO

Se utiliza cuando la pieza debe dejar de estar públicamente disponible por una decisión editorial documentada.

Forma visible recomendada:

> **Retirado:** [fecha y hora]. Esta información ha sido retirada tras una revisión editorial.

Cuando sea posible y apropiado, debe explicarse de forma breve la razón de la retirada.

## Qué debe conservarse internamente

Cada aviso público debe poder vincularse a:

`correction_id → article_id → versión anterior → nueva versión → evidencia → claims afectados → decisión editorial`

El aviso público no sustituye al registro interno de corrección.

## Reglas de publicación

1. Ningún aviso se publica automáticamente por el mero hecho de detectar un cambio en una fuente.
2. `UPDATE`, `CORRECTION` y `WITHDRAW` son decisiones editoriales distintas.
3. Una corrección debe identificar el error y, cuando sea posible, el dato correcto.
4. Una actualización no debe presentarse como corrección si la versión anterior era correcta en el momento de publicación.
5. Si un cambio afecta al titular o a la entradilla, el aviso debe acompañar a la nueva versión y quedar registrado.
6. La fecha y hora del cambio deben conservarse.
7. La versión anterior no se elimina del historial interno.
8. No se debe utilizar lenguaje técnico como `claim`, `evidence`, `lineage` o `provenance` en el aviso destinado al lector.
9. El texto público debe ser comprensible sin conocimientos especializados.
10. Si la causa del cambio no puede determinarse con seguridad, el aviso debe limitarse a lo que esté documentalmente establecido.

## Jerarquía pública

La información visible para el lector seguirá esta prioridad:

`ESTADO DEL CAMBIO → CUÁNDO → QUÉ CAMBIÓ → POR QUÉ, SI ESTÁ CLARO`

No es necesario mostrar toda la cadena documental al lector. La trazabilidad completa permanece en el registro editorial.

## Estados del aviso

- `DRAFT`: preparado, no publicado.
- `APPROVED`: aprobado editorialmente.
- `PUBLISHED`: visible para el lector.
- `SUPERSEDED`: sustituido por un aviso posterior.
- `WITHDRAWN`: retirado.

## Principio editorial

> **El lector debe saber cuándo una noticia ha cambiado y entender qué cambió; el sistema interno debe poder demostrar por qué cambió.**

La investigación puede ser compleja; la explicación no debe serlo.
