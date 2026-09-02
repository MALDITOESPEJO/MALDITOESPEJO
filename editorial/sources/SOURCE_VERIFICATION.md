# MALDITOESPEJO — SOURCE VERIFICATION

## Objective

Every registered source must have a transparent verification state. Registration is not the same thing as technical validation of every endpoint.

## Source verification dimensions

### Institutional verification
Confirms that the organization/source is real, identifiable and editorially relevant.

`SOURCE_VERIFIED = YES | NO | PENDING`

### Channel verification
Confirms that the specific channel exists and belongs to the source.

`CHANNEL_VERIFIED = YES | NO | PENDING`

### Endpoint verification
Confirms that the technical endpoint currently works and returns the expected content.

`ENDPOINT_VERIFIED = YES | NO | PENDING`

## Important rule

A verified institution does not imply that every RSS feed, API, catalogue endpoint or URL remains operational.

Therefore:

`SOURCE_VERIFIED = YES` + `CHANNEL_VERIFIED = PENDING`

is a valid and preferred state when the institution is established but the current endpoint has not been checked.

## Authority levels

- `A+` — primary/high-authority source for the relevant fact class.
- `A` — strong authoritative or specialist source.
- `B` — useful secondary/contextual source.
- `C` — background or low-authority discovery source.

Authority is contextual. A research institution may be A+ for its own dataset while a government ministry may be A+ for its own official decision.

## Secondary-source rule

Reuters, AP, AFP, EFE, FT, Bloomberg and comparable organizations are important discovery, breaking-news, cross-check and context sources. They do not replace the original primary document when one is available.

## Dataset rule

Every dataset should document, where available:

- methodology;
- coverage;
- temporal scope;
- geographic scope;
- revision policy;
- known limitations;
- update frequency;
- access method;
- citation requirements.

## Independence rule

Different feeds, URLs or editions from the same institution are not independent corroboration.

## Conflict rule

If two credible sources disagree, preserve both records and create `EDITORIAL_CONFLICT_ALERT`. Never resolve the disagreement merely by choosing the source with the more familiar brand.

## Review cadence

High-value technical endpoints should be periodically rechecked. Broken, redirected, deprecated or materially changed endpoints must be marked accordingly rather than silently replaced.
