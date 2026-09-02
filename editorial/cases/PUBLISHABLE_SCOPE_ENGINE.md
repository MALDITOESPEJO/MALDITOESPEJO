# Publishable Scope Engine

## Purpose

Determine exactly which verified claims may enter a MALDITOESPEJO article when an investigation is fully or partially verified.

## Core principle

> La unidad de publicación es la afirmación, no el caso completo.

A case may contain verified, pending, contested and insufficient claims at the same time. Only claims that satisfy the verification rules may be presented as verified facts.

## Flow

`CASE → CLAIMS → VERIFICATION → DEPENDENCIES → SCOPE CANDIDATES → SCOPE GUARD → ARTICLE`

## Scope rules

A claim is a candidate for publication only when:

1. its verification status is `VERIFIED`;
2. its required evidence is documented;
3. it has no unresolved material contradiction;
4. required dependencies are also verified;
5. it is not superseded by newer evidence;
6. its temporal requirements are satisfied;
7. its wording does not exceed what the evidence supports.

## Exclusions

The scope must exclude claims with:

- `INSUFFICIENT`;
- `RECHECK_REQUIRED`;
- `CONTESTED`;
- `PENDING`;
- `UNKNOWN`;
- unresolved material dependency;
- stale or superseded evidence where currentness is required.

## Central-claim protection

A verified secondary claim does not automatically replace a blocked central claim. The system must evaluate whether the verified subset forms a coherent news item on its own.

If not, the case remains blocked for publication even if isolated claims are verified.

## Headline and dek

The headline and dek must be constructed only from claims explicitly inside the approved publishable scope.

A blocked central claim must never leak into the headline, dek, social copy or image brief as an established fact.

## Dependencies

If a publishable claim depends on another claim, the dependency must satisfy the verification requirements. Uncertainty propagates through dependencies.

## Public treatment of open questions

An excluded claim may be mentioned as unresolved only when doing so is useful and the wording clearly preserves its uncertainty. It must never be presented as a verified fact.

## Human review

The engine proposes scope. Human editorial review remains mandatory, particularly when:

- the central claim is blocked;
- a partial scope changes the story's meaning;
- an unresolved claim materially affects reader interpretation;
- a verified subset is being used to construct a new angle.

## Output

The engine produces:

- `publishable_scope.status`;
- `claim_ids` included;
- `excluded_claim_ids`;
- reasons for exclusions;
- central-claim status;
- coherence status;
- recommendation for editorial review.

## Fail-safe

If there is doubt about whether the verified subset constitutes a coherent and non-misleading story:

`NO PUBLICAR TODAVÍA`

The engine must prefer a narrower article or continued investigation over an article whose framing implies more certainty than the evidence permits.

## Plain-language rule

The internal scope model may be technical. The public article must remain clear and must tell readers only what the available evidence allows us to say.

> **La investigación puede ser compleja; la explicación no debe serlo.**
