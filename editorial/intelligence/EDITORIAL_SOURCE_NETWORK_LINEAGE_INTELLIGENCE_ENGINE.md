# EDITORIAL SOURCE NETWORK & LINEAGE INTELLIGENCE ENGINE

## 1. Purpose

This engine models the network of relationships among sources, channels, endpoints, feeds, documents, datasets, observations, events, claims and evidence in order to identify hidden common lineage, dependency concentration, false corroboration and evidentiary bottlenecks.

It does not rank sources by reputation and does not infer truth from network structure.

## 2. Canonical network

`SOURCE → CHANNEL → ENDPOINT → FEED → OBSERVATION/EVENT/CLAIM → EVIDENCE → VERIFICATION → SIGNAL → DECISION → PUBLICATION`

Cross-lineage relationships may include:

`SAME_LINEAGE_AS`, `DERIVED_FROM`, `CORROBORATES`, `CONTRADICTS`, `INDEPENDENT_OF`, `REUSES`, `UPDATES`, `REVISES`, `SUPERSEDES`.

## 3. Lineage

A lineage is the evidentiary ancestry of an information object. Two apparently different publishers are not independent when they materially depend on the same underlying dispatch, document, dataset, witness, image, video, API response or other evidence.

Lineage identifiers must be stable and version-aware. A source may participate in multiple lineages depending on the fact being investigated.

## 4. Hidden-lineage detection

The engine should investigate common ancestry through:

- identical or substantially identical underlying documents;
- common wire/agency dispatches;
- shared datasets or API responses;
- common witness or interview;
- reused photographs, video or satellite scenes;
- common official statement;
- common parent feed;
- copied quotations where the original evidence is the same;
- syndicated material;
- shared methodological transformations.

A common domain, publisher, URL or wording alone is insufficient to establish or reject independence.

## 5. Evidentiary independence

Independence is proposition-specific.

A source may be independent for one claim and dependent for another. The system therefore must store the precise proposition, evidence object and relationship supporting an independence assessment.

`INDEPENDENT_OF` means that no material common underlying evidence has been identified for the proposition assessed. It is not a guarantee that undiscovered common ancestry does not exist.

## 6. False corroboration

False corroboration occurs when multiple apparently separate reports reinforce an assertion but materially descend from the same underlying evidence.

Examples:

- ten outlets reproduce one agency dispatch;
- several accounts repost the same original video;
- multiple articles cite one unpublished official source;
- several analyses calculate from the same dataset without adding independent evidence.

The network must collapse these into their evidentiary lineage for independence analysis while preserving every publication/report as a distinct object.

## 7. Network measures

The engine may calculate, without producing a universal source-quality score:

- lineage count;
- independent-lineage count;
- common-parent concentration;
- evidence reuse;
- claim dependency;
- case dependency;
- source centrality for a specific fact class;
- single-lineage exposure;
- corroboration diversity;
- contradiction diversity;
- temporal propagation delay;
- geographic concentration;
- institutional concentration.

These are diagnostics, not truth scores or publication authorizations.

## 8. Dependency concentration

A material assertion is vulnerable when its supporting evidence is concentrated in one underlying lineage despite numerous visible publications.

Diagnostic:

`LINEAGE_CONCENTRATION = MATERIAL_ASSERTIONS_DEPENDENT_ON_LINEAGE / TOTAL_MATERIAL_ASSERTIONS`

Thresholds are configurable by editorial function and risk class.

High concentration triggers review; it does not automatically invalidate the assertion.

## 9. Network anomalies

Potential anomalies include:

- apparent corroboration with common ancestry;
- unexplained evidence reuse;
- sudden propagation from one parent source;
- contradictory branches sharing the same evidence;
- excessive dependence on one provider;
- evidence appearing before its alleged source publication;
- incompatible timestamps;
- geographic inconsistency;
- repeated use of a withdrawn or superseded evidence object;
- orphan claims with no traceable evidence lineage.

## 10. Temporal lineage

The network must preserve the order in which information became available.

A later report cannot be treated as independent confirmation of an earlier claim merely because it was published separately. If both rely on information released later, the chronology must remain explicit.

Mandatory timestamps where available:

`detected_at`, `published_at`, `updated_at`, `effective_at`, `acquired_at`, `verified_at`.

## 11. Contradictory networks

Contradictory branches must be preserved rather than averaged away.

The engine should identify:

`CLAIM → SUPPORTING LINEAGE`

and

`CLAIM → CONTRADICTING LINEAGE`.

A contradiction involving two genuinely independent high-quality lineages receives greater editorial attention than disagreement among reports sharing one lineage.

## 12. Source network roles

A source may have different network roles:

- `PRIMARY_ORIGIN`
- `PRIMARY_OBSERVER`
- `PRIMARY_DATA_PROVIDER`
- `SPECIALIST_INTERPRETER`
- `SECONDARY_CORROBORATOR`
- `DISCOVERY_NODE`
- `AMPLIFIER`
- `AGGREGATOR`

An amplifier or aggregator can have high detection value without adding independent evidence.

## 13. Propagation analysis

For material events, the system may reconstruct:

`ORIGIN → FIRST_DETECTION → FIRST_INDEPENDENT_CORROBORATION → VERIFICATION → PUBLICATION`

This allows measurement of information propagation without confusing speed with evidentiary quality.

## 14. Graph confidence

Network confidence is not truth confidence.

The graph can establish that several objects share lineage, but it cannot establish that the underlying assertion is true merely because the graph is dense.

Likewise, a sparse network may still contain decisive primary evidence.

## 15. Review triggers

Human review is required when:

- a consequential claim has only one material lineage;
- apparent corroboration collapses to one lineage;
- a major claim depends on reused evidence;
- independent lineages materially contradict one another;
- a central lineage is withdrawn, revised or compromised;
- unexplained lineage anomalies appear;
- network structure materially changes the verification assessment.

## 16. Prohibited automation

The engine must not automatically:

- declare a claim true because many nodes support it;
- declare a claim false because the network is small;
- count duplicated reports as independent corroboration;
- remove sources because of network centrality;
- infer political intent from network position;
- infer malicious coordination solely from common lineage;
- automatically publish, correct or retract content.

## 17. Integration

The network layer integrates with:

`SOURCE HEALTH → SOURCE CHANGE IMPACT → RESILIENCE → COVERAGE/GAPS → ACQUISITION → PERFORMANCE → GOVERNANCE → NETWORK/LINEAGE INTELLIGENCE`

Operationally:

`NETWORK ANOMALY → EVIDENCE IMPACT → CASE REVIEW → VERIFICATION REVIEW → EDITORIAL DECISION`

## 18. Core principle

> **The number of visible sources is not the number of independent evidentiary lineages.**

MALDITOESPEJO must optimize for traceability, independence, primary evidence and contradiction visibility rather than apparent source volume.
