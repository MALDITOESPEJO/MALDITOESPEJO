# MALDITOESPEJO — EVIDENCE → SIGNAL → PRIORITY BRIDGE

## 1. Purpose

This layer connects the Evidence Graph with the Signal Engine and Priority Engine without allowing automated scoring to become an automatic publication decision.

Canonical flow:

`EVIDENCE GRAPH → EVIDENCE ASSESSMENT → SIGNAL CANDIDATE → PRIORITY → HUMAN REVIEW → EDITORIAL DECISION`

## 2. Assessment dimensions

Each evidence package should be assessed across independent dimensions:

| Dimension | Values | Meaning |
|---|---|---|
| Authority | A+ / A / B / C | Institutional or specialist authority for the fact class |
| Directness | DIRECT / INDIRECT | Whether the evidence directly establishes the proposition |
| Independence | HIGH / MEDIUM / LOW / NONE | Independence from other evidence lines |
| Temporal fit | EXACT / COMPATIBLE / UNCERTAIN / INCONSISTENT | Fit with the relevant event time |
| Geographic fit | EXACT / COMPATIBLE / UNCERTAIN / INCONSISTENT | Fit with the relevant location |
| Specificity | HIGH / MEDIUM / LOW | How specifically the evidence addresses the claim |
| Consistency | CONSISTENT / MIXED / CONTRADICTORY | Relationship with other evidence |
| Integrity risk | LOW / MEDIUM / HIGH / CRITICAL | Risk of manipulation, alteration or provenance failure |
| Completeness | HIGH / MEDIUM / LOW | Whether material evidence is still missing |

## 3. Do not use simplistic addition

Evidence quality must **not** be calculated as a simple sum of source scores.

For example:

`10 × LOW-INDEPENDENCE SOURCES ≠ 10 × INDEPENDENT SOURCES`

Authority, independence, directness and integrity are partially orthogonal dimensions and must remain visible in the assessment.

## 4. Evidence states

Recommended state transition:

`UNASSESSED → ASSESSED → SUPPORTED / MIXED / CONTRADICTED → VERIFIED / PARTIALLY_VERIFIED / UNVERIFIED / DISPUTED`

`MANIPULATED`, `FALSE`, `MISLEADING` and `OUT_OF_CONTEXT` require an evidentiary basis and human review where consequential.

## 5. Signal generation gates

### A+ signal candidate

May be proposed when one or more of the following apply:

- authoritative primary evidence establishes a consequential event;
- active security exploitation is supported by the defined cyber hierarchy;
- an official regulatory, legal or electoral action materially changes the situation;
- severe humanitarian, conflict or public-safety consequences have strong evidence;
- a high-impact event is independently corroborated across materially independent evidence lines.

A+ is an **alert priority**, not an automatic publication status.

### A signal candidate

Use when evidence is strong and the event has material editorial consequence, but immediacy or certainty does not meet A+.

### B signal candidate

Use for ordinary developments with adequate evidence and moderate editorial relevance.

### C signal candidate

Use for contextual, low-impact or exploratory information.

## 6. Hard constraints

The following must block automatic escalation to confirmed publication:

- viral claim with no adequate evidence;
- single unattributed social-media post for a consequential factual claim;
- duplicated reports sharing the same underlying dispatch counted as independent corroboration;
- unresolved major contradiction;
- evidence with critical integrity risk;
- temporal or geographic mismatch that materially affects the claim.

## 7. Priority model

Priority should be treated as a structured editorial function:

`PRIORITY = f(IMPACT, URGENCY, NOVELTY, PUBLIC_INTEREST, LEGAL_CONSEQUENCE, EVIDENCE_QUALITY, VERIFICATION, MISINFORMATION_RISK, UNCERTAINTY)`

Priority is therefore not equivalent to confidence.

A highly credible minor event may be B.
A highly consequential but initially uncertain event may be A+ **for immediate investigation**, while remaining unverified.

## 8. Confidence and priority are separate

Examples:

- `confidence = HIGH`, `priority = B`
- `confidence = LOW`, `priority = A+`
- `confidence = MEDIUM`, `priority = A`

This distinction prevents the system from suppressing important breaking developments simply because verification is still underway.

## 9. Required signal payload

Every generated signal candidate should preserve:

`signal_id`
`event_id`
`claim_id`
`observation_ids`
`evidence_ids`
`source_ids`
`independence_groups`
`signal_type`
`detected_at`
`relevant_time`
`jurisdiction`
`topic`
`evidence_status`
`confidence`
`priority`
`contradiction_status`
`integrity_risk`
`human_review_required`
`reason_code`

## 10. Human gate

No algorithmic priority can itself authorize publication.

Final sequence:

`SIGNAL CANDIDATE → PRIORITY → HUMAN EDITOR → VERIFICATION DECISION → PUBLICATION / HOLD / DISPUTE / UPDATE`

The editor must be able to inspect the evidence graph before approving a consequential claim.
