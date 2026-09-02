# MALDITOESPEJO — MASTER SOURCE MODEL

## 1. Objective

Establish the canonical data model for the newsroom source registry. The model separates institutional identity, editorial channels, technical endpoints and actual feeds/datasets so that source authority, technical availability and evidentiary value are never conflated.

## 2. Canonical graph

```text
SOURCE
  ↓
CHANNEL
  ↓
ENDPOINT
  ↓
FEED / DATASET / DOCUMENT COLLECTION
  ↓
OBSERVATION
  ↓
EVENT / CLAIM / DATA POINT
  ↓
SIGNAL
  ↓
CORRELATION
  ↓
VERIFICATION
  ↓
EDITORIAL PRIORITY
  ↓
HUMAN EDITOR
  ↓
PUBLICATION
```

## 3. SOURCE entity

Required conceptual fields:

- `source_id`
- `source_name`
- `institution`
- `source_type`
- `source_nature`
- `jurisdiction`
- `authority_level`
- `editorial_role`
- `source_verified`
- `source_verification_date`
- `source_notes`

### Source types

`GOVERNMENT`, `INTERGOVERNMENTAL`, `COURT`, `REGULATOR`, `ELECTORAL_AUTHORITY`, `PARLIAMENT`, `DATA_PROVIDER`, `RESEARCH_INSTITUTION`, `NEWS_AGENCY`, `FACT_CHECKER`, `OSINT`, `COMMERCIAL_DATA`, `CIVIL_SOCIETY`, `ACADEMIC`, `OTHER`

### Source nature

`PRIMARY`, `SECONDARY`, `MIXED`, `ANALYTICAL`, `AGGREGATOR`, `TOOL`, `REPOSITORY`

## 4. CHANNEL entity

A channel is the editorially meaningful stream exposed by a source.

Required conceptual fields:

- `channel_id`
- `source_id`
- `channel_name`
- `channel_type`
- `radar`
- `editorial_function`
- `channel_verified`
- `channel_verification_date`
- `channel_notes`

### Channel types

`WEB`, `RSS`, `API`, `SDMX`, `DATASET`, `ALERT`, `DOCUMENT`, `REPORT`, `RESULTS`, `MAP`, `IMAGERY`, `TOOL`, `METHODOLOGY`, `CALENDAR`, `DATABASE`, `REPOSITORY`

## 5. ENDPOINT entity

An endpoint is the concrete access point for a channel.

Required conceptual fields:

- `endpoint_id`
- `channel_id`
- `endpoint_type`
- `endpoint`
- `access_method`
- `format`
- `authentication_required`
- `endpoint_verified`
- `endpoint_verification_date`
- `last_checked_at`
- `endpoint_status`
- `endpoint_notes`

### Endpoint status

`ACTIVE`, `PENDING`, `FAILED`, `DEPRECATED`, `RESTRICTED`

## 6. FEED / DATASET entity

Required conceptual fields:

- `feed_id`
- `endpoint_id`
- `feed_name`
- `feed_scope`
- `update_frequency`
- `publication_timestamp_available`
- `effective_timestamp_available`
- `version_available`
- `methodology_available`
- `licence_or_access_terms`
- `coverage`
- `limitations`

## 7. Evidence classification

Each retrieved object should be classified before it becomes a signal:

`PRIMARY_DOCUMENT`
`PRIMARY_DATASET`
`DIRECT_OBSERVATION`
`JUDICIAL_RECORD`
`REGULATORY_RECORD`
`OFFICIAL_RESULT`
`OFFICIAL_STATEMENT`
`QUALIFIED_DATASET`
`RESEARCH_ANALYSIS`
`NEWS_REPORT`
`FACT_CHECK`
`OSINT_ANALYSIS`
`SOCIAL_POST`
`TOOL_OUTPUT`

## 8. Independence model

Independence must be represented separately from source count.

`corroboration_count` must not simply count URLs.

Instead record:

- `institutional_lineage`
- `evidence_lineage`
- `independence_group`
- `corroboration_type`

Example:

Reuters + AP + ten newspapers repeating the same official statement may represent one underlying event lineage.

An official document + independently captured imagery + an unrelated local witness may represent multiple evidence lineages.

## 9. Temporal model

The registry distinguishes:

- `published_at`
- `effective_at`
- `observed_at`
- `retrieved_at`
- `last_verified_at`
- `dataset_version`

A retrieval timestamp must never be substituted for the date of the underlying event.

## 10. Authority model

Authority is contextual, not absolute.

`A+` = primary/high authority for the relevant fact class.

`A` = strong authoritative or specialist evidence.

`B` = secondary/contextual evidence.

`C` = background or low-authority material.

Examples:

- Electoral authority → A+ for certified results.
- Court → A+ for its own judgment.
- CVE/NVD/CISA KEV → different functions within vulnerability evidence; do not collapse them into one authority score.
- ACLED/UCDP → strong conflict datasets but not automatically the original incident record.
- Reuters/AP/AFP/EFE → strong discovery/cross-check sources but not substitutes for the original primary document when available.

## 11. Verification model

Three independent verification layers:

### Institutional

Does the source genuinely belong to the claimed institution?

### Channel

Does the institution actually publish the claimed stream?

### Endpoint

Does the recorded technical access point currently expose the claimed resource?

Each layer is independently versioned and dated.

## 12. Editorial function

A channel may perform one or more functions:

`DETECTION`
`DISCOVERY`
`PRIMARY_EVIDENCE`
`DATA_ENRICHMENT`
`CORROBORATION`
`VERIFICATION`
`CONTEXT`
`ANALYSIS`
`EARLY_WARNING`
`RESULT_CONFIRMATION`
`VISUAL_VERIFICATION`
`GELOCATION`
`CHRONOLOCATION`
`DAMAGE_ASSESSMENT`

## 13. Prohibited simplifications

The registry must never:

1. Treat every URL as an independent source.
2. Treat every institutional page as a primary record.
3. Treat a news report as equivalent to the underlying official document.
4. Treat a dataset aggregator as the dataset owner.
5. Treat a tool result as independent evidence without examining provenance.
6. Treat preliminary election results as certified results.
7. Treat an endpoint being reachable as proof that its contents are true.
8. Treat TIV as the financial price of an arms transfer.
9. Treat conflict datasets as automatic incident-level primary evidence.
10. Auto-publish a signal without human editorial review.

## 14. Canonical normalization

The master registry should ultimately be represented in normalized tables:

### `sources`
One row per institution/source.

### `channels`
One row per editorial channel.

### `endpoints`
One row per technical access point.

### `feeds`
One row per feed/dataset/document collection.

### `source_relations`
Relationships between sources and channels, including ownership, aggregation, provenance and dependency.

### `verification_log`
Historical endpoint/channel verification events.

This prevents duplication and allows a single source to expose many channels and a single channel to expose multiple endpoints.

## 15. Editorial integrity rule

The master registry is infrastructure for evidence discovery and provenance. It is not itself an authority engine.

The newsroom's final evidentiary decision remains:

`EVIDENCE QUALITY + INDEPENDENCE + TEMPORAL VALIDITY + CONTRADICTION CHECK + HUMAN REVIEW`

Only then can a signal receive publication priority.
