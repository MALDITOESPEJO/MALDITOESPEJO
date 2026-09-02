# MALDITOESPEJO — FEED MONITORING AND TEMPORAL INTEGRITY POLICY

## 1. Objective

The feed layer converts identified editorial resources into monitorable objects. Every monitored resource must preserve enough temporal information to reconstruct what was known, when it was published, when it became effective and whether it was later revised.

## 2. Mandatory timestamps

Where available, store separately:

- `detected_at` — when MALDITOESPEJO detected the resource/change.
- `published_at` — when the institution published it.
- `updated_at` — when the resource was updated.
- `effective_at` — when the decision/alert/data became effective.
- `expires_at` — when validity ends.
- `reference_at` — period/date to which the observation refers.
- `acquired_at` — acquisition time for imagery or observational data.
- `verified_at` — time editorial verification was completed.

These timestamps must never be silently collapsed into one generic date.

## 3. Revisions

A revised statistical observation, dataset, alert or institutional document is a new state of the resource. The system should preserve the prior state whenever technically feasible.

Editorial interpretation must distinguish:

`INITIAL_PUBLICATION → REVISION → CURRENT_STATE`

A later revision does not erase the historical fact that an earlier version existed.

## 4. Scheduled resources

For resources with predictable publication cycles, the catalogue may contain:

- expected interval;
- expected release window;
- last observed release;
- next expected release;
- delay threshold;
- missed-release status.

An expected release is a monitoring expectation, not evidence that the underlying event occurred.

## 5. Event-driven resources

For CAP alerts, security alerts, sanctions updates, outbreak notices and similar feeds, monitoring should react to:

- new identifier;
- update;
- cancellation;
- expiry;
- geographic change;
- severity change;
- affected population change;
- status change.

## 6. Dataset integrity

Every data observation used editorially should retain, where available:

`dataset_id`
`dataset_version`
`series_id`
`observation_period`
`unit`
`methodology_version`
`extraction_timestamp`
`revision_status`
`source_url`

## 7. Snapshot principle

An API query is a snapshot of a resource at a particular time. The same query performed later may return different results. Therefore the system should preserve query timestamp and, where feasible, response/version identifiers.

## 8. Editorial consequence

A later publication may not be used to retroactively imply that information was available earlier unless the earlier resource actually contained it.

This is essential for accurate chronology, breaking-news reconstruction and accountability.

## 9. Monitoring states

Recommended operational states:

`ACTIVE`
`UPDATED`
`STALE`
`DELAYED`
`FAILED`
`CANCELLED`
`EXPIRED`
`DEPRECATED`
`PAUSED`

These are monitoring states, not truth classifications.

## 10. Final rule

**The system must preserve the temporal history of evidence rather than only its latest version.**
