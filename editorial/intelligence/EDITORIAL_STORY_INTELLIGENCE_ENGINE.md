# EDITORIAL STORY INTELLIGENCE ENGINE

## Purpose

The Story Intelligence layer converts a consequential editorial case into a structured **story candidate**: a potential publishable journalistic proposition with a defined news question, evidence basis, editorial angle, unresolved gaps, competing explanations, affected audiences, and publication readiness.

It sits between the intelligence/case system and the final editorial decision.

Core principle:

> A signal is not a story, a story candidate is not a fact, and publication readiness is not publication authorization.

## Canonical chain

`SIGNAL → CASE → STORY CANDIDATE → NEWS QUESTION → EVIDENCE BASE → EDITORIAL ANGLE → OPEN QUESTIONS → VERIFICATION PLAN → STORY READINESS → HUMAN EDITOR → EDITORIAL DECISION → PUBLICATION`

## Source-role rule

The story layer must distinguish between:

- `DISCOVERY_SOURCE` — used to find the story or locate a lead;
- `PUBLICATION_SOURCE` — used to support, establish or properly attribute material published information.

A discovery source does not automatically belong in the published article.

Secondary media may be used extensively during investigation. If primary or appropriate evidence is subsequently obtained, the publication should rely on that evidence rather than reproduce the secondary outlet's account.

Internal traceability may preserve the discovery path:

`DISCOVERY_SOURCE → LEAD → INVESTIGATION → EVIDENCE → VERIFICATION → PUBLICATION`

The public article should normally show the sources that support the published information, not the source that merely alerted the newsroom to the story.

## Fundamental distinctions

- `SIGNAL ≠ STORY`
- `CASE ≠ STORY`
- `EVENT ≠ STORY`
- `CLAIM ≠ STORY`
- `STORY HYPOTHESIS ≠ FACT`
- `ANGLE ≠ FRAMING OF TRUTH`
- `IMPORTANCE ≠ PROOF`
- `PUBLIC INTEREST ≠ PUBLISHABILITY`
- `STORY READINESS ≠ PUBLICATION AUTHORIZATION`
- `NOVELTY ≠ NEWSWORTHINESS`
- `VIRALITY ≠ NEWS VALUE`
- `IMPACT ≠ CAUSATION`
- `DISCOVERY_SOURCE ≠ PUBLICATION_SOURCE`

## Story candidate object

Recommended fields:

`story_id`, `case_id`, `story_version`, `story_type`, `working_headline`, `news_question`, `central_proposition`, `supporting_event_ids`, `claim_ids`, `evidence_ids`, `verification_ids`, `impact_ids`, `scenario_ids`, `jurisdiction`, `topic`, `news_value`, `public_interest`, `novelty`, `timeliness`, `consequence`, `proximity`, `conflict_or_tension`, `human_relevance`, `evidence_strength`, `uncertainty`, `contradiction_status`, `editorial_angle`, `alternative_angles`, `known`, `unknown`, `disputed`, `open_questions`, `verification_requirements`, `source_requirements`, `publication_risks`, `readiness_state`, `lead_editor`, `created_at`, `updated_at`, `reviewed_at`.

## Story types

- `BREAKING`
- `DEVELOPING`
- `INVESTIGATION`
- `EXPLAINER`
- `ANALYSIS`
- `FACT_CHECK`
- `DATA_STORY`
- `BACKGROUND`
- `PROFILE`
- `FOLLOW_UP`
- `CORRECTION`
- `UPDATE`
- `DISPUTED_EVENT`

Story type describes editorial treatment, not truth status.

## News question

Every consequential story candidate should be expressible as a precise question:

- What happened?
- What changed?
- Why does it matter?
- Who is affected?
- What is established?
- What remains uncertain?
- What evidence supports the central proposition?

The news question must not presuppose an unverified answer.

## Central proposition

The central proposition is the smallest material statement that the proposed story needs to establish.

It must be decomposable into claims and evidence. If the proposition cannot be traced to evidence, the story remains investigative rather than publication-ready.

## Story angle

An angle identifies the editorially relevant aspect of a verified or clearly attributed matter.

Possible angles include:

- immediate consequence;
- institutional decision;
- legal/regulatory significance;
- public impact;
- economic consequence;
- security consequence;
- human dimension;
- accountability;
- historical significance;
- data trend;
- change over time;
- contradiction between credible sources.

An angle must not manufacture drama, certainty or causation.

## Multiple angles

Where the evidence supports several materially different interpretations, preserve alternative angles until human editorial review.

The system must not select the most sensational angle merely because it maximizes attention.

## News value

Assess news value through explicit dimensions rather than a single opaque score:

- `TIMELINESS`
- `NOVELTY`
- `CONSEQUENCE`
- `PUBLIC_INTEREST`
- `PROXIMITY`
- `SCALE`
- `HUMAN_RELEVANCE`
- `CONFLICT_OR_TENSION`
- `ACCOUNTABILITY`
- `SIGNIFICANCE`

News value does not lower evidence standards.

## Evidence basis

A story candidate must distinguish:

### Established
Material propositions supported by adequate evidence.

### Attributed
Claims that are accurately attributed to a source or actor but are not independently established.

### Inferred
Editorial analysis derived from evidence but requiring explicit analytical framing.

### Unknown
Material information not yet established.

### Disputed
Material propositions for which credible evidence conflicts.

### Unsupported
Propositions for which adequate evidence has not been identified.

