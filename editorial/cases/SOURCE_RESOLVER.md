# SOURCE RESOLVER

## Propósito

Identificar de forma conservadora qué registro del `MASTER_SOURCE_REGISTRY` corresponde a una fuente recuperada durante la investigación.

## Regla central

> Resolver una fuente no significa verificarla.

El resolver únicamente establece una correspondencia documental entre una página encontrada y un registro conocido del sistema.

## Coincidencia válida

Una fuente solo obtiene `EXACT_REGISTRY_MATCH` cuando existe una coincidencia única y suficientemente clara, priorizando:

1. dominio oficial;
2. nombre de fuente;
3. institución.

## Ambigüedad

Si existen varios candidatos o ninguno encaja claramente:

`AMBIGUOUS_REGISTRY_MATCH` / `NO_REGISTRY_MATCH`

La fuente permanece pendiente de revisión.

## Información heredada

Cuando existe una coincidencia única, el sistema puede asociar:

- `source_id`;
- nombre;
- institución;
- tipo de fuente;
- naturaleza primaria/secundaria;
- nivel de autoridad;
- función editorial;
- disponibilidad de evidencia primaria.

Estos datos son metadatos del registro, no una conclusión sobre la verdad del contenido concreto.

## Independencia

El resolver no decide si dos fuentes son independientes. Esa decisión corresponde a procedencia y contraste.

## Seguridad

Nunca debe resolverse una fuente por mera similitud temática. Si la correspondencia no es clara, se mantiene sin resolver.

## Principio final

`SOURCE RESOLVED ≠ EVIDENCE ACCEPTED ≠ CLAIM VERIFIED`
