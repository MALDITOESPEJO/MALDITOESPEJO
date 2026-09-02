# WEB EVIDENCE ENGINE — MALDITOESPEJO

## 1. Purpose

The Web Evidence Engine converts a research plan into documented evidence candidates without treating search results as proof.

`RESEARCH PLAN → SEARCH → CANDIDATE SOURCE → DOCUMENT → EVIDENCE → PROVENANCE`

## 2. Editorial rule

A search result is a lead, not evidence.

A webpage becomes usable evidence only after the system has identified, where possible:

- who published it;
- what the document or record is;
- publication date;
- relevant passage or data;
- source role;
- provenance;
- whether it directly supports the claim;
- whether another source shares the same origin.

## 3. Source priority

For each claim, search in this order:

1. primary official source;
2. original document or record;
3. direct statement by the relevant person or institution;
4. official data or registry;
5. independent corroboration;
6. specialist context;
7. secondary media for discovery or cross-checking.

## 4. Search strategy

The engine should generate several searches for each important claim, including:

- exact claim terms;
- names, dates and places;
- likely official institution;
- document/report/statement variants;
- correction/update variants where relevant.

Searches should be broad enough to find the original source but narrow enough to avoid treating unrelated results as evidence.

## 5. Evidence extraction

For every accepted evidence item, preserve:

`evidence_id`
`claim_id`
`source_id`
`source_role`
`url_or_reference`
`document_or_record`
`published_at`
`observed_at`
`relevant_excerpt_or_data`
`lineage_id`
`independence_group`
`relationship_type`
`assessment`

The system must preserve the original evidence reference rather than only storing a search-result URL.

## 6. Provenance

The engine must distinguish:

`ORIGINAL`
`REPRODUCES`
`QUOTES`
`DERIVED_FROM`
`AGGREGATES`
`ENRICHES`
`INDEPENDENT_OBSERVATION`
`UNKNOWN_PROVENANCE`

Multiple websites carrying the same agency copy or official statement do not become independent evidence merely because their URLs differ.

## 7. Temporal control

The engine must record the date of the evidence and detect newer versions, updates and corrections.

A material correction must trigger re-evaluation of dependent claims.

## 8. Contradiction control

If credible sources disagree, the engine records the disagreement instead of selecting the most convenient result.

Possible outcomes:

`SUPPORTED`
`PARTIALLY_SUPPORTED`
`CONTESTED`
`INSUFFICIENT`
`PENDING`

A material unresolved conflict prevents that claim from being presented as an established fact.

## 9. Discovery versus publication

A media article supplied by the editor may start the investigation. It does not automatically become a public source.

The public article should normally cite the underlying evidence that MALDITOESPEJO actually examined and used.

## 10. Automation boundary

The engine can automate search, retrieval, extraction, deduplication and documentary checks.

It cannot guarantee that a source is truthful merely because it is official, nor can it decide every question of substantive independence or interpretation.

Those decisions remain subject to editorial review.

## 11. Fail-safe rule

If no adequate documentary evidence is found:

> **NO PUBLICAR TODAVÍA**

The system may leave the claim as `PENDING`, `UNKNOWN` or `RECHECK_REQUIRED` rather than inventing support.

## 12. Final principle

> **Buscar no es verificar. Encontrar una página no es demostrar una afirmación.**

The Web Evidence Engine exists to turn research into documentary evidence that the rest of the MALDITOESPEJO pipeline can audit.
