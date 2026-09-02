# EDITORIAL SOURCE ACQUISITION & EXPANSION ENGINE

## 1. Purpose

The Editorial Source Acquisition & Expansion Engine (ESAE) converts identified coverage, resilience, verification, and dependency gaps into a controlled process for discovering, evaluating, testing, approving, and integrating new sources.

It prevents source acquisition from becoming an uncontrolled accumulation of URLs.

The objective is:

`GAP → SOURCE CANDIDATE → EVALUATION → INDEPENDENCE TEST → TECHNICAL VALIDATION → EDITORIAL APPROVAL → REGISTRY INTEGRATION → MONITORING`

## 2. Acquisition principles

1. Acquire sources to satisfy an identified editorial function.
2. Prefer primary evidence where the fact class requires it.
3. Prefer genuinely independent lineages over additional repetitions.
4. Validate technical access separately from editorial authority.
5. Preserve provenance from discovery through production.
6. Record rejected candidates and the reason for rejection.
7. Do not equate institutional prestige with fitness for every fact class.
8. Do not integrate a source merely because it is popular or frequently cited.

## 3. Source candidate lifecycle

`DISCOVERED → TRIAGED → EVALUATING → TESTING → APPROVED / REJECTED / DEFERRED → INTEGRATED → MONITORED`

An integrated source remains subject to health, change, resilience, and coverage monitoring.

## 4. Acquisition triggers

A source candidate may be created because of:

- `TOPIC_GAP`
- `GEOGRAPHIC_GAP`
- `INSTITUTIONAL_GAP`
- `EVENT_CLASS_GAP`
- `PRIMARY_EVIDENCE_GAP`
- `INDEPENDENCE_GAP`
- `TEMPORAL_GAP`
- `CHANNEL_GAP`
- `VERIFICATION_GAP`
- `LOCAL_SOURCE_GAP`
- `LANGUAGE_GAP`
- `METHODOLOGY_GAP`
- `ARCHIVAL_GAP`
- `CONTINUITY_GAP`
- new editorial radar;
- emerging institution;
- new dataset;
- source change affecting existing coverage.

## 5. Candidate identity

Every candidate should record:

- candidate ID;
- proposed source name;
- publisher/owner;
- jurisdiction;
- topic/domain;
- intended editorial function;
- proposed evidence class;
- discovery path;
- canonical URL or locator;
- candidate lineage;
- related gap ID;
- date discovered;
- evaluator.

## 6. Evaluation dimensions

### Authority
Is the source authoritative for the specific fact class?

### Directness
Does it directly observe, publish, document, or measure the relevant phenomenon?

### Independence
Can it provide evidence independently of existing lineages?

### Coverage
Does it address the missing topic, geography, institution, event class, or evidence function?

### Temporal fitness
Does its update frequency and historical depth fit the editorial requirement?

### Methodology
Are definitions, collection methods, sampling, classifications, and revisions sufficiently documented?

### Provenance
Can the origin and chain of evidence be reconstructed?

### Accessibility
Can the newsroom reliably obtain the material under expected operational conditions?

### Resilience contribution
Does it reduce a critical dependency or merely add another copy of an existing lineage?

### Integrity
Can the retrieved material be preserved and audited?

## 7. Candidate classes

### PRIMARY_AUTHORITATIVE
Official or otherwise authoritative original evidence.

### PRIMARY_OBSERVATIONAL
Direct observation or measurement.

### SPECIALIST_DATA
Qualified specialist dataset or research resource.

### LOCAL_PRIMARY
Local first-hand or institutional source with relevant geographic specificity.

### INDEPENDENT_SECONDARY
Secondary source capable of materially independent corroboration.

### DISCOVERY_SOURCE
Useful primarily for finding leads.

The class must not be inferred solely from reputation.

## 8. Independence test

Before approving a candidate as an independent lineage, determine:

1. Does it rely on the same original document?
2. Does it reproduce the same agency dispatch?
3. Does it use the same dataset?
4. Does it rely on the same witness/source?
5. Does it reproduce the same imagery or media?
6. Does it share a common parent feed?
7. Does it independently collect or observe the relevant fact?

