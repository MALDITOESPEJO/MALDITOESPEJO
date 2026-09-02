# MALDITOESPEJO — SIGNAL ENGINE

## Mission

The Signal Engine converts detected source activity into structured editorial signals. It separates raw detection from editorial importance.

## Signal generation modes

- `NEW_PUBLICATION`
- `DATA_UPDATE`
- `THRESHOLD_CROSSING`
- `SCHEDULED_RELEASE`
- `REGULATORY_ACTION`
- `DOCUMENT_PUBLISHED`
- `MARKET_EVENT`
- `SECURITY_ALERT`
- `EXECUTIVE_ACTION`

## Core signal object

Each signal should contain, where available:

- `signal_id`
- `timestamp_detected`
- `source_id`
- `channel_id`
- `signal_type`
- `event_id`
- `claim_id`
- `jurisdiction`
- `topic`
- `summary`
- `evidence_url`
- `publication_timestamp`
- `effective_timestamp`
- `authority_level`
- `verification_status`
- `corroboration_count`
- `editorial_priority`
- `human_review_required`

## Event versus signal

An institutional publication is an event. The editorial signal is the system's interpretation that the event may matter to MALDITOESPEJO readers.

Example:

`OFFICIAL_JUDGMENT_PUBLISHED` → event

`JUDGMENT_MAY_CHANGE_NATIONAL_AI_LIABILITY_LANDSCAPE` → editorial signal

## Signal quality

A signal becomes stronger when:

1. the source has high authority;
2. the evidence is primary;
3. the event is recent or newly effective;
4. independent sources corroborate it;
5. the consequence is material;
6. the signal survives contradiction checks.

## Cross-source signals

The engine supports correlation without treating every source as independent evidence.

Examples:

- UNHCR + FAO + WMO → `HUMANITARIAN_PRESSURE`
- CVE + high NVD severity + CISA KEV → `ACTIVE_EXPLOITATION`
- official election authority + certification → `ELECTION_RESULT_CONFIRMED`
- satellite damage + geolocation + independent reporting → `DAMAGE_CORROBORATED`

## Human gate

No signal is automatically equivalent to a publishable fact. High-impact signals must enter human editorial review.
