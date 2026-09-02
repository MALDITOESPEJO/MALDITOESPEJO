# SOURCE CHANGE & IMPACT ENGINE

## 1. Purpose

The Source Change & Impact Engine (SCIE) converts source-health and source-change events into traceable editorial impact alerts.

It answers a specific operational question:

> If a source, channel, endpoint, feed, lineage, or underlying methodology changes, which evidence, cases, claims, events, verification decisions, and publications may need human review?

The engine is an **impact-propagation system, not an automatic truth or publication system**.

It must never silently invalidate evidence, retract an article, or convert a change event into an editorial conclusion.

## 2. Canonical propagation chain

`SOURCE_CHANGE_EVENT → SOURCE/CHANNEL/ENDPOINT/FEED → LINEAGE → EVIDENCE → CASE → CLAIM/EVENT → VERIFICATION → DECISION → PUBLICATION`

Propagation is directional for detection purposes, but historical relationships remain preserved.

## 3. Inputs

The engine consumes:

- `SOURCE_HEALTH_EVENTS`
- source/channel/endpoint/feed registries
- evidence provenance chains
- evidence graph relationships
- source dependency registry
- editorial case records
- verification records
- editorial decisions
- publication references
- version and revision metadata

## 4. Change-event classes

### SC-01 — CORRECTION
A source corrects previously published material.

### SC-02 — RETRACTION
A source withdraws or retracts previously published material.

### SC-03 — DATASET_REVISION
A dataset revises historical or current observations.

### SC-04 — METHODOLOGY_CHANGE
The methodology, definitions, sampling, calculation, classification, or coverage changes materially.

### SC-05 — ENDPOINT_CHANGE
An API, URL, feed, schema, authentication mechanism, or endpoint behaviour changes.

### SC-06 — SOURCE_DEPRECATION
A source, dataset, feed, API, or service is discontinued or formally deprecated.

### SC-07 — PROVENANCE_CHALLENGE
The origin, chain of custody, attribution, or provenance of material evidence becomes uncertain or disputed.

### SC-08 — INTEGRITY_COMPROMISE
Stored or retrieved material shows a possible integrity problem, unexpected modification, corruption, or compromised delivery path.

### SC-09 — ACCESS_LOSS
A previously available evidence source becomes inaccessible, restricted, blocked, or unavailable.

### SC-10 — OWNERSHIP_OR_PUBLISHER_CHANGE
Publisher, institutional owner, responsible authority, or data custodian changes.

### SC-11 — URL_OR_DOMAIN_MIGRATION
A resource moves location without necessarily changing its substantive content.

### SC-12 — CONFLICTING_VERSIONS
Two or more materially different versions coexist and their authoritative status is unresolved.

## 5. Impact levels

### INFO
Operational or documentary change with no identified material editorial consequence.

### WATCH
Possible downstream relevance. Human monitoring required where the affected object is active or consequential.

### MATERIAL
A credible possibility that evidence, verification, a case, claim/event, decision, or publication is materially affected.

### CRITICAL
A consequential change affecting core evidence, provenance, integrity, or a published assertion where immediate human review is required.

Impact level is **not** a truth score and does not imply fault by the source.

## 6. Materiality test

A change is material when it can alter one or more of:

1. the factual value of evidence;
2. the interpretation of an observation;
3. the identity, timing, location, scope, or magnitude of an event;
4. the support for a central claim;
5. the verification status;
6. the independence/corroboration structure;
7. the editorial decision rationale;
8. a published statement;
9. a legal, financial, public-safety, humanitarian, electoral, security, or scientific conclusion.

Cosmetic changes, URL migrations with verified content continuity, formatting changes, or non-substantive metadata changes should normally remain INFO unless another dependency makes them material.

## 7. Propagation logic

### Level 0 — Source change
Register the change event with:

- source;
- channel;
- endpoint;
- feed;
- detected/effective timestamps;
- previous state;
- new state;
- evidence of the change;
- change type;
- materiality assessment.

### Level 1 — Lineage
Identify all evidence lineage objects dependent on the changed resource.

Do not assume every item from the source is affected. Scope must be evidence-specific where possible.

### Level 2 — Evidence
Identify evidence that:

- was directly derived from the changed resource;
- cites the changed resource as primary support;
- depends on a revised dataset version;
- inherits the affected provenance chain;
- has unresolved version ambiguity.

### Level 3 — Cases
Identify active and historical editorial cases using affected evidence.

### Level 4 — Claims and events
Identify claims/events materially supported, contradicted, dated, located, quantified, or contextualized by affected evidence.

### Level 5 — Verification
Review whether the change alters:

- verification status;
- corroboration count or independence;
- contradiction status;
- temporal/geographic consistency;
- confidence;
- evidence hierarchy.

### Level 6 — Decisions
Identify editorial decisions whose rationale materially depends on affected verification/evidence.

### Level 7 — Publications
Identify published material whose assertions materially depend on affected decisions/evidence.

A publication impact alert does **not** automatically mean correction or retraction.

## 8. Hard propagation rules

### Rule SCIE-01 — Correction
A material source correction must trigger review of directly dependent evidence and any consequential claims/cases.

### Rule SCIE-02 — Retraction
A source retraction affecting central evidence must trigger CRITICAL review of dependent cases and publications.

### Rule SCIE-03 — Dataset revision
Historical revisions must identify affected observation periods, series, versions, and derived evidence before propagation.

### Rule SCIE-04 — Methodology change
Do not mix pre-change and post-change observations as directly comparable without explicit methodological assessment.

