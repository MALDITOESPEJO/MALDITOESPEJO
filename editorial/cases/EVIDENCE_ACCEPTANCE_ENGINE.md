# Evidence Acceptance Engine

## Purpose

Convert web-research candidates into documentary evidence only when the candidate contains enough information to be evaluated. A search result is never evidence merely because it is relevant or highly ranked.

## Chain

`WEB RESULT → CANDIDATE → DOCUMENT/SOURCE CHECK → EVIDENCE ACCEPTANCE → PROVENANCE → CONTRAST → VERIFICATION`

## Acceptance requirements

A candidate may enter accepted evidence only when the record identifies, as applicable:

1. the claim it addresses;
2. the source or publisher;
3. the document, record or direct statement;
4. the URL or stable reference;
5. when available, publication and observation dates;
6. the relevant passage, figure or data;
7. the source role;
8. provenance relationship;
9. independence group when corroboration is being assessed;
10. an explicit editorial assessment.

Missing material information means `PENDING_REVIEW`, not automatic acceptance.

## Assessment

Allowed evidence assessments:

- `UNASSESSED`
- `SUPPORTS`
- `PARTIALLY_SUPPORTS`
- `DOES_NOT_SUPPORT`
- `CONTESTS`
- `SUPERSEDED`

The engine must never infer `SUPPORTS` from search ranking, title, snippet or semantic similarity alone.

## Source hierarchy

Prefer, in order:

`PRIMARY OFFICIAL SOURCE → ORIGINAL DOCUMENT/RECORD → DIRECT STATEMENT → OFFICIAL DATA/REGISTRY → INDEPENDENT CORROBORATION → SPECIALIST CONTEXT → SECONDARY MEDIA`

This is a priority order, not a truth guarantee.

## Provenance

Multiple URLs may represent one evidentiary origin. Reproductions, quotations and derivative reports do not become independent corroboration merely because they are different pages.

## Fail-safe

If the candidate cannot be evaluated adequately:

`PENDING_REVIEW`

If evidence conflicts materially:

`CONTESTED` / `RECHECK_REQUIRED`

If evidence is sufficient for a claim, that claim may proceed to verification even when other claims in the case remain unresolved.

## Publication principle

The publication unit is the verified claim. A case may be partially verified and may generate a limited article, provided the publishable scope contains only verified claims and the human editorial gate is satisfied.

## Plain-language rule

Internal evidence assessment may be technical. The public article must remain clear and understandable.

> **La investigación puede ser compleja; la explicación no debe serlo.**

## Boundary of automation

Automation can normalize candidates, detect missing fields, identify declared provenance relationships and apply conservative structural rules. It cannot decide whether a source is truthful, whether two observations are genuinely independent, or whether an interpretation is editorially justified. Those decisions remain subject to human review.