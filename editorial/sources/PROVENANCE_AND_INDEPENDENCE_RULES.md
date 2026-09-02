# MALDITOESPEJO — PROVENANCE & INDEPENDENCE RULES

## 1. Principle

MALDITOESPEJO must measure **evidence lineages**, not the number of URLs, articles or database records pointing to the same underlying information.

## 2. Three different concepts

### Source authority

Who is providing the information and what fact class that institution is competent to establish.

### Provenance

Where the information ultimately originated.

### Independence

Whether corroborating evidence was generated independently of the original information lineage.

These dimensions must never be collapsed into one score.

## 3. Evidence lineage

Every observation should be traceable through:

`OBSERVATION → FEED → ENDPOINT → CHANNEL → SOURCE`

When the observation is reproduced elsewhere, preserve:

`REPRODUCTION → ORIGINAL_SOURCE → ORIGINAL_DOCUMENT/EVIDENCE`

## 4. Independence groups

Each evidentiary item may receive an `independence_group` identifier.

Items sharing the same underlying dispatch, official statement, press release, dataset or original media should normally share the same lineage/group.

### Example

```text
Government statement
      ↓
Reuters
      ↓
AP
      ↓
BBC
      ↓
20 local newspapers
```

This may produce many URLs but only one underlying information lineage.

## 5. Strong independent corroboration

Examples of potentially independent evidence include:

- official document + independently captured imagery;
- judicial record + independent factual observation;
- electoral authority result + independent observation of polling process;
- satellite acquisition + unrelated eyewitness material;
- aircraft tracking network A + aircraft tracking network B;
- maritime AIS network A + official maritime surveillance;
- primary dataset + independently generated measurement.

Independence must be assessed case by case.

## 6. Institutional dependency

A relationship such as:

`RELIEFWEB → OCHA`

means the two cannot automatically be counted as independent corroboration when the same humanitarian report is involved.

Likewise:

`OVERPASS API → OPENSTREETMAP`

is a technical access relationship, not independent geographic evidence.

## 7. Aggregators

An aggregator may be extremely useful for discovery while having no independent evidentiary value.

Required editorial behaviour:

1. discover through aggregator;
2. identify original publisher;
3. retrieve original evidence where possible;
4. record both the discovery source and primary provenance;
5. do not inflate corroboration count.

## 8. News agency rule

Reuters, AP, AFP, EFE and other agencies can independently corroborate an event only when their evidence lineage is materially independent.

If several agencies quote the same official statement, the official statement is the common underlying lineage.

If two agencies independently interviewed different witnesses, photographed the event separately or obtained distinct documents, their evidence may be independent.

## 9. Dataset rule

Datasets should retain:

- publisher;
- methodology;
- version;
- observation period;
- source inputs where disclosed;
- transformation/coding rules;
- update date.

Two datasets derived from the same administrative source are not automatically independent.

## 10. Conflict and humanitarian data

ACLED, UCDP, OCHA, ReliefWeb and similar systems have complementary functions. Their apparent agreement must not automatically be interpreted as multiple independent confirmations of an incident.

For a major conflict event, the preferred chain is:

`ORIGINAL INCIDENT EVIDENCE → QUALIFIED DATASET → HUMANITARIAN REPORT → INDEPENDENT IMAGERY/OSINT → NEWS AGENCY CROSS-CHECK`

The precise order may vary by event.

## 11. Election rule

For election reporting, distinguish:

`POLL → EXIT POLL → MEDIA PROJECTION → PRELIMINARY COUNT → OFFICIAL RESULT → CERTIFIED RESULT → JUDICIAL FINALITY`

A media projection cannot corroborate an official count merely because multiple outlets publish it.

## 12. Cybersecurity rule

For vulnerabilities:

`CVE` identifies the vulnerability record.

`NVD` enriches/scorers vulnerability information.

`CISA KEV` establishes inclusion in the known-exploited catalogue.

Therefore:

`CVE + NVD HIGH + CISA KEV`

supports an `ACTIVE_EXPLOITATION` signal, subject to current record verification. It does not by itself prove that a particular victim was compromised.

## 13. Geolocation rule

A geolocation conclusion should preserve its evidence layers:

`IMAGE → VISUAL FEATURES → MAP → STREET IMAGERY → SATELLITE → TERRAIN → SHADOW/SUN → COORDINATE CANDIDATE → INDEPENDENT CHECK`

One tool output is not sufficient merely because it returns a plausible coordinate.

## 14. Damage verification rule

Preferred chain:

`IMAGE/VIDEO → GEOLOCATION → OBJECT IDENTIFICATION → BEFORE IMAGE → AFTER IMAGE → SATELLITE → ACQUISITION DATE → INDEPENDENT SOURCES → HUMAN REVIEW`

Do not infer destruction from a low-quality image without establishing location, date and object identity.

## 15. Corroboration score

The system should not use a naive `number_of_sources` score.

Instead calculate conceptually from:

`authority × independence × evidence_quality × temporal_match × directness`

The precise numerical implementation belongs to the editorial correlation engine.

## 16. Contradiction

If credible sources conflict, preserve both lineages and create:

`EDITORIAL_CONFLICT_ALERT`

Do not resolve contradictions by majority vote.

## 17. Human gate

No provenance graph can substitute for editorial judgment.

Before publication the editor must be able to answer:

1. What is the underlying evidence?
2. Who generated it?
3. How current is it?
4. Is corroboration genuinely independent?
5. Is there credible contradictory evidence?
6. What remains uncertain?

## 18. Final rule

**More sources do not necessarily mean more evidence. More independent evidence does.**
