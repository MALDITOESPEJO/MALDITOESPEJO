# ORIGINALITY AND TRACEABILITY ENGINE — MALDITOESPEJO

## 1. Purpose

Ensure that an automatically generated article is both original in its wording and structurally traceable to the verified claims and evidence of the investigation.

The engine does not decide whether a claim is true. Verification is performed upstream.

Its purpose is to answer two different questions:

1. **Traceability:** Why is this sentence in the article?
2. **Originality:** Is MALDITOESPEJO expressing the verified information in its own structure and wording rather than reproducing another publication?

## 2. Core chain

`ARTICLE SENTENCE → CLAIM → EVIDENCE → DOCUMENT → SOURCE → PROVENANCE`

For originality:

`INPUT STORY → VERIFIED CLAIMS → MALDITOESPEJO STRUCTURE → ORIGINAL WORDING`

## 3. Sentence-level traceability

Every factual sentence intended for publication must be attributable to at least one verified claim.

A sentence may combine several verified claims, but all material factual components must remain traceable.

The system must not silently introduce:

- new facts;
- numbers not present in verified evidence;
- causal explanations not supported by evidence;
- names, dates or places not verified;
- conclusions derived only from the discovery source.

If a sentence cannot be traced, it is `UNTRACED` and cannot enter the publishable scope automatically.

## 4. Originality

Originality does not mean changing a few words from the source article.

A MALDITOESPEJO article must have its own:

- selection of verified facts;
- hierarchy of information;
- headline;
- structure;
- transitions;
- explanatory context;
- treatment of uncertainty.

The system must avoid reproducing the source publication's narrative order merely because that source supplied the lead.

Secondary media used for discovery are not publication sources merely because they contain the initial wording or narrative.

## 5. Similarity control

Where a source text is available, the engine may compare the draft against that text to detect suspiciously close wording or structure.

A similarity alert is not proof of plagiarism and must not automatically reject an article.

Suggested states:

- `ORIGINALITY_CLEAR`
- `SIMILARITY_REVIEW`
- `ORIGINALITY_BLOCKED`
- `NOT_ASSESSABLE`

A high similarity result must trigger human review before publication.

## 6. Public-source rule

The article should list the sources actually used to substantiate its published claims.

A discovery source may remain in the internal case record for auditability but should not appear publicly merely because it supplied the lead.

## 7. Uncertainty rule

If only part of a case is verified, the article may contain only the verified factual scope.

Unverified claims must not be smuggled into the article through wording such as:

- "según ha trascendido";
- "todo apunta a";
- "se sabe que";
- "fuentes indican";

unless the underlying statement itself has been properly attributed and verified as a statement.

## 8. Final control

The engine should produce a report containing:

- article identifier;
- sentences assessed;
- claim IDs supporting each sentence;
- evidence IDs supporting those claims;
- untraced sentences;
- originality status;
- similarity alerts;
- excluded claims;
- final recommendation.

Recommended rule:

> **Si no podemos explicar de qué afirmación verificada procede una frase, no debe publicarse automáticamente.**

And:

> **MALDITOESPEJO no copia una noticia: reconstruye una noticia original a partir de información que ha investigado y verificado.**

## 9. Language

The internal process may be technically rigorous. The published explanation must remain clear and understandable.

**La investigación puede ser compleja; la explicación no debe serlo.**
