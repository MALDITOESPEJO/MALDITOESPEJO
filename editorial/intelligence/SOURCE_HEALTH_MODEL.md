# SOURCE HEALTH MODEL

## Purpose

The Source Health Model monitors the operational and evidentiary condition of each source without reducing editorial reliability to a single numerical score.

A source can be authoritative yet technically unstable, highly accessible yet weak for a particular fact class, or historically reliable while undergoing a methodology change. These dimensions must remain separate.

## 1. Health dimensions

| Dimension | Values | Meaning |
|---|---|---|
| `AUTHORITY_HEALTH` | A+ / A / B / C / UNKNOWN | Authority for the relevant proposition. |
| `AVAILABILITY_HEALTH` | HEALTHY / DEGRADED / UNAVAILABLE / UNKNOWN | Whether the source can currently be accessed. |
| `UPDATE_HEALTH` | CURRENT / DELAYED / STALE / UNKNOWN | Whether expected updates are occurring. |
| `ENDPOINT_HEALTH` | VERIFIED / DEGRADED / FAILED / DEPRECATED / PENDING | Technical endpoint condition. |
| `PROVENANCE_HEALTH` | INTACT / UNCERTAIN / COMPROMISED / UNKNOWN | Confidence in origin and lineage. |
| `INTEGRITY_HEALTH` | INTACT / CHANGED / CORRUPTED / UNKNOWN | Integrity of acquired material. |
| `REVISION_HEALTH` | STABLE / REVISED / FREQUENTLY_REVISED / UNKNOWN | Revision behaviour relevant to downstream use. |
| `METHODOLOGY_HEALTH` | STABLE / CHANGED / UNDER_REVIEW / UNKNOWN | Whether methodology has changed materially. |
| `ACCESS_RISK` | LOW / MEDIUM / HIGH / CRITICAL | Risk of losing practical access to evidence. |

## 2. No single reliability score

MALDITOESPEJO must not collapse these dimensions into a single `SOURCE_RELIABILITY_SCORE`.

A numerical score can conceal critical distinctions. For example:

- an authoritative court may have excellent evidentiary authority but no machine-readable endpoint;
- a government API may be technically excellent but unsuitable for proving an individual allegation;
- a dataset may be authoritative but revised regularly;
- a social platform may be accessible while provenance remains uncertain.

## 3. Health states

### HEALTHY
No material operational or evidentiary issue is currently known.

### WATCH
A non-critical anomaly exists and should be monitored.

### DEGRADED
A material operational, provenance, integrity or methodology issue exists.

### CRITICAL
A condition may materially compromise downstream editorial work and requires investigation.

### UNKNOWN
Insufficient information exists to assess the relevant dimension.

`UNKNOWN` is not equivalent to `HEALTHY`.

## 4. Events that change source health

The system should record:

- endpoint failure;
- endpoint restoration;
- delayed scheduled release;
- missed expected release;
- source correction;
- retraction;
- dataset revision;
- methodology change;
- source ownership or publisher change;
- domain or URL migration;
- certificate or access issue where operationally relevant;
- provenance challenge;
- integrity anomaly;
- archive failure;
- publication frequency change;
- feed format change;
- API version change;
- source deprecation.

## 5. Temporal health

Health must be time-indexed.

A source may be healthy today and degraded yesterday. Historical editorial decisions must use the health state applicable at the relevant acquisition or publication time.

Minimum temporal fields:

- `observed_at`;
- `effective_from`;
- `effective_to` where known;
- `detected_at`;
- `resolved_at` where applicable.

## 6. Source health versus editorial trust

Source health is not a political, ideological or reputational ranking.

It must not be used to label organisations as inherently trustworthy or untrustworthy.

The correct question is:

**Is this source currently fit for this evidentiary function, in this context, at this time?**

## 7. Impact propagation

When a material health event occurs:

`SOURCE HEALTH EVENT → CHANNEL/ENDPOINT IMPACT → EVIDENCE IMPACT → CASE IMPACT → DECISION REVIEW`

The system should identify dependent evidence packs and cases where practical.

## 8. Human review triggers

Mandatory editorial review should be considered when:

- provenance becomes uncertain;
- integrity becomes compromised;
- a source retracts material content;
- a material methodology change affects a published statistic;
- a primary dataset is substantially revised;
- an endpoint serves materially different data without explanation;
- an evidence lineage becomes unavailable during a consequential investigation.

## 9. Health history

Health changes must be append-only in the audit layer where feasible.

Do not silently overwrite historical health states.

The record should preserve:

`previous_state → event → new_state → actor/system → timestamp → reason → affected objects`

## 10. Editorial principle

`SOURCE HEALTH ≠ TRUTH`

`SOURCE HEALTH ≠ POLITICAL RELIABILITY`

`SOURCE HEALTH = OPERATIONAL + PROVENANCE + INTEGRITY + UPDATE + METHODOLOGY CONTEXT`

The final evidentiary judgment remains human and proposition-specific.
