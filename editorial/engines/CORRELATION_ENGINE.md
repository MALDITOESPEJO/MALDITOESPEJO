# MALDITOESPEJO — CORRELATION ENGINE

## Purpose

The Correlation Engine connects independent evidence streams to detect developments that are larger than any single source signal.

## Evidence graph

`SOURCE → CHANNEL → OBSERVATION → EVENT/CLAIM → CORROBORATION → SIGNAL`

## Independence

Corroboration requires genuine source independence. Ten publications repeating the same agency dispatch count as one underlying information lineage, not ten independent confirmations.

## Correlation classes

### Humanitarian pressure

Possible inputs:
- conflict events;
- fatalities;
- displacement;
- food insecurity;
- health alerts;
- infrastructure damage;
- humanitarian access.

Output: `HUMANITARIAN_PRESSURE_SIGNAL`

### Active cyber exploitation

Possible chain:

`CVE → NVD severity/context → CISA KEV exploitation evidence → vendor/security advisory`

Output: `ACTIVE_EXPLOITATION`

Default priority: A+ when exploitation is credibly established and materially relevant.

### Election confirmation

Possible chain:

`electoral authority → preliminary result → recount/challenge → certification`

Output changes authority state as the process advances; preliminary information is never silently upgraded to certified.

### Conflict corroboration

Possible inputs:
- official statements;
- ACLED/UCDP datasets;
- OCHA/ReliefWeb humanitarian reporting;
- satellite imagery;
- OSINT;
- aviation/AIS observations;
- qualified news agencies.

### Damage corroboration

Possible chain:

`image/video → geolocation → object/building identification → before/after evidence → satellite → date range → independent evidence`

Output:
- `VERIFIED`
- `PARTIALLY_VERIFIED`
- `UNVERIFIED`
- `CONTRADICTED`
- `MANIPULATED`

## Contradiction handling

If two authoritative sources disagree, create `EDITORIAL_CONFLICT_ALERT`. The system records:

- source authority;
- publication time;
- evidence type;
- exact point of disagreement;
- current verification status;
- responsible human review.

The engine must preserve uncertainty rather than manufacture consensus.
