# SOURCE DEPENDENCY MATRIX

## Purpose

The Source Dependency Matrix converts the source/evidence/case cross-reference into an editorial intelligence layer.

It measures not only how many sources are used, but how much editorial knowledge depends on each underlying source lineage.

The principal unit for independence analysis is normally the evidentiary lineage, not the number of URLs.

## Dependency model

`SOURCE → LINEAGE → EVIDENCE → CASE → CLAIM/EVENT → DECISION → PUBLICATION`

## Dependency dimensions

| Dimension | Meaning |
|---|---|
| `CASE_DEPENDENCY` | Number and importance of cases materially relying on a lineage. |
| `CLAIM_DEPENDENCY` | Number and importance of claims relying on a lineage. |
| `EVIDENCE_DEPENDENCY` | Volume of evidence items derived from a lineage. |
| `SECTION_DEPENDENCY` | Editorial sections materially dependent on the lineage. |
| `GEOGRAPHIC_DEPENDENCY` | Dependence concentrated in a country or region. |
| `TOPIC_DEPENDENCY` | Dependence concentrated in a topic. |
| `TEMPORAL_DEPENDENCY` | Dependence concentrated in a period. |
| `PRIMARY_STATUS` | Whether the lineage is primary for the proposition. |
| `INDEPENDENCE_DIVERSITY` | Availability of genuinely independent lineages. |
| `REVISION_RISK` | Risk from source corrections, revisions or withdrawal. |
| `ACCESS_RISK` | Risk caused by unstable, inaccessible or ephemeral sources. |

## Dependency levels

### LOW
Limited material downstream dependence and meaningful alternatives exist.

### MODERATE
Important to a topic, case family or workflow, but alternatives exist.

### HIGH
Material cases or consequential claims rely on the lineage, with limited independent alternatives.

### CRITICAL
Loss, correction or compromise of the lineage could materially affect a substantial body of published or pending work.

Dependency level is a risk indicator, not a source-quality judgment.

## Independence diversity

The matrix should distinguish:

- `0` independent lineages;
- `1` independent lineage;
- `2+` independent lineages;
- `MULTIPLE_PRIMARY` where several relevant primary authorities exist.

A high number of publications does not increase independence when they share a common upstream source.

## Editorial interpretation

**High dependency + high authority:** generally acceptable where the source is the appropriate primary authority, while continuity and archival risk should be monitored.

**High dependency + low authority:** high-risk configuration; seek stronger primary or specialist evidence.

**High dependency + low independence:** corroboration is weaker than apparent publisher count suggests.

**High dependency + high revision risk:** maintain versioned evidence and identify affected cases for rapid re-review.

**Low dependency + high consequence:** a single primary source may still justify publication if authoritative and directly establishes the proposition; dependency alone is not a rejection criterion.

## Concentration warning

The system should flag a concentration warning when a single lineage becomes disproportionately responsible for material editorial assertions within a topic, geography or period.

The threshold must be configurable rather than hard-coded globally.

Possible diagnostic measure:

`LINEAGE_SHARE = MATERIAL_ASSERTIONS_DEPENDENT_ON_LINEAGE / TOTAL_MATERIAL_ASSERTIONS`

This percentage is diagnostic only. It is not a truth or publication score.

## Dependency propagation

If a lineage changes status:

`SOURCE CHANGE → LINEAGE IMPACT → EVIDENCE IMPACT → CASE IMPACT → CLAIM/EVENT IMPACT → DECISION REVIEW`

Relevant changes include correction, withdrawal, retraction, dataset revision, endpoint deprecation, methodology change, access failure, provenance challenge and integrity compromise.

## Editorial intelligence dashboard

A future dashboard should expose:

1. most depended-upon source lineages;
2. cases with only one evidentiary lineage;
3. claims with no independent corroboration;
4. source concentration by topic;
5. source concentration by geography;
6. source concentration by section;
7. lineages with recent revisions;
8. evidence packs affected by source changes;
9. cases vulnerable to loss of a source;
10. unresolved contradiction clusters.

## Prohibited interpretation

The matrix must never be treated as:

- a ranking of journalistic truth;
- a ranking of political reliability;
- a substitute for verification;
- a popularity score;
- a proxy for source credibility;
- permission to discard minority evidence merely because it is less frequent.

It identifies structural dependence and evidentiary diversity.

## Human gate

Every material dependency alert requires editorial review.

`DEPENDENCY ALERT ≠ ERROR ≠ FALSEHOOD`

It is an intelligence signal requiring assessment.
