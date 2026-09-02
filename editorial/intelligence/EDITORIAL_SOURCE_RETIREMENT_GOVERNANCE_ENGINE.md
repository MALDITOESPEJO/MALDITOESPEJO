# EDITORIAL SOURCE RETIREMENT & GOVERNANCE ENGINE

## 1. Purpose

This engine governs the lifecycle of sources after acquisition and operational use.

It determines when a source should be:

- retained;
- expanded;
- restricted;
- downgraded for a specific function;
- suspended from production;
- deprecated;
- retired.

Its purpose is editorial governance, not reputational ranking.

## 2. Canonical lifecycle

`DISCOVERED → EVALUATED → APPROVED → INTEGRATED → MONITORED → REVIEWED → RETAINED / RESTRICTED / DOWNGRADED / SUSPENDED / DEPRECATED / RETIRED`

A retired source remains part of historical provenance.

## 3. Governance principles

1. Governance is function-specific.
2. Authority, performance, health and value remain separate dimensions.
3. No single metric automatically removes a source.
4. Historical use must never be erased.
5. Retirement must not rewrite previous evidence chains.
6. A source may be unsuitable for one function while valuable for another.
7. Alternatives must be assessed before removing a strategically important source.
8. Human editorial authority is mandatory for material lifecycle decisions.

## 4. Governance states

### `ACTIVE`
Approved for its current production functions.

### `MONITORING`
Active but subject to enhanced observation.

### `RESTRICTED`
Use limited to specified topics, jurisdictions, evidence classes or editorial functions.

### `DOWNGRADED`
Moved to a lower evidentiary or operational role while remaining available.

### `SUSPENDED`
Temporarily unavailable for production use pending review.

### `DEPRECATED`
Superseded or no longer recommended for new use, while historical records remain valid references subject to their original evidentiary assessment.

### `RETIRED`
No longer maintained for active editorial use.

## 5. Retention criteria

A source should normally be retained when it provides one or more of:

- unique primary evidence;
- independent corroboration;
- important geographic coverage;
- important institutional coverage;
- materially superior detection speed;
- specialist expertise;
- resilience against single-lineage dependency;
- historical continuity;
- essential methodological continuity.

## 6. Restriction criteria

Restriction may be appropriate when:

- the source is strong only for a narrow fact class;
- methodology is unsuitable outside a defined scope;
- timeliness is insufficient for breaking detection but adequate for verification;
- provenance is adequate only for contextual use;
- independence is limited by shared upstream evidence;
- regional or institutional coverage is incomplete.

Restriction should explicitly identify the permitted and prohibited functions.

## 7. Downgrade criteria

A downgrade may occur after evidence of:

- persistent performance deterioration;
- increased noise;
- material provenance limitations;
- methodology changes reducing comparability;
- loss of direct access to primary material;
- discovery of common lineage with an apparently independent source;
- repeated failure to meet the requirements of the assigned function.

Downgrade is not a declaration that previous material was false.

## 8. Suspension criteria

Production use may be suspended where there is:

- unresolved provenance compromise;
- suspected integrity compromise;
- materially conflicting versions;
- unexplained data corruption;
- critical endpoint failure where no continuity assurance exists;
- significant methodological uncertainty affecting consequential claims;
- serious uncertainty about whether the current resource is the same underlying source.

Suspension must identify affected cases and evidence where practical.

## 9. Deprecation criteria

Deprecation may be appropriate where:

- the publisher has officially replaced the resource;
- an endpoint or dataset has reached end-of-life;
- a superior successor exists;
- the source no longer performs its intended editorial function;
- maintenance is no longer justified.

Deprecation must preserve the historical locator, version and provenance chain.

## 10. Retirement criteria

Retirement should require documented assessment that:

1. the source no longer provides necessary editorial value;
2. there is no unresolved historical dependency requiring active maintenance;
3. any critical unique capability has an acceptable continuity plan or is explicitly accepted as unavailable;
4. active cases have been assessed for impact;
5. historical references remain resolvable where feasible;
6. the retirement decision has human approval.

## 11. No automatic deletion

The system must never automatically delete a source because of:

- low activity;
- low popularity;
- high noise alone;
- one failed endpoint;
- one correction;
- one inaccurate item;
- temporary unavailability;
- political disagreement with the publisher;
- replacement by a secondary source.

## 12. Historical preservation

Retirement must preserve:

- source identity;
- source versions;
- channels;
- endpoints;
- feeds;
- evidence references;
- cases;
- claims/events;
- verification records;
- decisions;
- publications;
- lifecycle history.

Historical status must remain reconstructible.

## 13. Dependency check before retirement

Before retirement, the system must query:

`SOURCE → LINEAGE → EVIDENCE → CASE → CLAIM/EVENT → DECISION → PUBLICATION`

The review must identify:

- open investigations;
- published material depending on the source;
- unique evidence;
- unresolved contradictions;
- cases with no independent alternative;
- source-specific coverage gaps;
- resilience implications.

## 14. Continuity assessment

The retirement review must classify the resulting continuity state as:

- `RESILIENT`
- `ADEQUATE`
- `FRAGILE`
- `CRITICAL`
- `UNKNOWN`

If retirement creates a critical single-lineage dependency, retirement should normally be deferred or explicitly escalated for human decision.

## 15. Replacement is not substitution

A replacement source must be evaluated independently.

The system must not assume that a source is equivalent merely because it covers the same topic.

Equivalence should consider:

- fact class;
- geographic scope;
- temporal scope;
- methodology;
- authority;
- directness;
- provenance;
- independence;
- update frequency.

## 16. Governance review cadence

Review frequency should reflect risk:

- critical sources: frequent review;
- high-dependency sources: regular review;
- ordinary sources: periodic review;
- low-use/context sources: event-triggered review.

The exact cadence is configurable by editorial governance.

## 17. Mandatory review triggers

Lifecycle review is required after:

- material source correction or retraction;
- ownership/publisher change;
- methodology change;
- major endpoint migration;
- loss of unique coverage;
- integrity incident;
- sustained performance deterioration;
- sustained availability failure;
- discovery of false redundancy;
- major change in editorial requirements.

## 18. Decision outcomes

A governance review may result in:

- `RETAIN`
- `EXPAND`
- `RESTRICT`
- `DOWNGRADE`
- `SUSPEND`
- `DEPRECATE`
- `RETIRE`
- `REASSESS_LATER`

## 19. Human decision record

Every material lifecycle action should record:

- source;
- affected function;
- current state;
- proposed state;
- evidence reviewed;
- performance findings;
- health findings;
- dependency findings;
- resilience findings;
- coverage findings;
- alternatives considered;
- impact on active cases;
- editorial rationale;
- responsible editor;
- decision timestamp;
- review date.

## 20. Relationship with other engines

`SOURCE ACQUISITION → PERFORMANCE/VALUE → HEALTH → CHANGE/IMPACT → RESILIENCE → COVERAGE → GOVERNANCE`

Governance is therefore the lifecycle control layer, not an isolated source-ranking mechanism.

## 21. Core principle

> Retire a source from active use when the evidence justifies retirement, but never retire its history from the evidentiary record.
