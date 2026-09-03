# EVENT CORRELATION ENGINE

## Purpose

Detect emerging stories across heterogeneous sources even when no individual source has high audience volume.

## Core principle

**Una historia no nace cuando se hace viral. Nace cuando distintas señales independientes empiezan a describir el mismo acontecimiento.**

## Correlation dimensions

1. Semantic similarity — shared entities, actions, locations and distinctive facts.
2. Temporal proximity — observations occurring within an event window.
3. Geographic proximity — same place or compatible geography.
4. Entity overlap — people, institutions, companies, places and objects.
5. Source independence — distinct institutions/domains, not merely multiple URLs.
6. Evidence type — official data, document, statement, observation, OSINT or media report.
7. Direction of change — first appearance, acceleration, persistence and expansion.

## Emerging-story rule

A low-volume event can receive an **EMERGING** signal when at least two independent source families converge, even if search/social volume is low.

One source alone may create a lead, never artificial corroboration.

## Correlation classes

- `SAME_EVENT`: strong semantic + temporal/geographic match.
- `RELATED_EVENT`: shared entities/topic but materially different event.
- `PARALLEL_SIGNAL`: independent signals pointing to a developing issue without enough evidence to merge.
- `DUPLICATE`: substantially identical publication/replication.
- `UNRELATED`: insufficient relationship.

## Independence

Source count is not independence. Syndicated copies, mirrors and outlets reproducing one wire story must not inflate corroboration.

## Output

Every event should expose:

- event_id
- candidate_ids
- source_ids
- independent_source_count
- source_families
- first_seen / last_seen
- correlation_score
- emerging_score
- trend_score
- confidence
- unresolved_conflicts
- evidence_types
- investigation_priority

## Editorial safeguard

Correlation discovers an editorial opportunity. It does not establish truth. Publication still requires claim-level evidence, verification and human approval.
