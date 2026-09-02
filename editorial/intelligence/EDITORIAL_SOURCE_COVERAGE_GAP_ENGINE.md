# EDITORIAL SOURCE COVERAGE & GAP ENGINE

## 1. Purpose

The Editorial Source Coverage & Gap Engine (ESCGE) determines what MALDITOESPEJO can reliably monitor and verify, where coverage is strong, where it is weak, and where important editorial blind spots exist.

It complements the source registry, dependency, health, change-impact, and resilience systems.

The engine is designed to answer:

> Where could an important event, development, claim, or change occur without MALDITOESPEJO having an adequate chance of detecting, contextualizing, or verifying it?

## 2. Coverage is not source quantity

Coverage is not measured by the number of URLs, publishers, feeds, or sources.

It is assessed by **editorial function** and **independent evidentiary capacity**.

Ten outlets repeating the same agency dispatch provide limited additional coverage. One authoritative local source may provide unique geographic coverage.

## 3. Canonical coverage model

`EDITORIAL DOMAIN → TOPIC → JURISDICTION → ACTOR/INSTITUTION → EVENT CLASS → EVIDENCE FUNCTION → SOURCE LINEAGE → CHANNEL → TEMPORAL COVERAGE → COVERAGE STATE`

## 4. Coverage dimensions

### 4.1 Topical coverage
Whether the source network monitors the relevant subject matter.

Examples:

- politics;
- elections;
- economics;
- regulation;
- courts;
- conflict;
- humanitarian affairs;
- climate;
- health;
- science;
- technology;
- cybersecurity;
- disinformation.

### 4.2 Geographic coverage
Whether relevant countries, regions, cities, territories, borders, maritime areas, and conflict zones are covered.

### 4.3 Institutional coverage
Whether relevant governments, courts, regulators, parliaments, international organisations, companies, scientific bodies, and civil-society institutions are monitored.

### 4.4 Event coverage
Whether the system can detect the event classes likely to matter in each domain.

### 4.5 Evidence coverage
Whether adequate primary, specialist, and independent corroboration exists for verification.

### 4.6 Temporal coverage
Whether sources update quickly enough and with sufficient historical depth for the editorial function.

### 4.7 Channel coverage
Whether important sources have resilient access through appropriate channels/endpoints.

## 5. Coverage states

- `FULL` — required functions have adequate coverage and independent evidence capacity.
- `STRONG` — good coverage with minor limitations.
- `PARTIAL` — material gaps exist.
- `WEAK` — important monitoring or verification functions are poorly covered.
- `BLIND_SPOT` — a consequential function has no adequate monitoring path.
- `UNKNOWN` — insufficient information to assess.

`UNKNOWN` is not coverage.

## 6. Gap taxonomy

### GAP-01 — TOPIC_GAP
A material topic lacks sufficient source coverage.

### GAP-02 — GEOGRAPHIC_GAP
A country, territory, region, or local area lacks adequate monitoring.

### GAP-03 — INSTITUTIONAL_GAP
A consequential institution or authority is not adequately monitored.

### GAP-04 — EVENT_CLASS_GAP
An event type has no suitable detection mechanism.

### GAP-05 — PRIMARY_EVIDENCE_GAP
Secondary reporting exists but adequate primary evidence is absent.

### GAP-06 — INDEPENDENCE_GAP
Coverage appears broad but relies on one underlying evidentiary lineage.

### GAP-07 — TEMPORAL_GAP
Monitoring is too slow, infrequent, or historically shallow for the editorial function.

### GAP-08 — CHANNEL_GAP
A source exists but access depends on a single fragile channel.

### GAP-09 — VERIFICATION_GAP
Detection exists but reliable verification cannot be completed.

### GAP-10 — LOCAL_SOURCE_GAP
International/secondary coverage exists but meaningful local primary observation is missing.

### GAP-11 — LANGUAGE_GAP
Relevant primary material is inaccessible or poorly monitored because of language limitations.

### GAP-12 — METHODOLOGY_GAP
No sufficiently comparable source exists after a methodological change.

### GAP-13 — ARCHIVAL_GAP
Historical material cannot be reliably reconstructed.

### GAP-14 — CONTINUITY_GAP
Existing coverage is vulnerable because independent fallback capacity is insufficient.

## 7. Detection coverage vs verification coverage

These must remain separate.

A source may provide excellent detection but poor verification.

Examples:

- social media can detect an emerging event but may not verify it;
- a news agency can rapidly detect a development but may rely on unnamed sources;
- a satellite system can provide excellent geographic evidence but not identify who caused damage;
- an official registry can verify a legal status but not necessarily explain its real-world consequences.

Therefore each function must record:

`DETECTION_CAPABILITY`
`VERIFICATION_CAPABILITY`

## 8. Coverage requirements by fact class

For every important editorial function define:

