# MALDITOESPEJO — CLAIM DEPENDENCY ENGINE

## 1. Objetivo

El `Claim Dependency Engine` identifica qué afirmaciones, elementos editoriales y conclusiones dependen de otras afirmaciones.

Su función es evitar que un cambio en un dato fundamental pase inadvertido en otras partes de la investigación o del artículo.

## 2. Principio

> **Si cambia una afirmación de la que dependen otras, el sistema debe identificar qué elementos deben volver a revisarse.**

El motor no decide si una afirmación es verdadera. Propaga dependencias y riesgos de revisión.

## 3. Flujo

`CLAIM → DEPENDENCIA → CLAIM AFECTADO → EVIDENCIA / CÁLCULO / TEXTO → REVISIÓN`

## 4. Tipos de dependencia

- `DIRECT`: una afirmación presupone otra.
- `DERIVED`: una afirmación se obtiene a partir de otra mediante una transformación o cálculo.
- `CONDITIONAL`: una afirmación solo es válida si otra se mantiene.
- `CONTEXTUAL`: una afirmación aporta contexto relacionado, sin depender lógicamente del hecho principal.
- `EDITORIAL`: titular, entradilla u otro elemento editorial depende de una afirmación.

## 5. Estados de propagación

Cuando una afirmación cambia de estado:

- `VERIFIED` → no genera alerta por sí sola.
- `PENDING` / `UNKNOWN` → las dependencias no pueden presentarse como hechos verificados.
- `CONTESTED` → las dependencias afectadas requieren revisión.
- `RECHECK_REQUIRED` → las dependencias afectadas requieren nueva comprobación.
- `SUPERSEDED` → las dependencias deben evaluarse contra la nueva versión.

## 6. Regla de incertidumbre

Una afirmación derivada no puede adquirir automáticamente un nivel de certeza superior al de las afirmaciones de las que depende.

Ejemplo:

`CLM-01 = PENDING`

`CLM-02 = DERIVED_FROM CLM-01`

Resultado: `CLM-02` no puede considerarse `VERIFIED` únicamente por existir el cálculo o la relación.

## 7. Elementos editoriales dependientes

El grafo debe poder registrar dependencias de:

- titular;
- entradilla / descripción;
- hechos;
- contexto;
- declaraciones;
- conclusiones;
- cifras calculadas;
- tablas o gráficos;
- alcance publicable.

## 8. No inferir dependencias inexistentes

El motor debe ser conservador. No debe declarar que dos afirmaciones dependen entre sí simplemente porque aparecen en el mismo artículo o tratan del mismo asunto.

Las dependencias deben estar declaradas o derivarse de relaciones explícitas y comprobables.

## 9. Ciclos

Las dependencias deben formar un grafo dirigido. Un ciclo material debe generar una alerta porque dificulta determinar qué afirmación fundamenta a cuál.

## 10. Regla de publicación

La existencia de una dependencia no bloquea por sí misma una noticia.

El bloqueo se produce cuando una afirmación o elemento editorial publicable depende de una afirmación que está `CONTESTED`, `RECHECK_REQUIRED`, `PENDING` o `UNKNOWN` y no existe una formulación independiente y verificable.

Esto permite publicar lo que está verificado sin arrastrar automáticamente a la publicación todo lo que permanece abierto.

## 11. Regla de lenguaje

La investigación puede ser compleja; la explicación no debe serlo.

El lector no necesita conocer el grafo interno. Solo debe recibir afirmaciones que el proceso editorial pueda respaldar documentalmente.