If the underlying evidence is shared, record `SAME_LINEAGE_AS` rather than `INDEPENDENT_OF`.

## 9. Technical validation

Technical validation is separate from editorial approval.

Check, as applicable:

- URL availability;
- endpoint behaviour;
- response format;
- authentication;
- rate limits;
- update pattern;
- versioning;
- identifiers;
- archive access;
- timestamp fields;
- reproducibility;
- data extraction integrity.

A technically functional source can still be rejected editorially.

## 10. Editorial fitness test

A candidate should answer:

> What editorial question can this source answer that our existing network cannot answer adequately?

If the answer is unclear, acquisition should normally be deferred.

## 11. Approval states

- `APPROVED_PRODUCTION`
- `APPROVED_MONITORING`
- `PILOT`
- `DEFERRED`
- `REJECTED`
- `DUPLICATE_LINEAGE`
- `INSUFFICIENT_AUTHORITY`
- `INSUFFICIENT_PROVENANCE`
- `TECHNICAL_FAILURE`

## 12. Acquisition priority

Suggested priorities:

### CRITICAL
Closes a consequential blind spot or restores a failed critical function.

### HIGH
Adds an independent primary or strong specialist lineage to a material gap.

### MODERATE
Meaningfully improves topical, geographic, institutional, or temporal coverage.

### LOW
Useful contextual improvement without material current gap reduction.

Priority reflects editorial need, not source truth or prestige.

## 13. Cost and complexity

Where relevant record:

- access cost;
- licensing restrictions;
- authentication burden;
- extraction complexity;
- maintenance burden;
- language burden;
- legal/usage constraints;
- archival burden.

A technically expensive source may still be justified if it closes a critical evidence gap.

## 14. Acquisition decision

The acquisition decision must document:

- gap addressed;
- proposed function;
- authority assessment;
- independence assessment;
- methodology assessment;
- technical validation;
- resilience benefit;
- limitations;
- priority;
- decision actor;
- date;
- follow-up review date.

## 15. Integration requirements

Approved production sources must be mapped into the canonical architecture:

`SOURCE → CHANNEL → ENDPOINT → FEED → EVIDENCE/OBSERVATION → VERIFICATION → SIGNAL`

They must receive stable identifiers and be entered into the relevant registries.

Production integration must not bypass verification status requirements.

## 16. Rejection rules

Reject or defer when:

- the source cannot establish adequate provenance;
- authority is materially insufficient for the intended function;
- the candidate duplicates an existing lineage without meaningful additional capability;
- methodology is too opaque for the intended use;
- technical behaviour cannot be reproduced adequately;
- access conditions make continuity unrealistic;
- the source presents material integrity concerns;
- the proposed editorial function is already adequately covered.

Rejection is function-specific: a source rejected for verification may still be useful for discovery.

## 17. Acquisition and source health

Newly acquired sources begin with explicit technical states. Never assume:

`NEW SOURCE = HEALTHY`

Health must be established through observation.

## 18. Acquisition and resilience

A source only meaningfully improves resilience if it provides:

- an independent lineage;
- a distinct observation capability;
- a distinct authoritative record;
- a distinct technical route;
- or a meaningful combination of these.

A second URL for the same underlying dataset may improve operational redundancy but not evidentiary independence.

## 19. Acquisition and coverage

After integration, the affected coverage gap must be reassessed.

Possible outcomes:

- gap closed;
- gap reduced;
- gap unchanged;
- new limitation identified;
- false gap confirmed;
- further acquisition required.

No gap should be marked closed merely because a candidate was added.

## 20. Human approval gate

Final production acquisition remains:

`CANDIDATE → EVALUATION → VALIDATION → HUMAN APPROVAL → REGISTRY → MONITORING`

Automation may discover and test candidates, but it must not silently expand the production source network.

## 21. Core principle

> Acquire sources to close demonstrable editorial gaps, not to make the registry look larger.
