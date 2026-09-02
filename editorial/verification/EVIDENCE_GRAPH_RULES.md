# MALDITOESPEJO — EVIDENCE GRAPH RULES

## 1. Purpose

The Evidence Graph records why an editorial assertion is supported, contradicted, unresolved or merely reported.

It must allow an editor to move backwards from a published statement to the underlying evidence and forwards from a source observation to every signal and editorial decision derived from it.

## 2. Canonical chain

`SOURCE → CHANNEL → ENDPOINT → FEED → OBSERVATION/EVENT/CLAIM → EVIDENCE → VERIFICATION → SIGNAL → PRIORITY → HUMAN EDITOR`

The graph may contain branches and cycles of review, but the provenance of every important assertion must remain reconstructable.

## 3. Evidence relations

Allowed principal relations:

- `SUPPORTS`
- `CONTRADICTS`
- `DESCRIBES`
- `DERIVED_FROM`
- `CORROBORATES`
- `UPDATES`
- `REVISES`
- `SUPERSEDES`
- `ATTRIBUTED_TO`
- `SAME_LINEAGE_AS`

## 4. Independence

Corroboration must be assessed by evidentiary lineage, not by counting URLs.

Examples:

- 12 media articles reproducing one agency dispatch = one underlying information lineage.
- An official document + independent satellite observation + independently gathered local imagery = potentially three distinct evidence lines.
- Two datasets produced by the same institution are not independent merely because they have different endpoints.

## 5. Support levels

Recommended support classification:

`DIRECT`
`STRONG`
`MODERATE`
`WEAK`
`INDIRECT`
`NONE`
`CONTRADICTORY`

Support level is not the same as truth status.

## 6. Truth / verification status

Recommended statuses:

`UNVERIFIED`
`PENDING`
`PARTIALLY_VERIFIED`
`CORROBORATED`
`VERIFIED`
`CONTRADICTED`
`DISPUTED`
`FALSE`
`MISLEADING`
`MANIPULATED`
`OUT_OF_CONTEXT`
`UNKNOWN`

A claim may be strongly sourced but still disputed. A claim may also be false despite having many secondary reports.

## 7. Contradictions

Contradictory evidence must remain in the graph. It must not be deleted merely because a preferred source has higher authority.

The editor should record:

- what conflicts;
- which evidence is stronger and why;
- whether the conflict is temporal, geographic, definitional or substantive;
- what remains unknown.

## 8. Temporal integrity

Evidence must be evaluated according to what it established at the relevant time. Later corrections, satellite imagery or statements cannot silently rewrite the earlier evidence state.

## 9. Human verification gate

Automated graph relationships can identify support or contradiction candidates. They cannot by themselves assign final publication status to consequential claims.

## 10. Auditability

Every final editorial assertion should be capable of answering:

`WHAT was asserted?`
`WHO originated it?`
`WHEN was it available?`
`WHAT evidence supports it?`
`WHAT evidence contradicts it?`
`HOW independent are the evidence lines?`
`WHO verified it?`
`WHEN was it verified?`
`WHAT changed afterwards?`

## 11. Publication rule

**The absence of contradictory evidence is not itself positive evidence.**

Likewise, a high corroboration count cannot compensate for a shared underlying source lineage.