### Rule SCIE-05 — Endpoint change
An endpoint migration does not imply substantive change. Verify continuity before treating it as material.

### Rule SCIE-06 — Deprecation
Deprecation creates an operational warning; it does not invalidate historical evidence automatically.

### Rule SCIE-07 — Provenance challenge
Any consequential evidence with materially uncertain provenance must be escalated for human review and cannot silently retain its former verification status.

### Rule SCIE-08 — Integrity compromise
Potential integrity compromise affecting stored or transmitted evidence requires immediate containment/review. Hash comparison can establish change, not authenticity or truth.

### Rule SCIE-09 — Access loss
Loss of access does not itself invalidate evidence. Preserve cached/original evidence and provenance where legally and operationally permitted.

### Rule SCIE-10 — Ownership change
Ownership change requires assessment of authority, continuity, provenance, and methodology; it does not automatically downgrade the source.

### Rule SCIE-11 — URL/domain migration
A migration may remain INFO if continuity is independently established. Broken provenance continuity escalates to WATCH or MATERIAL.

### Rule SCIE-12 — Conflicting versions
When authoritative versions conflict, preserve both states, mark the conflict, and prevent silent selection of one version as truth.

## 9. Re-review triggers

Immediate human review is mandatory when any of the following occurs:

- central published evidence is retracted;
- primary evidence is materially corrected;
- historical figures supporting a material claim are revised;
- methodology changes alter the meaning of a material observation;
- provenance becomes materially uncertain;
- integrity is compromised or cannot be established;
- two authoritative versions materially conflict;
- a consequential case loses its only strong evidence lineage;
- a published claim falls below its required evidence standard;
- a source correction changes a legal, electoral, security, humanitarian, financial, scientific, or public-safety conclusion.

## 10. No automatic invalidation

The engine must **never** execute any of the following automatically:

- `RETRACT` a publication;
- `CORRECT` a publication;
- mark a claim `FALSE`;
- mark an event as not having occurred;
- delete evidence;
- delete historical versions;
- change a human editorial decision into another decision;
- treat a source change as proof of manipulation or bad faith.

It may create alerts, lower operational status, suspend downstream automation, or require review.

## 11. Historical integrity

Every change must preserve:

`previous_state → change_event → new_state`

Historical evidence, versions, decisions, and publication states must remain auditable.

The current state must never erase the state that existed when an earlier editorial decision was made.

## 12. Editorial alert lifecycle

`DETECTED → TRIAGED → ASSIGNED → REVIEWING → ASSESSED → RESOLVED`

Possible resolutions:

- `NO_IMPACT`
- `MONITOR`
- `REVERIFY`
- `UPDATE`
- `CORRECT`
- `RETRACT`
- `DISPUTED`
- `CLOSE`

Only an authorized human editorial decision can execute publication-state changes.

## 13. Dependency-aware impact

Impact must account for:

- number of affected cases;
- number of affected material assertions;
- centrality of the changed evidence;
- whether independent corroboration remains;
- whether the changed source is the only strong lineage;
- topic sensitivity;
- publication status;
- reversibility;
- legal/public-safety consequences;
- uncertainty.

High concentration increases review urgency but does not itself prove error.

## 14. Independence rule

Repeated downstream references to the same corrected/retracted source are one evidentiary lineage unless genuinely independent evidence exists.

A source correction therefore propagates across apparently different publishers when they share the same underlying dispatch, dataset, document, or evidence.

## 15. Version-aware dataset rule

For revised datasets preserve at minimum:

- dataset ID;
- dataset version;
- series ID;
- observation period;
- old value/state;
- new value/state;
- revision timestamp;
- methodology version;
- extraction timestamp;
- affected evidence IDs.

A later revision cannot be projected backward into the editorial record without preserving what was knowable at the earlier time.

## 16. Publication review matrix

| Change | Active case | Published claim | Default impact |
|---|---|---|---|
| Cosmetic metadata | monitor | none | INFO |
| URL migration | verify continuity | usually none | INFO/WATCH |
| Endpoint schema change | review extraction | possible | WATCH/MATERIAL |
| Historical revision | review affected observations | possible | MATERIAL |
| Methodology change | mandatory assessment | possible | MATERIAL |
| Material correction | mandatory review | likely | MATERIAL |
| Retraction of central evidence | immediate review | likely | CRITICAL |
| Provenance compromise | immediate review | likely | CRITICAL |
| Integrity compromise | immediate containment | likely | CRITICAL |
| Conflicting authoritative versions | immediate review | possible | MATERIAL/CRITICAL |

## 17. Human editorial gate

The final chain remains:

`SOURCE CHANGE → IMPACT ALERT → HUMAN REVIEW → REVERIFICATION → EDITORIAL DECISION`

The engine provides traceability and prioritization. It does not replace editorial judgment.

## 18. Relationship with Source Health

`SOURCE_HEALTH` describes the condition of the source/resource.

`SOURCE_CHANGE_IMPACT` describes the downstream editorial consequences of a change.

They must remain separate:

`SOURCE HEALTH ≠ SOURCE CHANGE ≠ TRUTH ≠ EDITORIAL DECISION`

## 19. Audit requirements

Every propagated alert must retain:

- change event ID;
- affected object ID/type;
- relationship used for propagation;
- impact reason;
- impact level;
- detection timestamp;
- reviewer/actor;
- review outcome;
- decision linkage where applicable;
- resolution timestamp;
- historical state references.

This permits reconstruction of why a publication was reviewed after a source changed.

## 20. Core principle

> A source change is an editorial signal about possible downstream consequences. It is never, by itself, a verdict about truth.
