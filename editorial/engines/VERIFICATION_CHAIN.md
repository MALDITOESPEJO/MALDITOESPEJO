# MALDITOESPEJO — VERIFICATION CHAIN

## Purpose

The Verification Chain determines whether an editorially relevant assertion can be treated as verified, partially verified, unresolved or contradicted.

## Canonical chain

`DETECTION → PRIMARY EVIDENCE → SOURCE AUTHORITY → TEMPORAL CHECK → INDEPENDENT CORROBORATION → CONTRADICTION CHECK → HUMAN REVIEW → VERIFICATION STATUS`

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

## Final human gate

No automated verification result overrides editorial judgment for high-impact claims. Material uncertainty must remain visible in the editorial record.
