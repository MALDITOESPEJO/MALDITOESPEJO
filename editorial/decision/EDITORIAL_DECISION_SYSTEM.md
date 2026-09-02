# MALDITOESPEJO — EDITORIAL DECISION SYSTEM

## 1. Purpose

The Editorial Decision System is the final governance layer between evidence intelligence and publication.

It converts a verified or unresolved editorial case into an explicit human decision while preserving the complete evidence and audit trail.

Canonical flow:

`DETECTION → INVESTIGATION → EVIDENCE ASSESSMENT → VERIFICATION → EDITORIAL DECISION → PUBLICATION / HOLD / UPDATE / CORRECT / RETRACT / DISPUTED`

## 2. Decision states

| State | Meaning | Publication effect |
|---|---|---|
| `INVESTIGATING` | Case is being researched | No publication as confirmed fact |
| `HOLD` | Evidence insufficient or conflict unresolved | Do not publish / pause publication |
| `PUBLISH` | Evidence meets editorial standard | Publish |
| `PUBLISH_WITH_QUALIFIERS` | Material uncertainty remains but publication is justified | Publish with explicit attribution/uncertainty |
| `UPDATE` | Existing publication requires material factual update | Amend and preserve update history |
| `CORRECT` | Published content contains a material factual error | Correct transparently |
| `RETRACT` | Published content cannot remain because its central factual basis failed | Retract transparently |
| `DISPUTED` | Material disagreement remains between credible evidence lines | Publish only as disputed where justified |
| `CLOSE` | Case does not warrant publication or investigation is concluded | Archive with reason |

## 3. Decision is not equivalent to truth

`PUBLISH` means the editorial team considers publication justified under the available evidence and applicable editorial standards.

It does not mean that future evidence cannot change the assessment.

Likewise, `HOLD` does not mean the underlying event is false.

## 4. Minimum decision record

Every consequential decision should record:

`decision_id`
`case_id`
`decision_timestamp`
`decision_actor`
`decision_state`
`claim_ids`
`event_ids`
`evidence_ids`
`verification_ids`
`signal_id`
`priority`
`confidence`
`contradiction_status`
`reason_code`
`editorial_rationale`
`publication_reference`
`supersedes_decision_id`

## 5. Publication gates

### PUBLISH

Normally requires:

- identifiable claim or event;
- traceable evidence;
- adequate source attribution;
- temporal and geographic consistency where relevant;
- contradictions assessed;
- material uncertainty disclosed;
- human editorial approval.

### PUBLISH_WITH_QUALIFIERS

Use when:

- the event is important enough to publish;
- evidence is credible but incomplete;
- uncertainty is material and can be accurately communicated;
- attribution is explicit.

### HOLD

Use when:

- central evidence is missing;
- major contradictions remain unresolved;
- provenance is materially uncertain;
- manipulation risk is high;
- publication would require unsupported inference.

## 6. Updates and corrections

An update should distinguish between:

`NEW_INFORMATION`
`CLARIFICATION`
`CORRECTION`
`RETRACTION`

Do not silently rewrite a material factual error.

The original state, correction time and reason should remain auditable.

## 7. Retraction threshold

Retraction is appropriate when the central proposition of a published item is no longer supportable or is materially false, misleading or manipulated.

Minor wording problems do not automatically justify retraction.

## 8. Disputed information

Where credible evidence materially conflicts, the editorial output must preserve the dispute rather than manufacture certainty.

Preferred formulation logic:

`WHAT IS ESTABLISHED + WHAT IS CLAIMED + WHO CLAIMS IT + WHAT CONTRADICTS IT + WHAT REMAINS UNKNOWN`

## 9. Priority interaction

Priority determines how quickly a case receives editorial attention.

It does not lower the evidence threshold for publication.

An A+ case may require immediate investigation while remaining `HOLD` or `INVESTIGATING`.

## 10. Human authority

Automated systems may:

- detect;
- classify;
- correlate;
- score candidate priority;
- identify contradictions;
- recommend verification paths.

Automated systems must not independently:

- declare consequential facts true;
- authorize publication;
- erase contradictory evidence;
- fabricate corroboration;
- silently alter published history.

## 11. Editorial closure

A case is not considered closed merely because it was published.

It remains open to:

- later evidence;
- corrections;
- source revisions;
- legal or institutional updates;
- contradictory evidence;
- post-publication verification.
