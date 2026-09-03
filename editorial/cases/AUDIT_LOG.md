# MALDITOESPEJO — AUDIT LOG

## Purpose

The audit log records material editorial events without replacing the underlying case, evidence, verification, version or approval records.

## Invariants

1. Every material pipeline transition should produce an audit event.
2. An event is append-only at the logical level: existing events are never edited or deleted by the pipeline.
3. Each event identifies the case, stage, event type, timestamp and outcome.
4. Audit events are documentary records, not approval decisions.
5. Human approval must remain attributable to an explicit approval record.

## Event schema

Each JSON event contains:

- `event_id`: unique `AUDIT-########` identifier.
- `timestamp`: ISO-8601 UTC timestamp.
- `case_id`: editorial case identifier.
- `stage`: pipeline stage or editorial process.
- `event_type`: action performed.
- `status`: outcome (`PASS`, `FAIL`, `BLOCKED`, `REVIEW_REQUIRED`, `INFO`).
- `actor`: `SYSTEM` or an explicit human/editor identifier.
- `details`: concise structured details relevant to reconstruction.

## Storage

Per-case logs are stored at:

`editorial/audit/<CASE-ID>.jsonl`

JSONL is used so each event is a discrete record and the history can be reconstructed sequentially.

## Non-goals

The audit log does not contain secrets, credentials or unnecessary personal data, and does not replace source/evidence records.
