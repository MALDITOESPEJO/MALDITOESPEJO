# ALERTAS POR CAMBIO DE EVIDENCIA

## Objetivo

Definir cuándo un cambio en una fuente o evidencia debe detener temporalmente la confianza editorial en una noticia ya verificada.

## Nivel 1 — Cambio no material

Ejemplos:

- corrección ortográfica;
- cambio de formato;
- URL alternativa al mismo documento;
- actualización técnica sin cambio de contenido.

Acción: conservar trazabilidad. No requiere reverificación material.

## Nivel 2 — Cambio material secundario

Ejemplos:

- cifra secundaria corregida;
- fecha contextual modificada;
- dato que afecta a una parte no central de la pieza.

Acción: marcar `recheck_required` y revisar las afirmaciones dependientes antes de mantener la pieza como plenamente verificada.

## Nivel 3 — Cambio material central

Ejemplos:

- corrección de una cifra del titular;
- modificación de la afirmación central;
- retirada del documento que sustentaba la noticia;
- aparición de una contradicción material.

Acción: bloquear la continuidad automática de la verificación y exigir revisión humana.

## Regla

`CAMBIO MATERIAL → ALERTA → AFIRMACIONES AFECTADAS → REVERIFICACIÓN → DECISIÓN HUMANA`

El sistema nunca debe concluir automáticamente que una noticia es falsa por el mero hecho de que una fuente haya cambiado.
