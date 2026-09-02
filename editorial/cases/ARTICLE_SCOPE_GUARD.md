# Article Scope Guard

## Purpose

Prevent the generated article from introducing factual assertions outside the verified publishable scope of its case.

## Core rule

> El artículo no puede decir más de lo que permite el alcance verificado.

## Guarded elements

The guard applies to:

- headline;
- dek/description;
- facts section;
- statements and attributions;
- context presented as factual background;
- numerical claims;
- conclusions derived from verified claims.

## Traceability

Every factual article claim must reference one or more approved `claim_id` values. A sentence may combine several claims, but every material factual component must have documentary support.

## Forbidden leakage

The guard must reject or flag:

- excluded claims appearing as facts;
- pending or contested claims presented as established;
- blocked central claims leaking into headline or dek;
- unsupported numbers;
- unsupported causal conclusions;
- conclusions whose dependencies are outside scope;
- source claims that have become superseded or require recheck.

## Public uncertainty

An excluded claim may appear only as an explicitly unresolved matter when editorially useful. The wording must preserve uncertainty and must not imply verification.

## Originality boundary

The scope guard does not determine whether prose is original. It verifies that the content stays inside the documentary scope. Originality is handled by the originality engine.

## Result states

- `PASS`
- `PASS_WITH_UNRESOLVED_CONTEXT`
- `BLOCKED_OUT_OF_SCOPE`
- `BLOCKED_UNSUPPORTED_CLAIM`
- `REVIEW_REQUIRED`

## Fail-safe

If the guard cannot establish that a material factual statement belongs to the approved scope, the article cannot advance automatically.

Preferred outcome:

`NO PUBLICAR TODAVÍA`

## Plain-language rule

Internal traceability can be technical. The reader should receive a clear article, not an explanation of the machinery behind it.

> **La investigación puede ser compleja; la explicación no debe serlo.**