Unsupported propositions must not silently enter the final story as fact.

## Evidence sufficiency

The story layer should ask whether the central proposition has:

1. identifiable primary or otherwise appropriate evidence;
2. traceable provenance;
3. adequate authority for the fact class;
4. temporal consistency;
5. geographic consistency where relevant;
6. independent corroboration where justified;
7. integrity checks where relevant;
8. contradiction assessment;
9. sufficient completeness;
10. human verification.

A large number of secondary reports cannot compensate for missing primary evidence where primary evidence is reasonably obtainable.

## Open questions

Every consequential story should expose the material questions that remain unanswered.

Examples:

- What remains unverified?
- Which source would resolve the uncertainty?
- Is the reported number preliminary or final?
- Has the source revised its statement?
- Are apparently independent reports derived from the same lineage?
- What evidence would falsify the central proposition?
- What changed since the previous publication?

Open questions are not defects; they are part of disciplined journalism.

## Verification plan

The story candidate should specify concrete actions:

`QUESTION → REQUIRED EVIDENCE → SOURCE / LINEAGE → VERIFICATION METHOD → EXPECTED RESULT → DEADLINE → STOP CONDITION`

Verification tasks may include document retrieval, source confirmation, dataset reconstruction, geolocation, chronolocation, direct observation, legal-record review, expert consultation, numerical reconstruction or independent corroboration.

## Publication risks

Assess separately:

- factual uncertainty;
- contradiction risk;
- source dependency;
- provenance risk;
- manipulation risk;
- legal sensitivity;
- privacy risk;
- attribution risk;
- causal overstatement;
- temporal error;
- geographic error;
- headline distortion;
- context loss;
- reputational harm.

## Plain-language publication rule

MALDITOESPEJO uses a sophisticated verification system, but it is written for a general reader.

Internal complexity must not become unnecessary public jargon.

The published article should:

- use short, clear sentences where possible;
- explain technical terms the first time they appear;
- distinguish facts from statements in ordinary language;
- say clearly when something is not known;
- avoid inflated or bureaucratic wording;
- preserve precision without making the reader decode the editorial system.

Examples:

- Internal: `VERIFIED_PRIMARY_DATA` → Public: "Los datos oficiales muestran..."
- Internal: `ATTRIBUTED_CLAIM` → Public: "El ministro afirmó..."
- Internal: `UNRESOLVED` → Public: "Todavía no hay datos suficientes para saberlo."
- Internal: `CONTRADICTED` → Public: "Los datos disponibles no coinciden y la cuestión sigue abierta."

The rule is simple:

> **La investigación puede ser compleja; la explicación no debe serlo.**

## Story readiness

Suggested states:

`IDEA`, `INVESTIGATING`, `EVIDENCE_BUILDING`, `VERIFICATION_PENDING`, `EDITOR_REVIEW`, `READY_FOR_DECISION`, `PUBLISHABLE_WITH_QUALIFIERS`, `HOLD`, `REJECTED`, `PUBLISHED`, `UPDATED`, `CORRECTED`, `RETRACTED`.

`READY_FOR_DECISION` means the editorial package is sufficiently developed for a human publication decision. It does not itself authorize publication.

## Stop conditions

A story candidate should remain `HOLD` or `INVESTIGATING` when:

- its central proposition lacks adequate evidence;
- the decisive source has unresolved provenance problems;
- a material contradiction remains unresolved;
- the proposed headline is stronger than the evidence;
- publication requires an unsupported causal claim;
- an allegation cannot be adequately attributed;
- a manipulated or out-of-context asset is central to the story;
- the only corroboration is common-lineage repetition;
- material uncertainty cannot be communicated accurately.

## Headline integrity

The headline must not claim more than the body can establish.

Before publication test:

`HEADLINE CLAIM ⊆ VERIFIED / PROPERLY ATTRIBUTED CONTENT`

Do not convert:

- allegation → fact;
- forecast → event;
- estimate → observation;
- correlation → causation;
- preliminary figure → final figure;
- disputed proposition → settled proposition;
- viral narrative → established fact.

## Publication package

A consequential story candidate should be capable of producing a reproducible editorial package containing:

- working headline;
- news question;
- central proposition;
- verified facts;
- attributed claims;
- material uncertainty;
- evidence references;
- source attribution;
- chronology;
- relevant consequences/impact;
- unresolved questions;
- editorial angle;
- headline integrity check;
- human decision record.

## Integration with existing intelligence

`SOURCE → EVIDENCE → CASE → SIGNAL → NARRATIVE / ACTOR / FLOW → EARLY WARNING → SCENARIO → IMPACT → STORY CANDIDATE → VERIFICATION PLAN → STORY READINESS → EDITORIAL DECISION`

The story layer consumes intelligence; it does not replace the evidence graph, case file or decision system.

## Human editorial gate

No automated system may:

- decide that a story is true merely because it is important;
- select a sensational angle solely for engagement;
- suppress contradictory evidence;
- authorize publication;
- assign blame or intent without evidentiary basis;
- publish a headline stronger than the verified content;
- silently rewrite historical editorial reasoning.

Final chain:

`STORY CANDIDATE → HUMAN EDITOR → EDITORIAL DECISION`

## Core doctrine

> **MALDITOESPEJO uses available media and other sources to discover what deserves investigation. It publishes the result of its own verification, using the strongest appropriate evidence and explaining it in language that anyone can understand.**
