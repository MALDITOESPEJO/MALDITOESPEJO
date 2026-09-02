# MALDITOESPEJO — ARTICLE METADATA VALIDATION

## Purpose

This specification defines the minimum editorial validation that every news article must pass before publication.

The validation checks **editorial coherence**, not the truth of the underlying story. Truth and evidentiary sufficiency remain subject to the verification chain and human editorial review.

## Required metadata

Every article intended for publication must contain:

- `title`
- `description`
- `date`
- `section`
- `author`
- `type`
- `status`

## Section–author consistency

The ordinary author is determined by the article section:

| Section | Ordinary author |
|---|---|
| Actualidad | Clara Valdés Moreno |
| Política | Álvaro Serrano Vidal |
| Economía | Marta Robles Ferrer |
| Sociedad | Elena Campos Navarro |
| Mundo | Daniel Ortega Salvat |
| Tecnología | Lucía Martín Vega |

If `section` and `author` do not match, the article must not move to `published` unless an editorial exception has been explicitly documented.

## Status gate

Suggested editorial states:

`draft → review → verified → published`

An article cannot be treated as verified merely because its metadata is valid.

Metadata validation answers:

> “Is this article structurally ready to enter the editorial workflow?”

It does not answer:

> “Is everything in this article true?”

## Publication gate

Before `published`, the article must have:

1. valid required metadata;
2. a valid section–author assignment or documented exception;
3. completed verification according to the verification chain;
4. publication sources that actually support the published assertions;
5. no unresolved contradiction that materially affects the headline or central claim;
6. human editorial approval.

## Plain-language gate

The public article must distinguish, in ordinary language:

- what is established;
- what someone has said;
- what is context;
- what remains unknown or pending.

Technical internal labels must not be exposed merely because they exist in the editorial system.

**La investigación puede ser compleja; la explicación no debe serlo.**

## Golden Article test

The employment article of 2 September 2026 is the reference test case for this validation model. Its section is `Economía` and its ordinary author is `Marta Robles Ferrer`.

The test must verify that the article can be traced from its public metadata into the relevant editorial and verification records without relying on undocumented assumptions.
