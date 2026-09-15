# Auditoría de integridad editorial del archivo histórico

Fecha: 2026-09-15
Base: `main` @ `7e2a340bd5cf1596d08deadc67eba8f1ffe9d7c4`

## Alcance

Se revisan los artículos `approved`/`published` anteriores al 12 de septiembre de 2026, fecha de entrada en vigor de la política editorial actual.

La política vigente exige:

- autor público: `Redacción MALDITOESPEJO`;
- una o varias fuentes, siempre que sean oficiales/primarias;
- revisión humana antes de publicación.

## Resultado

El archivo histórico contiene artículos aprobados anteriores a la política actual que no tienen el campo `sources`. Esto impide afirmar su trazabilidad conforme al estándar vigente sin una revisión editorial de cada pieza.

Ejemplo confirmado durante la auditoría:

- `australia-estados-unidos-cooperacion-pacifico-septiembre-2026.md`: `status: approved`, fecha `2026-09-03`, sin `sources` en frontmatter.

También existen artículos históricos con autores editoriales anteriores. La capa pública actual ya normaliza el autor visible a `Redacción MALDITOESPEJO`, pero el frontmatter histórico conserva el dato original. No se recomienda reescribir esos metadatos automáticamente sin revisar primero la procedencia de cada artículo.

## Criterio de remediación

No se retira ni modifica ningún artículo histórico automáticamente. Para cada pieza se debe:

1. identificar las afirmaciones publicables;
2. recuperar una o varias fuentes oficiales/primarias que respalden esas afirmaciones;
3. contrastar el alcance de cada fuente con el texto publicado;
4. añadir `sources` solo después de esa verificación;
5. conservar el artículo como `approved` únicamente si supera la revisión editorial.

La remediación del archivo histórico queda separada de la validación automática de los artículos nuevos para evitar que una ausencia histórica de `sources` bloquee retrospectivamente el flujo actual.
