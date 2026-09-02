# SOURCE PERFORMANCE & GOVERNANCE RULES

## Rule families

### SG-01 — Function-specific governance
A lifecycle decision applies to the editorial function actually assessed. It must not silently become a universal judgment about the source.

### SG-02 — No single-metric retirement
No single performance, health, availability or noise metric may automatically trigger source deletion or global downgrade.

### SG-03 — Historical preservation
Retirement, deprecation or suspension must preserve historical provenance and prior source usage.

### SG-04 — Dependency review
Before material restriction, suspension, deprecation or retirement, assess dependent evidence, cases, claims, events and publications.

### SG-05 — Continuity review
Any removal of a source with unique evidentiary or geographic capability requires resilience assessment.

### SG-06 — Independent replacement test
A proposed replacement must be assessed for evidentiary equivalence and independence rather than topic similarity alone.

### SG-07 — Temporary failure is not retirement
Temporary outage, endpoint failure or delayed publication requires health/continuity assessment before lifecycle change.

### SG-08 — Correction is not automatic invalidation
A source correction requires impact analysis. It does not automatically invalidate all previous material.

### SG-09 — Provenance incident escalation
Material provenance uncertainty may justify suspension pending investigation, especially for consequential evidence.

### SG-10 — Methodology continuity
A methodology change requires assessment of comparability and may justify restricting use to post-change periods.

### SG-11 — False redundancy detection
If multiple sources share the same underlying lineage, they must not be treated as independent alternatives in a retirement decision.

### SG-12 — Governance auditability
Every material lifecycle action must have a human decision record and an identifiable reason.

### SG-13 — No political/reputational ranking
Lifecycle decisions must not be based on political alignment, popularity, controversy or institutional reputation alone.

### SG-14 — Preserve historical truth conditions
A later downgrade or retirement must not retroactively rewrite the evidentiary status that existed at the time of an earlier editorial decision.

### SG-15 — Scope explicitness
Restrictions must state what the source may still be used for and what it may no longer be used for.

### SG-16 — Open-case protection
If retirement materially affects an open investigation, the case must be reviewed before final retirement where feasible.

### SG-17 — Publication impact review
Published material depending materially on a source must be assessed when the source undergoes a material governance change.

### SG-18 — Replacement gap test
If replacement capacity is inadequate, retirement may create a coverage blind spot and must be escalated.

### SG-19 — Evidence retention
Source retirement does not authorize deletion of evidence packs, captures, documents, datasets or audit records.

### SG-20 — Human final gate
`RESTRICT`, `DOWNGRADE`, `SUSPEND`, `DEPRECATE` and `RETIRE` require human editorial authorization when materially consequential.

## Lifecycle decision matrix

| Trigger | Default action | Additional review |
|---|---|---|
| Temporary outage | MONITORING | Health + continuity |
| Sustained poor detection | RESTRICT / DOWNGRADE | Performance + function fit |
| High noise | RESTRICT | Relevance + detection utility |
| Provenance uncertainty | SUSPEND / RESTRICT | Evidence + integrity |
| Methodology change | RESTRICT / REASSESS | Comparability |
| Official deprecation | DEPRECATE | Replacement + historical preservation |
| Superior equivalent source | REVIEW | Independence + resilience |
| No remaining editorial value | RETIRE | Dependency + continuity |
| Unique critical capability | RETAIN / RESTRICT | Resilience escalation |

## Prohibited automated outcomes

The system must not automatically:

- delete a source;
- erase historical provenance;
- mark all historical evidence invalid;
- retract an article;
- infer malicious intent;
- globally change authority level;
- treat replacement as independent without assessment.

## Canonical governance flow

`PERFORMANCE / HEALTH / CHANGE EVENT → IMPACT ASSESSMENT → DEPENDENCY REVIEW → RESILIENCE REVIEW → COVERAGE REVIEW → GOVERNANCE DECISION → AUDIT LOG → MONITORING`
