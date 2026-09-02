# SOURCE CHANGE & IMPACT RULES

## Scope

These rules govern how source changes propagate into editorial review. They complement `SOURCE_HEALTH_MODEL.md` and `SOURCE_CHANGE_IMPACT_ENGINE.md`.

## Rules

### SC-01 — Correction
Material corrections propagate to directly dependent evidence, claims, cases, verifications, decisions, and publications.

### SC-02 — Retraction
Retraction of central evidence creates a CRITICAL alert and mandatory human re-review of downstream assertions.

### SC-03 — Dataset revision
Map revisions to dataset version, series, observation period, and derived evidence. Never overwrite the historical state used at publication time.

### SC-04 — Methodology change
Flag comparability risk. Pre-change and post-change observations require explicit methodological assessment before being treated as equivalent.

### SC-05 — Endpoint change
Separate technical continuity from substantive change. A migrated endpoint is not material merely because its URL or schema changed.

### SC-06 — Deprecation
Deprecation creates an operational alert. Historical evidence remains valid unless substantive evidence of a problem exists.

### SC-07 — Provenance challenge
Material provenance uncertainty requires re-review and may prevent continued use of the affected evidence as strong support until resolved.

### SC-08 — Integrity compromise
Potential corruption or unauthorized modification requires containment and immediate assessment. Integrity evidence does not itself establish authenticity or falsity.

### SC-09 — Access loss
Preserve available evidence and provenance. Lack of current access does not retroactively invalidate previously acquired evidence.

### SC-10 — Ownership/publisher change
Assess continuity, authority, governance, methodology, and provenance. Do not automatically downgrade or upgrade authority.

### SC-11 — URL/domain migration
Confirm continuity of publisher, resource identity, content, version history, and provenance. If continuity cannot be established, escalate.

### SC-12 — Conflicting versions
Preserve conflicting versions and identify their timestamps and authority. Do not silently choose the newest version as truth.

## Propagation rules

1. Propagate only through recorded relationships.
2. Prefer evidence-specific scope over source-wide invalidation.
3. Trace common lineage before counting independent corroboration.
4. Escalate when an affected source is the only strong evidentiary lineage.
5. Escalate when a material published assertion depends on the affected evidence.
6. Recalculate corroboration and contradiction structure after material changes.
7. Preserve historical verification and decision states.
8. Record the reason for every impact alert.
9. Do not delete affected evidence.
10. Do not automatically correct or retract publications.

## Materiality rules

`INFO` when there is no plausible substantive editorial effect.

`WATCH` when downstream relevance is possible but not demonstrated.

`MATERIAL` when evidence, verification, claim/event support, or publication content may materially change.

`CRITICAL` when central evidence/provenance/integrity is compromised or a consequential published assertion may no longer satisfy its evidentiary standard.

## Mandatory review

Human review is mandatory for:

- central evidence retraction;
- material correction;
- material dataset revision;
- methodology change affecting interpretation;
- provenance compromise;
- integrity compromise;
- conflicting authoritative versions;
- loss of the only strong independent lineage;
- material impact on legal, electoral, security, humanitarian, financial, scientific, or public-safety reporting.

## Prohibited automation

The engine must not automatically:

- retract;
- correct;
- declare false;
- erase evidence;
- erase historical versions;
- infer malicious intent;
- infer that the underlying event did not occur;
- replace a human editorial decision.

## Required audit trail

Each alert must retain the triggering change event, affected object, relationship/path used, timestamps, previous/new states, impact rationale, reviewer, outcome, and decision linkage where applicable.

## Governing principle

`SOURCE CHANGE → IMPACT ALERT → HUMAN REVIEW → REVERIFICATION → EDITORIAL DECISION`

Never:

`SOURCE CHANGE → AUTOMATIC VERDICT`
