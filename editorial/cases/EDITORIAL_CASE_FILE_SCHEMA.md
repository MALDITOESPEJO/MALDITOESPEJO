# MALDITOESPEJO — EDITORIAL CASE FILE SCHEMA

## 1. Purpose

The **Editorial Case File** is the central unit of investigation in MALDITOESPEJO.

It aggregates the evidence, claims, events, observations, signals, verification work and editorial decisions associated with one consequential editorial matter.

It is the bridge between the intelligence system and the newsroom.

## 2. Case lifecycle

`OPEN → TRIAGE → INVESTIGATING → VERIFYING → DECIDING → PUBLISHED / HOLD / CLOSED`

A published case may later reopen:

`PUBLISHED → REOPENED → REVIEWING → UPDATED / CORRECTED / RETRACTED / CLOSED`

## 3. Case identity

Required:

`case_id`
`case_version`
`created_at`
`updated_at`
`status`
`case_type`
`jurisdiction`
`topic`
`title_internal`
`lead_editor`

## 4. Evidence package

A case should reference, rather than duplicate, its graph objects:

- `source_ids`
- `channel_ids`
- `endpoint_ids`
- `feed_ids`
- `observation_ids`
- `event_ids`
- `claim_ids`
- `narrative_ids`
- `evidence_ids`
- `verification_ids`
- `signal_ids`

## 5. Editorial assessment

Required where applicable:

`priority`
`confidence`
`verification_status`
`contradiction_status`
`misinformation_risk`
`public_interest`
`legal_sensitivity`
`humanitarian_or_safety_impact`
`geographic_scope`
`temporal_scope`

## 6. Case brief

Every active consequential case should contain:

### Known
Facts or observations supported by adequate evidence.

### Claimed
Assertions attributed to identified actors or sources.

### Unknown
Material facts not yet established.

### Disputed
Material propositions for which credible evidence conflicts.

### Working hypothesis
An explicitly labelled investigative hypothesis. It must never be presented as established fact.

## 7. Investigation log

Every significant investigative action should be traceable:

`timestamp`
`actor`
`action`
`object_type`
`object_id`
`result`
`next_action`

## 8. Decision record

The case must link to one or more `decision_id` records.

The current decision must be explicit rather than inferred from the existence of a publication.

## 9. Publication linkage

If published:

`publication_id`
`publication_url`
`published_at`
`published_version`
`decision_id`

A publication may reference multiple claims and events, but each consequential claim must remain individually traceable.

## 10. Reopening conditions

A closed or published case should be eligible for reopening when:

- new primary evidence appears;
- a source revises a material statement or dataset;
- a credible contradiction emerges;
- an important factual error is discovered;
- the event changes materially;
- a legal or regulatory development changes the interpretation.

## 11. Separation principle

The case file is an **index and governance object**, not a replacement for the underlying evidence graph.

Evidence remains independently addressable and auditable.

## 12. Final editorial question

Before publication, the editor should be able to answer from the case file:

**What do we know, how do we know it, what do we not know, what is disputed, and why are we publishing this now?**
