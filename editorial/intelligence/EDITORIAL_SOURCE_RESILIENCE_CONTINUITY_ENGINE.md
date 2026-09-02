# EDITORIAL SOURCE RESILIENCE & CONTINUITY ENGINE

## 1. Purpose

The Editorial Source Resilience & Continuity Engine (ESRCE) measures whether MALDITOESPEJO can continue investigating, verifying, and publishing when a source, feed, endpoint, dataset, evidence lineage, or provider becomes unavailable, degraded, revised, compromised, or otherwise unusable.

It complements:

- `SOURCE_DEPENDENCY_MATRIX.md`
- `SOURCE_HEALTH_MODEL.md`
- `SOURCE_CHANGE_IMPACT_ENGINE.md`
- `EVIDENCE_GRAPH_SCHEMA.csv`

The engine is about **continuity of editorial capability**, not about ranking sources by prestige.

## 2. Core principle

> A resilient newsroom does not depend on one source, one endpoint, one dataset, or one evidentiary lineage when the material assertion can reasonably be supported through independent alternatives.

Resilience does not mean collecting many sources. Ten sources sharing one dispatch do not provide ten independent fallbacks.

## 3. Canonical model

`EDITORIAL FUNCTION → REQUIRED EVIDENCE → PRIMARY LINEAGE → ALTERNATIVE LINEAGES → BACKUP CHANNELS → CONTINUITY STATE → HUMAN EDITOR`

## 4. Resilience dimensions

### 4.1 Source redundancy
Can the same evidentiary function be performed by another appropriate source?

### 4.2 Lineage diversity
Are alternatives genuinely independent, or merely downstream copies?

### 4.3 Channel redundancy
Can a source be reached through another verified channel or endpoint?

### 4.4 Temporal continuity
Can the newsroom maintain coverage during delays, missed releases, revisions, or outages?

### 4.5 Geographic continuity
Can the evidentiary function continue if a regional/local source becomes inaccessible?

### 4.6 Methodological continuity
Can observations remain interpretable if a dataset or methodology changes?

### 4.7 Provenance continuity
Can the newsroom preserve and reconstruct the origin and handling of evidence?

### 4.8 Operational continuity
Can monitoring continue if an API, feed, website, archive, or authentication system fails?

## 5. Resilience states

- `RESILIENT` — suitable independent alternatives exist and are operational.
- `ADEQUATE` — continuity is possible but alternatives have limitations.
- `FRAGILE` — significant dependence exists and fallback capacity is weak.
- `CRITICAL` — loss of the source/function may prevent reliable verification.
- `UNKNOWN` — insufficient information to assess continuity.

`UNKNOWN` must never be interpreted as `RESILIENT`.

## 6. Critical dependency

A dependency becomes critical when loss of a resource can materially impair verification of a consequential assertion and no suitable independent alternative is available.

Examples:

- a unique official election result;
- a court judgment available from only one authoritative repository;
- a unique satellite scene needed for geolocation;
- a local primary witness/source for an otherwise poorly documented event;
- a specialised dataset with no methodological equivalent.

A unique source is not necessarily a weak source. Uniqueness is a continuity risk, not an authority judgment.

## 7. Fallback classes

Fallbacks should be classified by evidentiary function:

### PRIMARY_EQUIVALENT
Another authoritative primary source capable of independently supporting the same proposition.

### PRIMARY_COMPLEMENTARY
A different primary source that can test part of the proposition.

### SPECIALIST_INDEPENDENT
Qualified specialist evidence that independently addresses the relevant fact.

### SECONDARY_CORROBORATION
Reputable secondary reporting useful for corroboration/context but insufficient to replace missing primary evidence where primary evidence is required.

### DISCOVERY_ONLY
Useful for finding leads, not for final verification.

## 8. Independence requirement

Fallback diversity must be assessed by underlying evidence lineage.

Different:

- domains;
- URLs;
- publishers;
- article titles;
- languages;
- syndication partners

do not by themselves establish independence.

The relevant question is:

> Could the fallback have independently established the proposition without relying on the unavailable lineage?

## 9. Continuity classes by failure

### Source unavailable
Use alternative source lineages where available.

### Channel unavailable
Switch to another verified channel of the same source if continuity is established.

### Endpoint unavailable
Use a verified alternative endpoint or preserved evidence where appropriate.

### Feed delayed
Check release calendars, official publication channels, alternative datasets, and revision notices.

### Dataset revised
Preserve prior version and reassess dependent claims rather than abandoning the series.

### Source retracted
Treat dependent evidence as requiring immediate review; seek independent evidence.

### Provenance compromised
Do not treat a backup copy as equivalent unless its provenance can be established.

### Methodology changed
Identify whether an alternative series is methodologically comparable before substituting it.

## 10. Resilience assessment

For each editorially important function record:

