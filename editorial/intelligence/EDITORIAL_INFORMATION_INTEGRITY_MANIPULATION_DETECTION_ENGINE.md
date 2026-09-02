# EDITORIAL INFORMATION INTEGRITY & MANIPULATION DETECTION ENGINE

## 1. Purpose

This engine identifies potential integrity failures in information used by MALDITOESPEJO: altered media, misleading context, manipulated documents, transformed numerical data, attribution loss, synthetic or edited content, and narrative distortions.

Its purpose is detection and structured investigation, not automatic attribution of intent.

## 2. Integrity chain

`ORIGINAL OBJECT → ACQUISITION → INTEGRITY CHECK → CONTEXT CHECK → PROVENANCE CHECK → CROSS-VALIDATION → HUMAN ASSESSMENT`

Integrity must be assessed separately from truth, authenticity, provenance, legality and intent.

## 3. Integrity dimensions

Assess independently:

- file integrity;
- content integrity;
- temporal integrity;
- geographic integrity;
- contextual integrity;
- attribution integrity;
- numerical integrity;
- methodological integrity;
- provenance integrity;
- transformation integrity.

## 4. Media integrity

For images, video and audio, preserve the original where possible and record:

- acquisition source;
- acquisition timestamp;
- file hash;
- metadata;
- compression/transcoding history;
- keyframes or extracted frames;
- reverse-search results;
- geolocation evidence;
- chronolocation evidence;
- contextual comparison;
- known edits or transformations.

Metadata absence is not proof of manipulation.

## 5. Document integrity

For documents and PDFs, assess:

- original locator;
- version identifier;
- publication timestamp;
- revision history;
- file hash;
- issuer/publisher;
- signatures where applicable;
- consistency with official repositories;
- extracted text versus rendered content;
- material differences between versions.

## 6. Numerical integrity

For data claims, verify:

- source dataset;
- series identifier;
- unit;
- reference period;
- denominator;
- methodology;
- revision status;
- calculation method;
- rounding;
- transformations;
- missing values;
- comparison baseline.

A correct number used with the wrong denominator or period can still produce a misleading claim.

## 7. Context integrity

The engine must detect potential context loss involving:

- cropped images;
- clipped quotations;
- omitted qualifications;
- changed publication dates;
- geographic relocation;
- old media presented as current;
- satire presented literally;
- preliminary data presented as final;
- estimates presented as observations;
- allegations presented as findings.

Context anomalies require evidence-based assessment.

## 8. Attribution integrity

Every consequential claim should preserve:

`WHO → SAID/OBSERVED/REPORTED WHAT → WHERE → WHEN → ON WHAT EVIDENCE`

Attribution disappearing during propagation is a material integrity risk.

## 9. Synthetic-content assessment

Potentially synthetic or AI-generated content may be assessed using multiple indicators, including provenance, source history, visual/audio anomalies, contextual inconsistency and independent evidence.

No detector result alone establishes that content is synthetic, manipulated or false.

## 10. Geospatial integrity

Where location matters, compare:

`CLAIMED LOCATION → VISUAL FEATURES → MAP DATA → SATELLITE/REMOTE SENSING → TEMPORAL CONSISTENCY → INDEPENDENT SOURCES`

Geolocation confidence must be recorded separately from content authenticity.

## 11. Chronological integrity

Determine whether the content existed at the claimed time.

Check:

- original publication;
- metadata;
- archive evidence;
- weather/light/shadow consistency where appropriate;
- satellite or map chronology;
- event chronology;
- version history.

## 12. Manipulation indicators

Potential indicators include:

- inconsistent pixels or editing artifacts;
- incompatible audio/video continuity;
- impossible chronology;
- altered numerical values;
- document-version conflicts;
- provenance discontinuity;
- unexplained metadata changes;
- contextual mismatch;
- attribution substitution;
- repeated use of known manipulated material.

Indicators are leads, not conclusions.

## 13. Integrity statuses

Use:

`INTACT`, `ANOMALY_DETECTED`, `CONTEXT_INCOMPLETE`, `PROVENANCE_UNCERTAIN`, `MANIPULATION_SUSPECTED`, `MANIPULATED`, `OUT_OF_CONTEXT`, `MISLEADING`, `UNVERIFIED`, `CLEARED`, `DISPUTED`.

`MANIPULATION_SUSPECTED` requires human assessment before escalation to `MANIPULATED`.

## 14. Evidence standards

A manipulation finding should identify:

1. the original object;
2. the suspected alteration or contextual defect;
3. the method of comparison;
4. supporting evidence;
5. alternative explanations considered;
6. confidence/uncertainty;
7. reviewer;
8. assessment timestamp.

## 15. Prohibited automation

The system must not automatically:

- label a person or organization as malicious;
- infer intent from an edit;
- classify content as propaganda solely from style;
- treat AI-detector output as conclusive;
- declare a claim false solely because media integrity is uncertain;
- delete evidence;
- rewrite historical records;
- publish manipulation findings without human review.

## 16. Alert classes

- `INTEGRITY_FILE_ANOMALY`
- `INTEGRITY_CONTEXT_LOSS`
- `INTEGRITY_ATTRIBUTION_LOSS`
- `INTEGRITY_TEMPORAL_MISMATCH`
- `INTEGRITY_GEOGRAPHIC_MISMATCH`
- `INTEGRITY_NUMERICAL_ANOMALY`
- `INTEGRITY_PROVENANCE_BREAK`
- `INTEGRITY_VERSION_CONFLICT`
- `INTEGRITY_MEDIA_MANIPULATION_SUSPECTED`
- `INTEGRITY_SYNTHETIC_CONTENT_SUSPECTED`
- `INTEGRITY_REUSED_MANIPULATED_MEDIA`

## 17. Integration

`INFORMATION FLOW → INTEGRITY ASSESSMENT → EVIDENCE GRAPH → VERIFICATION → CASE → EDITORIAL DECISION`

Source changes, revisions, provenance events and corrections must propagate into integrity review when relevant.

## 18. Core principle

> **Detect anomalies rigorously; never convert an anomaly into an accusation without evidence.**

MALDITOESPEJO must preserve the distinction between altered content, misleading context, uncertain provenance, false claims and deliberate manipulation.
