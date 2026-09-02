# AUTOMATED NEWS PIPELINE — MALDITOESPEJO

## 1. Objective

Provide a single entry point for transforming a news lead, URL, document or statement into an original article prepared for human editorial review.

The pipeline automates process orchestration. It does not invent evidence, certify truth, or replace the final editorial decision.

## 2. Canonical flow

`INPUT → CASE → CLAIMS → RESEARCH PLAN → EVIDENCE → PROVENANCE → CONTRAST → VERIFICATION → ORIGINAL ARTICLE → TRACEABILITY → EDITORIAL REVIEW → PUBLICATION GATE`

## 3. Single-command principle

The editor should not need to remember the order of individual engines.

The orchestration layer must:

1. create or load a case;
2. decompose the input into claims;
3. prepare documentary research requirements;
4. register evidence collected by the research layer;
5. check provenance;
6. contrast evidence;
7. verify claims individually;
8. define the publishable scope;
9. generate an original draft only from verified claims;
10. check sentence traceability and originality;
11. stop at `EDITOR_REVIEW`;
12. never publish automatically without the publication gate and human approval.

## 4. Fail-safe behavior

The pipeline must stop or narrow the publication scope when evidence is insufficient.

Examples:

- no evidence → `RECHECK_REQUIRED`;
- material contradiction → `CONTESTED`;
- some claims verified → `PARTIALLY_VERIFIED` and limited publishable scope;
- verified claims available → draft may be generated;
- untraced factual sentence → originality/traceability block;
- no human approval → publication remains blocked.

## 5. Claim-scoped publication

The case is not the publication unit. The claim is.

A case may contain:

`VERIFIED + VERIFIED + PENDING + CONTESTED`

and still produce a limited article containing only the verified claims, provided the resulting article is coherent and does not imply that the pending or contested claims are established facts.

## 6. Human responsibility

Automation may execute documentary controls and prepare the article. The editor remains responsible for:

- resolving substantive conflicts;
- deciding whether a limited story is editorially coherent;
- approving wording in sensitive cases;
- confirming publication scope;
- granting final publication authorization.

## 7. Desired user experience

The final interface should make the process as simple as:

> **Dame una noticia.**
>
> El sistema investiga qué puede comprobarse, identifica las fuentes adecuadas, contrasta la información, conserva la procedencia, redacta una versión propia y deja fuera lo que no puede demostrar.
>
> **Resultado:** noticia original preparada para revisión editorial, con trazabilidad documental completa.

## 8. Core rule

> **MALDITOESPEJO no transforma una noticia en otra noticia. Transforma una pista en una investigación y una investigación verificada en una noticia original.**

The operational standard remains:

> **No publicar ninguna afirmación que el sistema y la revisión editorial no puedan respaldar documentalmente.**