- function ID;
- required evidence class;
- primary source/lineage;
- alternative sources;
- independence relationship;
- channel/endpoint alternatives;
- expected update frequency;
- maximum acceptable delay;
- known revision risk;
- known access risk;
- continuity state;
- last assessment;
- reviewer.

Do not reduce this to a single quality score.

## 11. Hard rules

### RES-01 — Single-lineage alert
A consequential material assertion supported by only one evidentiary lineage should be flagged as fragile unless uniqueness is inherent to the fact class.

### RES-02 — False redundancy
Multiple outlets using the same underlying dispatch count as one lineage.

### RES-03 — Primary-source priority
When a primary source is unavailable, do not silently replace it with secondary material if the editorial assertion requires primary evidence.

### RES-04 — Functional equivalence
A fallback must perform the relevant evidentiary function; generic topical similarity is insufficient.

### RES-05 — Independence test
Fallbacks must be assessed for independence before being counted as resilience capacity.

### RES-06 — Methodology continuity
Alternative datasets cannot be substituted as equivalent without methodological assessment.

### RES-07 — Historical preservation
Loss of current access must not erase previously acquired evidence or its provenance.

### RES-08 — Re-review on failure
Failure of the only strong lineage for a consequential claim creates a review alert.

### RES-09 — No automatic downgrade
Source outage does not automatically mean source unreliability or falsehood of its content.

### RES-10 — No automatic substitution
The engine cannot automatically substitute a fallback into a published assertion.

### RES-11 — Critical uniqueness
If a fact is inherently documented by one authoritative institution, mark the dependency as unique rather than treating uniqueness as an error.

### RES-12 — Publication continuity
A publication may continue only if the remaining evidence satisfies the applicable editorial standard after the failure.

## 12. Continuity response ladder

`MONITOR → FALLBACK_AVAILABLE → FALLBACK_VALIDATION → REVERIFICATION → EDITORIAL DECISION`

Possible decisions:

- continue monitoring;
- switch channel;
- use independent corroboration;
- hold publication;
- publish with qualifiers;
- update an existing article;
- correct;
- retract;
- close investigation.

## 13. Resilience and priority

Resilience risk is separate from editorial priority.

A low-priority topic can be highly fragile.

A high-priority event can have excellent redundancy.

Therefore:

`RESILIENCE ≠ PRIORITY ≠ AUTHORITY ≠ TRUTH`

## 14. Scenario testing

The newsroom should periodically test:

1. primary API outage;
2. primary website outage;
3. feed delay;
4. source retraction;
5. dataset revision;
6. domain migration;
7. archive loss;
8. authentication failure;
9. regional source disappearance;
10. simultaneous failure of two related channels.

Each exercise should record whether an independent evidence path remained available.

## 15. Recovery objectives

For critical editorial functions define:

- `MAX_ACCEPTABLE_DETECTION_DELAY`
- `MAX_ACCEPTABLE_VERIFICATION_DELAY`
- `MAX_ACCEPTABLE_PUBLICATION_DELAY`
- `MINIMUM_INDEPENDENT_LINEAGES`
- `MINIMUM_PRIMARY_EVIDENCE`

These are editorial governance parameters, not universal constants.

## 16. Dependency concentration

Track:

`LINEAGE_CONCENTRATION = MATERIAL_ASSERTIONS_DEPENDENT_ON_LINEAGE / TOTAL_MATERIAL_ASSERTIONS`

High concentration creates resilience risk.

It must not be interpreted as evidence that the lineage is incorrect.

## 17. Source replacement protocol

Before replacing a critical source:

1. identify the exact evidentiary function;
2. identify the proposition supported;
3. identify the original lineage;
4. identify candidate alternatives;
5. test independence;
6. compare authority;
7. compare methodology;
8. compare temporal/geographic coverage;
9. document limitations;
10. perform human re-verification.

## 18. Resilience alerts

Recommended alert classes:

- `SINGLE_LINEAGE_RISK`
- `NO_PRIMARY_FALLBACK`
- `FALSE_REDUNDANCY`
- `CHANNEL_FAILURE`
- `ENDPOINT_FAILURE`
- `FEED_DELAY`
- `SOURCE_RETRACTION_RISK`
- `PROVENANCE_CONTINUITY_RISK`
- `METHODOLOGY_SUBSTITUTION_RISK`
- `CRITICAL_UNIQUENESS`
- `MULTI_SOURCE_CONCENTRATION`
- `EDITORIAL_CONTINUITY_FAILURE`

## 19. Human gate

The final process remains:

`RESILIENCE ALERT → HUMAN ASSESSMENT → FALLBACK VALIDATION → REVERIFICATION → EDITORIAL DECISION`

The engine identifies options and weaknesses. The editor decides whether evidence remains sufficient.

## 20. Final principle

> Resilience is the ability to preserve evidentiary continuity without confusing repetition with independence, availability with truth, or substitution with verification.
