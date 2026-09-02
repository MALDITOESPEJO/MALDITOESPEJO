# CORRECTION RECORD — ESQUEMA DE CORRECCIÓN Y VERSIONADO

## Propósito

Registrar de forma inmutable la decisión editorial adoptada cuando una evidencia cambia y puede afectar a una noticia ya publicada.

El registro no modifica por sí mismo el artículo. Documenta el impacto, la decisión humana y, cuando proceda, la relación entre la versión anterior y la nueva.

## Cadena

`CAMBIO EN EVIDENCIA → IMPACTO → CLAIM → FRASE → ARTÍCULO → DECISIÓN EDITORIAL → NUEVA VERSIÓN → AVISO PÚBLICO`

## Identidad

Cada corrección utiliza un identificador único: `COR-########`. El identificador no se reutiliza.

## Estados

- `DRAFT`: registro creado, pendiente de revisión.
- `REVIEW`: revisión editorial en curso.
- `APPROVED`: decisión editorial aprobada, todavía no necesariamente aplicada.
- `APPLIED`: decisión aplicada al contenido publicado.
- `CLOSED`: revisión concluida y documentada.

## Decisiones

- `CORRECTION`: existe un error material que debe corregirse.
- `UPDATE`: la información ha cambiado o se ha completado sin que exista necesariamente un error en la versión anterior.
- `NO_CHANGE`: la revisión concluye que la pieza no necesita modificación.
- `WITHDRAW`: la pieza debe retirarse.

## Registro mínimo

```json
{
  "correction_id": "COR-00000001",
  "article_id": "article-id",
  "article_version_before": "v1",
  "article_version_after": null,
  "trigger_evidence_ids": ["EVD-00000001"],
  "affected_claim_ids": ["CLM-00000001"],
  "affected_sentence_ids": ["SEN-00000001"],
  "affected_calculation_ids": [],
  "decision": "CORRECTION",
  "decision_reason": "",
  "public_notice_required": true,
  "status": "DRAFT",
  "approved_by": null,
  "approved_at": null,
  "applied_at": null,
  "notes": ""
}
```

## Reglas

1. Una corrección no borra la versión histórica.
2. `CORRECTION` requiere al menos una evidencia desencadenante.
3. `APPROVED` requiere aprobación humana identificable y fecha.
4. `APPLIED` requiere versión anterior y nueva, además de fecha de aplicación.
5. La automatización puede identificar impacto, pero no decidir por sí sola entre corregir, actualizar, mantener o retirar.
6. El registro debe conservar los objetos afectados para permitir reconstruir por qué se tomó la decisión.
7. Un cambio de información no es automáticamente un error publicado: el editor debe distinguir actualización de corrección.
8. Si el titular o la entradilla están afectados, la revisión editorial es obligatoria.
9. La explicación pública debe ser clara y proporcional al error o cambio.

## Principio editorial

> **Corregir no significa borrar la historia: significa dejar constancia de qué cambió, por qué cambió y cuándo se corrigió.**

La investigación puede ser compleja; la explicación no debe serlo.
