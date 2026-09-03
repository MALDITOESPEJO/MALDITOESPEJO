# LEGACY GATE POLICY

## Purpose

Define how inherited (`legacy`) articles are handled before the Publication Gate becomes mandatory for every published article.

## States

- `LEGACY_UNREVIEWED`: inherited article not yet certified.
- `LEGACY_IN_REVIEW`: certification review in progress.
- `CERTIFIED`: inherited article has completed the same substantive publication checks required for a new article.
- `REQUIRES_CORRECTION`: review found a material issue requiring a correction/version workflow.
- `WITHDRAWN`: article has been withdrawn through the editorial workflow.

## Non-equivalence rule

`LEGACY_UNREVIEWED` and `LEGACY_IN_REVIEW` are never equivalent to `CERTIFIED` and never authorize publication.

## Activation policy

The repository may operate with the global Publication Gate in audit mode while legacy articles remain uncertified. Before enforcement mode is enabled, every published article must be either:

1. certified through the legacy certification workflow; or
2. explicitly withdrawn through the editorial withdrawal workflow.

No legacy article may become `CERTIFIED` merely because its file exists, because its frontmatter says `published`, or because a gate record is generated automatically.

## Minimum certification evidence

Certification requires:

- stable article identity;
- reconstructed publication claims;
- evidence mapped to publication claims;
- source provenance;
- material contradiction assessment;
- verification decision;
- publication scope;
- article traceability;
- editorial audit event;
- explicit human editorial approval.

## Migration principle

Migration preserves the historical article. Certification is a new editorial decision and does not rewrite the historical publication record.

## Enforcement

Once the migration inventory contains no published article in an uncertified state, CI may switch from audit mode to enforcement mode for the Publication Gate.
