# EDITORIAL SOURCE NETWORK & INFORMATION FLOW ENGINE

## 1. Purpose

This engine reconstructs how information moves from an originating observation, document, dataset, statement or event through detection, transformation, amplification, corroboration, verification and eventual editorial publication.

It complements the Source Network & Lineage Intelligence Engine: lineage explains ancestry; information flow explains propagation and transformation over time.

## 2. Canonical flow

`ORIGIN → DETECTION → TRANSFORMATION → PROPAGATION → CORROBORATION → VERIFICATION → EDITORIAL DECISION → PUBLICATION`

The system must preserve the difference between the underlying event and the information about that event.

## 3. Flow objects

A flow may contain:

- primary observation;
- official document or statement;
- dataset/API release;
- initial report;
- secondary report;
- social-media post;
- translation;
- aggregation;
- analytical interpretation;
- fact-check;
- editorial evidence pack;
- verified claim;
- publication.

Each node retains its own identity, timestamp, provenance and relationship to upstream information.

## 4. Flow relationships

Permitted relationships include:

`ORIGINATES`, `DETECTS`, `REPORTS`, `QUOTES`, `REPRODUCES`, `TRANSLATES`, `SUMMARIZES`, `AGGREGATES`, `INTERPRETS`, `UPDATES`, `REVISES`, `CORROBORATES`, `CONTRADICTS`, `VERIFIES`, `PUBLISHED_AS`.

A relationship must identify the upstream object wherever reasonably possible.

## 5. Information transformation

The engine records material changes introduced during propagation:

- wording changes;
- translation;
- omission;
- added context;
- changed numerical value;
- changed date/time;
- changed geographic scope;
- changed attribution;
- changed certainty;
- changed headline framing;
- analytical inference presented as fact;
- loss of qualification;
- addition of unsupported causal explanation.

Transformation does not necessarily imply manipulation. It must be assessed against evidence.

## 6. Propagation timing

For each material flow, preserve:

`origin_time`, `first_detection_time`, `first_secondary_publication_time`, `first_independent_corroboration_time`, `verification_time`, `editorial_decision_time`, `publication_time`.

This enables measurement of information lead time without confusing speed with reliability.

## 7. First detection

`FIRST_DETECTION` identifies the earliest recorded detection available to MALDITOESPEJO, not necessarily the absolute first appearance on the internet.

The system must distinguish:

- first known origin;
- first known public appearance;
- first detection by MALDITOESPEJO;
- first independent corroboration.

## 8. Propagation versus corroboration

Propagation answers: **how did the information spread?**

Corroboration answers: **did independent evidence support the proposition?**

A downstream publication that merely repeats an upstream report is propagation, not independent corroboration.

## 9. Flow bottlenecks

Identify:

- single-origin dependence;
- single-provider dependence;
- delayed primary evidence;
- unavailable original source;
- translation bottlenecks;
- verification bottlenecks;
- geographic blind spots;
- evidence-pack acquisition delays;
- access failures.

Bottlenecks trigger operational or editorial review according to materiality.

## 10. Information velocity

Useful measures include:

- detection latency;
- propagation latency;
- verification latency;
- publication latency;
- correction latency;
- time between initial and revised information.

No velocity measure is a truth or quality score.

## 11. Narrative drift

The engine should detect material divergence between upstream and downstream representations, including:

`CLAIM A → CLAIM A' → CLAIM A''`

Potential drift indicators:

- certainty increases without evidence;
- attribution disappears;
- disputed information becomes categorical;
- forecast becomes observation;
- estimate becomes reported fact;
- allegation becomes established event;
- context is removed in a way that changes meaning.

A drift alert requires human review.

## 12. Corrections and revisions

Corrections must be connected to the information object they supersede.

Canonical history:

`INITIAL → REVISION → CORRECTION/CLARIFICATION → CURRENT STATE`

No historical state may be silently overwritten when it materially affected editorial decisions.

## 13. Information cascades

A cascade occurs when many downstream nodes emerge from a small number of upstream nodes.

The engine should identify cascade depth and breadth but must not infer coordinated manipulation solely from cascade structure.

A cascade can arise from legitimate breaking news, syndication, official statements or ordinary social sharing.

## 14. Independent corroboration timing

The system should identify the first point at which genuinely independent evidence supports the same proposition.

If ten reports follow one wire story and an eleventh independently documents the event, the eleventh represents a materially different evidentiary milestone.

## 15. Editorial intake

When information reaches MALDITOESPEJO, the case should record:

- what was received;
- from which node;
- through which channel;
- when it was detected;
- upstream lineage;
- transformation status;
- independent evidence available;
- unresolved uncertainty;
- assigned case and editor.

## 16. Publication trace

Every consequential publication should be traceable backwards:

`PUBLICATION → DECISION → VERIFICATION → EVIDENCE → CLAIM/EVENT → FLOW → ORIGIN`

If the chain breaks, the publication should be flagged for provenance review.

## 17. Alert classes

- `FLOW_SINGLE_ORIGIN`
- `FLOW_FALSE_CORROBORATION`
- `FLOW_NARRATIVE_DRIFT`
- `FLOW_ATTRIBUTION_LOSS`
- `FLOW_TEMPORAL_ANOMALY`
- `FLOW_EVIDENCE_BOTTLENECK`
- `FLOW_REVISION_PROPAGATION`
- `FLOW_CORRECTION_PROPAGATION`
- `FLOW_UNVERIFIED_CASCADE`
- `FLOW_PUBLICATION_TRACE_BREAK`

## 18. Human gate

Information-flow analysis is investigative infrastructure. It must not automatically:

- label a network as coordinated;
- label content as disinformation;
- determine truth;
- publish an item;
- retract an item;
- assign blame.

## 19. Integration

`SOURCE NETWORK/LINEAGE → INFORMATION FLOW → EVIDENCE GRAPH → CASE → VERIFICATION → DECISION → PUBLICATION`

Source health, change-impact, resilience, coverage, acquisition, performance and governance events may all alter the interpretation of a flow.

## 20. Core principle

> **Track not only where information came from, but how it changed as it travelled.**

MALDITOESPEJO must be able to reconstruct the evidentiary and informational history behind every consequential published assertion.
