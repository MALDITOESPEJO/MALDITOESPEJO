# MALDITOESPEJO — Feed Lifecycle and Update Policy

## 1. Purpose

This policy defines how MALDITOESPEJO monitors feeds, datasets, APIs, calendars, alerts and document streams without confusing publication timing, reference periods, effective dates or revisions.

## 2. Canonical chain

`SOURCE → CHANNEL → ENDPOINT → FEED/DATASET → OBSERVATION → EVENT/CLAIM → SIGNAL`

A feed is a monitored resource. It is not itself an editorial conclusion.

## 3. Temporal fields

Every monitored resource should preserve, where available:

- `detected_at`
- `published_at`
- `updated_at`
- `effective_at`
- `valid_from`
- `valid_to`
- `reference_period`
- `acquisition_time`
- `revision_time`
- `supersedes_id`

These dates must never be collapsed into one generic date.

## 4. Update classes

### REAL_TIME
Use for alerts and continuously changing observations. Examples: CAP alerts and selected aviation observations.

### SCHEDULED
Use for calendars and predictable releases. A scheduled release creates an early-warning signal, not evidence of the result.

### PERIODIC
Use for monthly, quarterly or annual datasets.

### IRREGULAR
Use for reports, legal decisions, fact checks and institutional publications.

### ON_DEMAND
Use for APIs and analytical tools queried when an editorial investigation requires them.

## 5. Revisions

A revised dataset must not silently overwrite the prior observation when the change is editorially material.

Minimum lineage:

`CURRENT_VERSION → PREVIOUS_VERSION → ORIGINAL_RELEASE`

Where possible preserve:

- dataset version;
- extraction timestamp;
- original publication timestamp;
- revision timestamp;
- changed variables;
- methodology changes;
- status of the prior value.

## 6. Alerts

An alert has a lifecycle:

`ISSUED → UPDATED → EXTENDED/CANCELLED/EXPIRED`

The system must not treat an expired or cancelled alert as a current warning.

For CAP-compatible alerts preserve:

- issuing authority;
- identifier;
- sent time;
- effective time;
- onset;
- expiry;
- severity;
- certainty;
- urgency;
- affected area;
- update/cancellation relationship.

## 7. Statistical data

For every important observation retain:

`VALUE + UNIT + INDICATOR + REFERENCE_PERIOD + RELEASE_DATE + SOURCE_VERSION + METHODOLOGY`

A later publication does not necessarily describe a later reference period.

## 8. API observations

API-derived evidence must record:

- endpoint;
- query parameters;
- query timestamp;
- response/version identifier where available;
- filters;
- geographic scope;
- temporal scope;
- extraction method;
- verification status.

A dynamic API result is an observation at a particular time, not an immutable document.

## 9. Aggregators

Aggregators are discovery mechanisms unless they are themselves the authoritative issuer of the relevant evidence.

For example, a humanitarian report surfaced through an aggregator must retain the original issuing organization as the evidence source.

## 10. Editorial update triggers

A feed update can create a signal when it produces one or more of:

- a new official document;
- a material numerical revision;
- a threshold crossing;
- a new alert;
- a new legal effect;
- a new election result;
- a newly exploited vulnerability;
- a material conflict event;
- a new damage assessment;
- a meaningful contradiction with an existing signal.

Routine technical refreshes without editorial materiality should not generate publication signals.

## 11. De-duplication

The same underlying release appearing through RSS, API, webpage and email must receive one canonical resource identity and multiple delivery-channel references.

Do not create multiple events merely because one institution distributes the same information through several channels.

## 12. Failure handling

If a feed fails:

`ACTIVE → DEGRADED → FAILED → RECOVERED`

Failure of a technical endpoint does not mean failure of the institution as a source.

When an endpoint is unavailable, the system should record the outage and use an approved alternative channel where possible.

## 13. Human editorial gate

No automated update may become a published fact solely because a feed changed.

The final chain remains:

`UPDATE → SIGNAL → CORRELATION → VERIFICATION → PRIORITY → HUMAN EDITOR → PUBLICATION`

## 14. Core rule

**Monitor continuously, preserve temporal context, preserve revisions, distinguish delivery from evidence, and never confuse an update with a fact.**
