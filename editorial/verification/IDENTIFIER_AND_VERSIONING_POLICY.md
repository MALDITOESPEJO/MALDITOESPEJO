# MALDITOESPEJO — IDENTIFIER & VERSIONING POLICY

## 1. Purpose

Every material editorial object must have a stable identifier so that evidence, claims, signals and decisions can be reconstructed across revisions.

## 2. Canonical identifier families

| Object | Identifier |
|---|---|
| Source | `SRC-########` |
| Channel | `CHN-########` |
| Endpoint | `END-########` |
| Feed | `FED-########` |
| Observation | `OBS-########` |
| Event | `EVT-########` |
| Claim | `CLM-########` |
| Narrative | `NAR-########` |
| Evidence | `EVD-########` |
| Verification | `VER-########` |
| Signal | `SIG-########` |
| Editorial decision | `DEC-########` |

Identifiers are opaque references. They must not encode a mutable fact such as priority, truth status or date.

## 3. Version identifiers

Material objects that change over time should additionally expose:

`object_id`
`version`
`created_at`
`updated_at`
`effective_at`
`supersedes_id`
`status`

Recommended version notation:

`v1`, `v2`, `v3` …

Never silently overwrite a materially different evidentiary state.

## 4. Immutable evidence references

An evidence item should preserve, where technically available:

- canonical URL or source locator;
- acquisition timestamp;
- publication timestamp;
- source-reported update timestamp;
- content hash or equivalent integrity reference;
- document/version identifier;
- capture method;
- original filename or media identifier where relevant.

The objective is reproducibility, not merely URL storage.

## 5. State transitions

Example:

`CLM-000104 v1 UNVERIFIED`
→ `CLM-000104 v2 PARTIALLY_VERIFIED`
→ `CLM-000104 v3 VERIFIED`

A later correction should create a new state/version and preserve the previous state for audit purposes.

## 6. Supersession

`SUPERSEDES` means the newer object replaces the earlier operational state.

It does **not** mean the earlier object never existed or was necessarily false.

This distinction is essential for breaking news and evolving events.

## 7. Event identity versus observation identity

Multiple observations may refer to the same event.

Conversely, a single observation may later be shown to have been incorrectly associated with an event.

Therefore:

`OBSERVATION ≠ EVENT`

Association must be explicit in the graph.

## 8. Claim identity

A claim should receive a new identifier when its substantive proposition changes.

Minor editorial wording changes that do not alter meaning may retain the same claim identifier while creating a new version.

## 9. Signal identity

A signal identifies an editorial detection, not the underlying truth.

A new signal may be created when:

- a material update occurs;
- severity changes;
- evidence changes materially;
- a contradiction appears;
- an event crosses a priority threshold;
- an earlier signal is superseded.

## 10. No ID recycling

Identifiers must never be reused after deletion, retirement or supersession.

## 11. Audit principle

Given an identifier, an editor should be able to reconstruct the relevant provenance chain without relying on memory or undocumented context.
