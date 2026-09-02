# MALDITOESPEJO — EVIDENCE PROVENANCE CHAIN

## 1. Principle

Every consequential evidentiary item should have a provenance chain sufficient to reconstruct its origin and editorial handling.

Canonical chain:

`ORIGIN → PUBLICATION → ACQUISITION → STORAGE/CAPTURE → TRANSFORMATION → ANALYSIS → CLAIM/EVENT → VERIFICATION → DECISION`

## 2. Origin

Identify the earliest reasonably traceable origin:

- institution;
- named person or actor;
- original document;
- original image/video;
- dataset;
- direct observation.

A secondary report must not be treated as the origin merely because it was discovered first.

## 3. Acquisition versus publication

`published_at` describes when the source made material available.

`acquired_at` describes when MALDITOESPEJO obtained or captured it.

The two may differ substantially.

## 4. Transformation lineage

No analytical derivative should lose its parent reference.

Examples:

`EVD-101 original video`
→ `EVD-102 extracted keyframe`
→ `EVD-103 cropped region`
→ `EVD-104 geolocation annotation`

All remain linked by `DERIVED_FROM`.

## 5. Translation and transcription

Translated text, OCR and transcripts are derivatives.

They may facilitate analysis but do not replace the original-language or original-media evidence.

## 6. Evidence versus interpretation

The system must distinguish:

`WHAT THE ARTIFACT CONTAINS`
from
`WHAT THE EDITOR INFERS FROM IT`.

An inference must be represented as an analytical conclusion or claim, not silently embedded as evidence.

## 7. Integrity

A hash verifies continuity of the stored artifact. It does not prove provenance, authenticity or truth.

Authenticity requires additional evidence appropriate to the material.

## 8. Broken provenance

If the origin cannot be established, mark provenance as uncertain rather than inventing an origin.

Use explicit statuses such as:

`PROVENANCE_VERIFIED`
`PROVENANCE_PARTIAL`
`PROVENANCE_UNCERTAIN`
`PROVENANCE_FAILED`

## 9. Audit question

For every important evidence item, an auditor should be able to follow the chain backwards:

**Where did this come from? How did MALDITOESPEJO obtain it? What happened to it before analysis? What conclusion was drawn from it?**
