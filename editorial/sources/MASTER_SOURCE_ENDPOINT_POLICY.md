# MALDITOESPEJO — MASTER SOURCE ENDPOINT POLICY

## Purpose

Define how MALDITOESPEJO records and validates technical access points to editorial sources without confusing an institution's authority with the reliability or current availability of a particular endpoint.

## Canonical hierarchy

`SOURCE → CHANNEL → ENDPOINT → FEED/DATASET → OBSERVATION → EVENT/CLAIM → SIGNAL`

### SOURCE

Institution, organization, agency, database owner, publisher or service provider.

### CHANNEL

Editorially meaningful stream from a source: publications, RSS, API, dataset, alert service, case-law database, results portal, imagery service, etc.

### ENDPOINT

Concrete technical or navigational access point used to retrieve the channel. Examples: URL, API base path, RSS feed, SDMX endpoint, downloadable dataset, catalog service.

### FEED / DATASET

Actual stream, collection or machine-readable dataset consumed by the newsroom.

## Verification states

Each source, channel and endpoint has an independent state:

`VERIFIED | PENDING | FAILED | DEPRECATED`

A verified source does **not** imply a verified endpoint.

Valid example:

`SOURCE_VERIFIED = VERIFIED`

`CHANNEL_VERIFIED = VERIFIED`

`ENDPOINT_VERIFIED = PENDING`

## Endpoint verification checklist

An endpoint should be marked `VERIFIED` only after checking, where applicable:

1. It belongs to the claimed institution/service.
2. It resolves successfully.
3. It exposes the claimed resource.
4. The resource is current rather than archived or deprecated.
5. The response format is usable for the intended newsroom function.
6. Publication/update timestamps can be recovered.
7. The endpoint's scope matches the recorded channel.
8. Authentication, rate limits or access restrictions are documented.
9. Dataset version, methodology and provenance are recoverable when relevant.
10. The endpoint does not silently redirect to a materially different source.

## API and dataset rule

For APIs and datasets, the registry should preserve:

- base endpoint;
- specific resource path when known;
- access method;
- format;
- update frequency;
- last verified date;
- version/release identifier;
- methodology URL where available;
- limitations;
- licensing/access restrictions.

## RSS / alert rule

Feeds and alert services are treated as detection channels. They establish that a publication or alert exists; they do not automatically establish the truth of every factual assertion contained in it.

## Aggregator rule

Aggregators and repositories must preserve provenance to the original publisher whenever possible.

Examples:

- ReliefWeb → original humanitarian publisher.
- Crossref → original scholarly work.
- OpenAlex → original scholarly record.
- NVD → vulnerability enrichment linked to CVE/vendor evidence.
- News agencies → original institutional document or direct observation where available.

## Corroboration rule

Multiple endpoints belonging to the same institution count as one institutional lineage, not as independent corroboration.

Ten news stories reproducing one agency dispatch also count as one underlying evidentiary lineage until an independent source is identified.

## Temporal rule

Every operational endpoint should be evaluated for:

`publication_time`
`effective_time`
`retrieval_time`
`dataset_version`
`last_verified_at`

A current endpoint can expose historical data. Do not infer that the underlying observation is current merely because the endpoint was accessed today.

## Failure handling

If an endpoint fails:

1. retain the channel;
2. mark endpoint `FAILED`;
3. record the failure date and nature;
4. search for an official replacement endpoint;
5. never substitute an unofficial mirror without explicit provenance;
6. keep historical endpoint information when needed for reproducibility.

## Editorial consequence

Endpoint verification is infrastructure quality control. It does not replace claim verification.

The final newsroom chain remains:

`DETECTION → PRIMARY EVIDENCE → SOURCE AUTHORITY → TEMPORAL CHECK → INDEPENDENT CORROBORATION → CONTRADICTION CHECK → HUMAN REVIEW → VERIFICATION STATUS`

## Rule of truth

**The registry records where evidence comes from and how it is accessed; it does not turn access into evidence of truth.**
