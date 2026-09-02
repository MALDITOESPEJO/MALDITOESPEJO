# SOURCE–EVIDENCE–CASE CROSS-REFERENCE

## Purpose

This layer connects the editorial source registry with evidence packs and editorial case files. Its purpose is to make provenance, dependence, corroboration and reuse visible across investigations.

Canonical relationship:

`SOURCE → CHANNEL → ENDPOINT → FEED → EVIDENCE → CASE → CLAIM/EVENT → VERIFICATION → DECISION`

The cross-reference is an index and governance layer. It does not replace the Evidence Graph, Evidence Pack or Case File.

## 1. Core questions

For every case, the system must be able to answer:

1. Which sources supplied the evidence?
2. Which exact evidence items came from each source?
3. Which claims/events depend on each evidence item?
4. Which sources are genuinely independent?
5. Which sources share the same underlying lineage?
6. Which sources contradict one another?
7. Which sources repeatedly appear across unrelated cases?
8. Which evidence items have been reused?
9. Which cases would be affected if a source were later corrected or withdrawn?
10. Which claims have no traceable primary or sufficiently strong evidence?

## 2. Relationship classes

| Relationship | Meaning |
|---|---|
| `SUPPLIES_EVIDENCE` | Source supplied or published the underlying evidence. |
| `DERIVED_FROM` | Evidence was derived from another evidence item. |
| `USED_IN_CASE` | Evidence item is part of a case file. |
| `SUPPORTS` | Evidence supports a claim/event. |
| `CONTRADICTS` | Evidence contradicts a claim/event or another evidence item. |
| `CORROBORATES` | Evidence independently corroborates another evidence item. |
| `SAME_LINEAGE_AS` | Items ultimately derive from the same underlying dispatch/data/document. |
| `INDEPENDENT_OF` | Evidence is assessed as evidentially independent for the relevant proposition. |
| `REUSES` | A case reuses an existing evidence item. |
| `AFFECTS` | A source/evidence revision may affect a case or decision. |
| `SUPERSEDES` | A later source/evidence version supersedes an earlier version. |

## 3. Independence rules

Independence is proposition-specific.

Ten publications reproducing the same Reuters dispatch count as one underlying evidentiary lineage for that proposition, not ten independent confirmations.

Likewise:

- multiple dashboards using the same upstream dataset are not independent;
- multiple articles citing the same official statement are not independent;
- multiple satellite products derived from the same acquisition require lineage analysis;
- multiple social posts copying the same image are not independent observations;
- independent eyewitnesses may provide independent evidence even when they describe the same event.

`INDEPENDENT_OF` must therefore never be inferred merely from different domains, URLs or publishers.

## 4. Source impact propagation

If a source, document, dataset version or evidence item is corrected, withdrawn, deprecated or materially changed, the system should identify:

`SOURCE → EVIDENCE → CASE → CLAIM/EVENT → VERIFICATION → DECISION → PUBLICATION`

Affected cases must be flagged for editorial review.

A source correction does not automatically invalidate every downstream publication. The editor must assess whether the corrected element was material to the published assertion.

## 5. Reuse policy

Evidence may be reused across cases when:

- its provenance remains intact;
- its original acquisition metadata is preserved;
- its integrity reference remains valid;
- the new case records the reuse relationship;
- the evidence remains temporally and geographically relevant;
- the editor reassesses whether its evidentiary role changes in the new context.

Reuse must never create artificial corroboration.

## 6. Minimum cross-reference fields

Every relationship should be capable of resolving to:

- source ID;
- channel ID where applicable;
- endpoint/feed where applicable;
- evidence ID;
- evidence-pack ID;
- case ID;
- claim/event ID;
- relationship type;
- independence assessment;
- lineage reference;
- created timestamp;
- last reviewed timestamp;
- reviewer;
- notes/reason code.

## 7. Editorial controls

The cross-reference must support detection of:

- single-source dependency;
- hidden common-source dependency;
- unsupported claims;
- contradictory evidence;
- stale evidence reused in a new context;
- superseded official documents still being cited;
- evidence reused after withdrawal;
- excessive dependence on one news agency;
- apparent corroboration caused by syndication;
- cases affected by later source revisions.

## 8. Human editorial gate

No relationship in this registry automatically establishes truth, importance or publishability.

The final chain remains:

`CROSS-REFERENCE → EVIDENCE ASSESSMENT → VERIFICATION → EDITORIAL DECISION → HUMAN APPROVAL`
