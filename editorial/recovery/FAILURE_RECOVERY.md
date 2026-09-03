# MALDITOESPEJO — Failure & Recovery

## Objetivo

Un fallo técnico, documental o de disponibilidad no puede convertirse en una afirmación editorial válida. El sistema debe detenerse, registrar el punto exacto del fallo y permitir una reanudación segura.

## Estados

- `RUNNING`: ejecución en curso.
- `FAILED`: una etapa no pudo completarse.
- `WAITING_RECOVERY`: el caso requiere intervención o reintento.
- `RECOVERED`: el punto de fallo fue resuelto y las dependencias posteriores deben revalidarse.
- `BLOCKED`: no puede continuar de forma segura.

## Reglas

1. Cada fallo genera un registro con `case_id`, etapa, timestamp, código y mensaje.
2. Un reintento nunca borra el fallo anterior.
3. La recuperación se hace desde el último checkpoint válido, no desde una etapa posterior al fallo.
4. Si cambia la evidencia, la recuperación debe volver a ejecutar contraste, contradicciones, suficiencia, cobertura, verificación, incertidumbre, alcance, trazabilidad y gate.
5. Un fallo de una fuente no autoriza a sustituirla silenciosamente por otra.
6. La ausencia temporal de una fuente se distingue de la evidencia que contradice una afirmación.
7. `RECOVERED` no significa `VERIFIED` ni `PUBLISHED`.
8. El Publication Gate continúa siendo una barrera independiente.

## Tipos de fallo

`SOURCE_UNAVAILABLE`, `SEARCH_FAILED`, `IMPORT_FAILED`, `EVIDENCE_UNAVAILABLE`, `VALIDATION_FAILED`, `DEPENDENCY_FAILED`, `TIMEOUT`, `INVALID_INPUT`, `UNKNOWN`.

## Flujo

`FAILURE → RECORD → CHECKPOINT → WAITING_RECOVERY → RETRY → REVALIDATE_DEPENDENCIES → CONTINUE OR BLOCK`

## Idempotencia

El identificador de ejecución (`run_id`) y el número de intento (`attempt`) permiten distinguir reintentos. Los registros anteriores se conservan.

## Seguridad editorial

Ante duda, el sistema debe bloquear. Nunca debe degradar silenciosamente un resultado fallido a una afirmación publicada.
