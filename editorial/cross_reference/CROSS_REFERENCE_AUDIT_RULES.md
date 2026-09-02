# CROSS-REFERENCE AUDIT RULES

## Objective

Detect structural weaknesses that may be invisible when sources, evidence and cases are examined separately.

## Automatic audit candidates

### CR-01 — Single-source dependency
A material claim depends on only one source lineage.

Action: flag for editorial review. This is not automatically a publication block when the source is the appropriate primary authority.

### CR-02 — False corroboration
Two or more evidence items appear independent but share the same upstream lineage.

Action: collapse their corroboration weight to the underlying lineage and preserve the relationship.

### CR-03 — Unsupported claim
A claim has no linked evidence with adequate support.

Action: HOLD unless the editorial decision explicitly justifies publication as a clearly attributed claim rather than established fact.

### CR-04 — Contradictory evidence
Material evidence both supports and contradicts the same proposition.

Action: require contradiction assessment and appropriate uncertainty language.

### CR-05 — Stale evidence
Evidence is reused outside its relevant temporal window or after a material revision.

Action: revalidate before publication or update.

### CR-06 — Superseded source
A cited official document/data version has been superseded.

Action: identify affected cases and review whether the superseded version remains historically relevant.

### CR-07 — Withdrawn evidence
An evidence item or source has been withdrawn, corrected or deprecated.

Action: propagate an impact alert to dependent cases and decisions.

### CR-08 — High concentration
A large number of materially important cases depend on one source lineage.

Action: monitor concentration risk; seek alternative primary or independent evidence where appropriate.

### CR-09 — Missing provenance
An evidence item exists but cannot be traced reliably to its originating source or acquisition context.

Action: downgrade evidentiary confidence and consider HOLD for consequential claims.

### CR-10 — Temporal mismatch
The evidence post-dates the claimed event or publication chronology in a way that could create retroactive knowledge.

Action: reconstruct the chronology before publication.

### CR-11 — Geographic mismatch
Evidence is associated with a different location than the claim/event without adequate explanation.

Action: require geographic verification.

### CR-12 — Derived evidence mistaken for primary evidence
An extraction, screenshot, transcription, translation, AI summary or other derivative is treated as if it were the original source.

Action: preserve and link the parent item; cite the original whenever possible.

## Audit principle

The system detects risk; it does not determine truth automatically.

Every material alert ultimately requires human editorial assessment.
