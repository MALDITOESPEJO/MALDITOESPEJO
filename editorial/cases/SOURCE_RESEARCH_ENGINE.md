# MALDITOESPEJO — SOURCE RESEARCH ENGINE

## Objetivo

Convertir las afirmaciones de un caso en un plan explícito de búsqueda documental.

El motor no decide qué es verdadero. Decide **qué debe comprobarse y qué clase de fuente puede comprobarlo mejor**.

## Flujo

`CLAIM → EVIDENCE REQUIREMENT → SOURCE TARGET → RESEARCH → EVIDENCE`

## Principios

1. La fuente de descubrimiento sirve para iniciar la investigación, no para validar automáticamente la afirmación.
2. Para afirmaciones centrales se priorizan fuentes primarias o documentales de primera mano.
3. Una fuente secundaria puede aportar contexto, localizar documentos o revelar una posible contradicción, pero no se convierte automáticamente en evidencia independiente.
4. Cada afirmación debe tener una necesidad de evidencia explícita.
5. Si no existe una fuente adecuada, la afirmación permanece `PENDING` o `UNKNOWN`.
6. El sistema no debe rellenar huecos con inferencias no documentadas.

## Tipos de destino

- `PRIMARY_DOCUMENT`
- `OFFICIAL_DATA`
- `DIRECT_STATEMENT`
- `COURT_OR_LEGAL_RECORD`
- `OFFICIAL_REGISTRY`
- `INDEPENDENT_CORROBORATION`
- `SPECIALIST_CONTEXT`
- `SECONDARY_DISCOVERY`

## Prioridad de búsqueda

`FUENTE PRIMARIA → REGISTRO OFICIAL → DOCUMENTO ORIGINAL → CORROBORACIÓN INDEPENDIENTE → CONTEXTO ESPECIALIZADO → MEDIO SECUNDARIO`

Esta jerarquía es una guía de investigación, no una regla absoluta de autoridad. La naturaleza de la afirmación determina la fuente apropiada.

## Resultado esperado

El motor debe producir un `research_plan` con, como mínimo:

- `claim_id`
- `priority`
- `evidence_required`
- `source_targets`
- `search_questions`
- `status`

## Regla de seguridad

Una búsqueda completada no equivale a una verificación completada.

`SOURCE FOUND ≠ EVIDENCE ACCEPTED ≠ CLAIM VERIFIED`

## Lenguaje

La investigación puede ser compleja; la explicación no debe serlo.
