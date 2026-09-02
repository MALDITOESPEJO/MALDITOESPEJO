# MALDITOESPEJO — EVIDENCE PACK SPECIFICATION

## 1. Purpose

The Evidence Pack is the reproducible evidentiary bundle associated with an editorial case.

It provides the concrete material behind the Evidence Graph without replacing the graph itself.

## 2. Evidence classes

Supported classes include:

- `OFFICIAL_DOCUMENT`
- `COURT_DOCUMENT`
- `REGULATORY_RECORD`
- `DATASET`
- `API_RESPONSE`
- `STATEMENT`
- `IMAGE`
- `VIDEO`
- `AUDIO`
- `MAP`
- `SATELLITE_IMAGERY`
- `SOCIAL_POST`
- `MEDIA_REPORT`
- `RESEARCH_PAPER`
- `ARCHIVED_PAGE`
- `SCREENSHOT`
- `OTHER`

## 3. Evidence record

Each material item should preserve:

`evidence_id`
`evidence_version`
`case_id`
`evidence_type`
`title_or_description`
`canonical_locator`
`original_locator`
`publisher_or_originator`
`published_at`
`updated_at`
`acquired_at`
`effective_at`
`reference_period`
`capture_method`
`content_hash`
`file_format`
`language`
`geographic_scope`
`related_claim_ids`
`related_event_ids`
`integrity_status`
`provenance_status`
`access_status`

## 4. Acquisition

The pack should distinguish:

`PUBLISHED_BY_SOURCE`
`ACQUIRED_BY_MALDITOESPEJO`
`OBSERVED_AT`
`VERIFIED_AT`

These timestamps must not be collapsed.

## 5. Documents

For PDFs and other documents, preserve where available:

- original file;
- canonical URL;
- document title;
- issuing body;
- publication date;
- version number;
- page references used by the editor;
- extraction method;
- content hash.

## 6. Images and video

For visual evidence preserve, where available:

- original media;
- source URL;
- media identifier;
- capture/publication timestamp;
- metadata;
- extracted keyframes;
- transformations performed during analysis;
- geolocation evidence;
- chronolocation evidence;
- reverse-search references;
- integrity/hash reference.

Analytical derivatives must never replace the original.

## 7. Datasets and APIs

For datasets/API evidence preserve:

- dataset name;
- provider;
- dataset version;
- query parameters;
- endpoint;
- retrieval timestamp;
- observation period;
- units;
- methodology/version;
- response or extract identifier;
- revision status.

An API response is a time-specific snapshot and should not be treated as immutable simply because the endpoint is official.

## 8. Web pages

Where permitted and technically feasible, preserve:

- canonical URL;
- retrieval timestamp;
- archived/captured copy;
- relevant excerpt location;
- page version or revision indicator;
- hash/reference to the captured representation.

## 9. Hashes

A cryptographic hash can establish that a stored artifact has not changed since capture. It does **not** establish that the source itself was truthful or authentic.

Integrity and authenticity must remain separate concepts.

## 10. Transformations

Every derivative should record:

`DERIVED_FROM = original_evidence_id`

Examples:

- PDF text extraction;
- image crop;
- video keyframe;
- OCR;
- transcription;
- translated copy;
- normalized dataset;
- geolocation annotation.

## 11. Access failures

If an original item becomes inaccessible, the pack should retain the last lawful/available representation and record:

`ACCESS_LOST`
`ACCESS_RESTRICTED`
`SOURCE_REMOVED`
`SOURCE_REVISED`
`ARCHIVE_ONLY`

Loss of access must not be silently interpreted as deletion of the underlying event.

## 12. Reproducibility standard

A reviewer should be able to understand:

**what the editor saw, where it came from, when it was acquired, what transformations were performed, and which proposition it was used to support or challenge.**
