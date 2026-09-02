# MALDITOESPEJO — EDITORIAL ENTITY RULES

## Purpose

This document defines how the system distinguishes observations, events, claims, narratives and signals.

## Fundamental distinction

`OBSERVATION` = what a monitored resource directly records.

`EVENT` = an occurrence represented in the real world or institutional record.

`CLAIM` = a proposition asserted by a person, institution, publication, dataset interpretation or user-generated source.

`NARRATIVE` = a structured relationship among multiple claims.

`SIGNAL` = an editorial detection generated from observations, events, claims or changes in monitored resources.

## Non-equivalence rule

The following are never automatically equivalent:

- publication ≠ event;
- claim ≠ fact;
- dataset ≠ incident record;
- alert ≠ occurrence;
- forecast ≠ observation;
- media report ≠ primary evidence;
- virality ≠ importance of truth;
- repetition ≠ corroboration.

## Claim attribution

Every externally asserted proposition must retain its origin. The system should answer:

1. Who said it?
2. Where was it published?
3. When was it published?
4. What exactly was claimed?
5. What evidence was supplied?
6. What independent evidence exists?
7. Has the claim been contradicted?
8. What is its current verification status?

## Event handling

An event may have multiple descriptions. The system must not merge them merely because they refer to the same approximate time or place. Event identity requires sufficient matching attributes and editorial review where ambiguity exists.

## Observation handling

Observations preserve the measurement or recorded state without adding causal interpretation. For example, an aircraft position is an observation; the reason for the aircraft movement is a separate claim requiring evidence.

## Signal handling

A signal is an internal editorial object. It indicates that something deserves attention. It is not itself a publishable statement.

## Narrative handling

Narratives connect claims through shared actors, wording, themes, timing, distribution or evidence. A narrative classification requires stronger evidence than merely observing similar claims.

## Human gate

The final transformation is always:

`SIGNAL → HUMAN REVIEW → EDITORIAL DECISION`

No ontology entity automatically authorizes publication.
