# MALDITOESPEJO — ENDPOINT VERIFICATION REGISTER

## Purpose

This register controls whether a technical endpoint may be used operationally by the editorial monitoring system.

Institutional verification and technical verification are separate dimensions.

## Status model

- `VERIFIED`: endpoint has been technically checked and is suitable for the documented access pattern.
- `PENDING`: endpoint is identified but has not yet been technically validated.
- `FAILED`: endpoint was tested and did not meet the expected behavior.
- `DEPRECATED`: endpoint has been replaced, withdrawn or is no longer recommended.

## Production gate

An endpoint must not be treated as production-ready solely because its institution is authoritative.

Minimum production condition:

`SOURCE_VERIFIED = YES`
`CHANNEL_VERIFIED = YES`
`ENDPOINT_VERIFIED = YES`

Where an endpoint remains `PENDING`, it may remain in the registry for research and implementation planning, but it must not be represented as technically verified.

## Required verification checks

1. URL or endpoint identity confirmed.
2. Transport protocol confirmed.
3. Expected response format confirmed.
4. Authentication requirement documented.
5. Rate limits documented where applicable.
6. Update behavior documented.
7. Pagination/versioning documented where applicable.
8. Timestamp semantics documented.
9. Dataset/resource identity confirmed.
10. Failure behavior recorded.
11. Last successful verification timestamp recorded.
12. Evidence of verification retained.

## Special cases

### APIs

Verify request pattern, response schema, authentication, pagination, rate limits and versioning.

### SDMX

Verify agency, dataflow, version, structure and time-series semantics. Do not assume SDMX 2.1 and SDMX 3.0 endpoints are interchangeable.

### RSS / feeds

Verify feed URL, XML validity, item timestamps, publication/update semantics and duplicate behavior.

### CAP alerts

Verify alert identifier, sender, effective/expiry times, event type, geographic scope and update/cancellation semantics.

### Datasets

Verify dataset title, version, methodology, reference period, revision policy and download/query mechanism.

### Satellite

Verify catalogue/resource identifiers, acquisition timestamps, product level and processing status.

### Aviation / maritime

Record whether observations are real-time, historical or derived. Tracking data is observational evidence and does not by itself establish the reason for an aircraft/vessel movement.

### Verification tools

Tools such as reverse-image search, metadata inspection and geolocation services are evidence aids. Their output requires editorial interpretation and should not be treated as an authoritative fact automatically.

## Independence warning

Two technically different endpoints can still derive from the same institutional source. Technical independence is not evidentiary independence.

## Audit fields

Future operational records should include:

`endpoint_id`
`verification_status`
`verified_at`
`verified_by`
`test_method`
`response_type`
`schema_version`
`last_success`
`failure_count`
`evidence_reference`
`notes`

## Editorial rule

**No endpoint is considered verified merely because it appears in the master registry.**
