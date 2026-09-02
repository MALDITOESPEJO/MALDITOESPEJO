# MALDITOESPEJO — VERIFICATION CHAIN

## Purpose

The Verification Chain determines whether an editorially relevant assertion can be treated as verified, partially verified, unresolved or contradicted.

The newsroom may discover a story through secondary media, social platforms or other leads. That discovery route is separate from the evidence used to support the published article.

## Canonical chain

`DETECTION → PRIMARY / APPROPRIATE EVIDENCE → SOURCE AUTHORITY → TEMPORAL CHECK → INDEPENDENT CORROBORATION → CONTRADICTION CHECK → HUMAN REVIEW → VERIFICATION STATUS → PUBLICATION`

## Discovery is not evidence

A `DISCOVERY_SOURCE` is a lead used to find something worth investigating. It is not automatically a `PUBLICATION_SOURCE`.

The system must distinguish:

`DISCOVERY_SOURCE ≠ PUBLICATION_SOURCE`

A secondary article may point the newsroom towards an official document. The published article should be based on the official document when that document supports the proposition.

The discovery source remains in the internal investigation record when useful for auditability. It should not appear publicly merely because it provided the initial lead.

## Evidence hierarchy

1. Original official document or dataset.
2. Direct observation or original media with provenance.
3. Court, regulator, electoral authority or other competent institutional record.
4. Qualified independent datasets or research institutions.
5. Reputable news agencies and specialist media.
6. Social-media posts and unattributed material as leads, not automatic confirmation.

## Verification states

- `UNVERIFIED`
- `PENDING`
- `VERIFIED`
- `PARTIALLY_VERIFIED`
- `CONTRADICTED`
- `MANIPULATED`

## Claim verification

A claim must be decomposed into verifiable propositions. A source confirming one proposition does not automatically confirm the entire claim.

## Image and video verification

Required checks may include:

- provenance;
- reverse-image search;
- keyframes;
- metadata where available;
- visual inconsistencies;
- geolocation;
- chronolocation;
- satellite comparison;
- street-level imagery;
- weather and sun/shadow consistency;
- independent contemporary sources.

## Geolocation chain

`IMAGE FEATURES → MAP FEATURES → SATELLITE FEATURES → TERRAIN → SHADOWS → STREET IMAGERY → CANDIDATE LOCATION → CONFIDENCE`

## Damage verification

`IMAGE/VIDEO → GEOLOCATION → OBJECT IDENTIFICATION → BEFORE IMAGE → AFTER IMAGE → SATELLITE → DATE RANGE → INDEPENDENT SOURCES → OFFICIAL/LOCAL EVIDENCE`

## Chronolocation

The system should compare metadata, publication time, shadows, sun position, weather, satellite imagery, aviation/AIS observations, social posts and archived web material. Publication timestamp is not automatically event timestamp.

## Conflict verification

For conflict events, distinguish:

- `CONFLICT_EVENT` — something that happened;
- `CONFLICT_ASSESSMENT` — evaluation of what is happening;
- `CONFLICT_FORECAST` — projection of what may happen.

Datasets such as ACLED and UCDP are valuable corroborative/event-data sources but do not replace the original evidence of a particular incident.

## Plain-language editorial rule

Verification is rigorous internally but the published language should remain easy to understand.

Do not expose technical labels when ordinary language is clearer.

Examples:

- Internal: `VERIFIED_PRIMARY_DATA`
- Public: "Los datos oficiales muestran..."

- Internal: `ATTRIBUTED_CLAIM`
- Public: "El ministro afirmó..."

- Internal: `UNRESOLVED`
- Public: "Todavía no hay datos suficientes para saberlo."

- Internal: `CONTRADICTED`
- Public: "Los datos disponibles no coinciden y la cuestión sigue abierta."

The objective is not to simplify the evidence. It is to explain it clearly without unnecessary jargon.

## Final human gate

No automated verification result overrides editorial judgment for high-impact claims. Material uncertainty must remain visible in the editorial record and, when relevant to understanding the story, in the published article.

## Core doctrine

> **La investigación puede ser compleja; la explicación no debe serlo.**
