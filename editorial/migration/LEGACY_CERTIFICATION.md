# Legacy Article Certification

## Purpose

Legacy certification brings articles that predate the editorial verification system into the same publication-control model as new articles.

## Principle

A legacy article is **not** certified merely because it is already published. Historical publication is preserved, but current certification requires an explicit audit.

## Certification states

- `LEGACY_UNREVIEWED`: article exists but has not been audited.
- `LEGACY_REVIEW_REQUIRED`: audit found missing or unresolved material evidence.
- `LEGACY_CERTIFIED`: all required checks are satisfied and an editor has approved certification.
- `LEGACY_BLOCKED`: a critical control fails or the article must not remain publishable in its current form.

## Minimum certification record

Each article must have:

1. stable `article_id`;
2. current version;
3. inventory of material claims;
4. evidence mapping for those claims;
5. provenance information for evidence;
6. contradiction status;
7. temporal status where relevant;
8. article-to-evidence traceability;
9. audit events;
10. human certification decision.

## Migration rule

Certification does not rewrite the historical article. If an audit identifies a material problem, the correct path is:

`LEGACY → REVIEW_REQUIRED → CORRECTION / UPDATE / WITHDRAWAL → NEW VERSION → CERTIFICATION`

The original publication remains part of the historical record.

## CI activation

The Publication Gate must become mandatory for the repository only after every legacy article has an explicit migration state. `LEGACY_UNREVIEWED` and `LEGACY_REVIEW_REQUIRED` must not be silently treated as certified.

## Audit requirement

Every certification or blocking decision must generate an audit event. Automated checks may recommend a state; only an authorised editorial decision can certify publication.