- what must be detected;
- what must be verified;
- minimum primary evidence;
- acceptable secondary evidence;
- minimum independent lineages;
- geographic scope;
- temporal tolerance;
- methodological requirements;
- fallback requirement.

## 9. Coverage assessment

Coverage assessment should consider:

- authority;
- directness;
- independence;
- geographic reach;
- temporal frequency;
- evidence type;
- accessibility;
- resilience;
- revision risk;
- provenance;
- verification capacity.

No single additive score should determine coverage.

## 10. Blind-spot detection

A blind spot exists when:

1. the editorial function is materially important;
2. a plausible event can occur within its scope;
3. no adequate detection path exists, or
4. detection exists but no adequate verification path exists;
5. independent fallback capacity is absent or insufficient.

A blind spot does not mean the event is occurring. It means the newsroom may fail to know or verify it.

## 11. Coverage matrix

The canonical matrix is:

| Dimension | Required | Available | Independent | Verified | Gap |
|---|---|---|---|---|---|
| Topic | yes/no | yes/no | yes/no | yes/no | calculated |
| Geography | yes/no | yes/no | yes/no | yes/no | calculated |
| Institution | yes/no | yes/no | yes/no | yes/no | calculated |
| Event class | yes/no | yes/no | yes/no | yes/no | calculated |
| Detection | yes/no | yes/no | yes/no | yes/no | calculated |
| Verification | yes/no | yes/no | yes/no | yes/no | calculated |
| Temporal | yes/no | yes/no | yes/no | yes/no | calculated |
| Continuity | yes/no | yes/no | yes/no | yes/no | calculated |

## 12. Priority of gaps

Gap urgency should depend on:

- public interest;
- potential impact;
- likelihood of relevant events;
- legal/regulatory significance;
- geographic importance;
- security/humanitarian implications;
- current editorial focus;
- absence of alternatives;
- time sensitivity.

Suggested states:

- `LOW`
- `MODERATE`
- `HIGH`
- `CRITICAL`

Gap priority is not evidence that an event exists.

## 13. Gap remediation

Possible remediation actions:

1. add primary institutional source;
2. add local source;
3. add specialist dataset;
4. add independent source lineage;
5. add alternate channel;
6. add alternate endpoint;
7. improve language coverage;
8. add historical archive;
9. establish manual monitoring;
10. establish verification procedure;
11. document a known limitation;
12. create a dedicated editorial radar.

## 14. Known-unknown register

Every material gap should be capable of being expressed explicitly as a known unknown:

- what cannot currently be detected;
- what cannot currently be verified;
- why the limitation exists;
- which source/function is missing;
- expected editorial consequence;
- mitigation available;
- owner;
- review date.

## 15. Coverage concentration

Track concentration by:

- source;
- lineage;
- institution;
- country;
- topic;
- language;
- channel;
- methodology.

High concentration indicates vulnerability even when nominal source counts are high.

## 16. Hard rules

### COV-01 — No source-count illusion
Number of sources cannot substitute for independent evidentiary coverage.

### COV-02 — Primary requirement
If the fact class requires primary evidence, secondary coverage cannot close the gap by itself.

### COV-03 — Detection ≠ verification
A detection path does not close a verification gap.

### COV-04 — Geography matters
Global sources do not automatically provide adequate local coverage.

### COV-05 — Institutional specificity
Monitoring a government generally does not guarantee monitoring every relevant ministry, court, regulator, parliament, or authority.

### COV-06 — Temporal fit
A source that updates too slowly for a time-sensitive event does not provide full coverage for that function.

### COV-07 — Independence
Multiple reports sharing one lineage count as one underlying evidence path.

### COV-08 — Unknown is explicit
Insufficient information must be recorded as `UNKNOWN`, not assumed covered.

### COV-09 — No silent gaps
Material gaps must be visible to editorial planning.

### COV-10 — Human governance
Closing a critical coverage gap requires documented human assessment.

## 17. Coverage and editorial planning

The engine should inform:

- radar creation;
- monitoring schedules;
- source acquisition;
- OSINT priorities;
- local reporting needs;
- specialist consultation;
- verification planning;
- editorial risk assessments.

It should not automatically determine what the newspaper publishes.

## 18. Coverage change propagation

Coverage should be re-evaluated after:

- source deprecation;
- source retraction;
- endpoint failure;
- major methodology change;
- geopolitical/institutional change;
- creation of a new jurisdiction/institution;
- emergence of a new event class;
- loss of independent lineage;
- material language/access change.

Canonical chain:

`SOURCE CHANGE → RESILIENCE IMPACT → COVERAGE REASSESSMENT → GAP ALERT → REMEDIATION → HUMAN REVIEW`

## 19. Core principle

> A coverage gap is not proof that something is happening. It is evidence that the newsroom's ability to detect or verify something may be insufficient.
