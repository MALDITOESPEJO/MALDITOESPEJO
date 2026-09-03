# MALDITOESPEJO — DAILY NEWS SELECTION ENGINE

## 1. Purpose

The Daily News Selection Engine identifies, scores, clusters and prioritizes news candidates every day so the newsroom can focus its reporting capacity on the stories with the greatest combination of public interest, momentum, relevance, impact and editorial value.

It is a **selection system**, not an automatic truth engine and not an automatic publishing engine.

Core principle:

> **Viralidad detecta interés. La evidencia determina si podemos publicarlo.**

## 2. Editorial objective

The system must answer four different questions:

1. **¿Qué está creciendo?** — trend and virality.
2. **¿Qué importa?** — relevance and impact.
3. **¿Qué es realmente nuevo?** — novelty and information gain.
4. **¿Qué merece una investigación propia?** — editorial opportunity and verifiability.

No single metric may determine selection.

## 3. Pipeline

`INGESTA → NORMALIZACIÓN → DEDUPLICACIÓN → CLUSTERING → TREND DETECTION → VIRALITY SCORE → EDITORIAL SCORE → NEWSROOM PRIORITY → INVESTIGATION → VERIFICATION → ORIGINAL ARTICLE`

## 4. Candidate model

Every candidate should be normalized into a common structure containing, where available:

- candidate_id
- detected_at
- first_seen_at
- title
- summary
- url
- language
- geography
- section_candidate
- entities
- topics
- source_ids
- source_count
- independent_source_count
- social_signals
- search_signals
- publication_signals
- velocity
- acceleration
- persistence
- relevance
- impact
- novelty
- editorial_fit
- verification_readiness
- originality_opportunity
- risk
- duplicate_cluster_id
- status

Missing signals must be treated as **unknown**, not as zero, unless the connector explicitly reports zero.

## 5. Scores

### 5.1 Virality Score (0–100)

Measures attention and momentum, not truth.

Recommended components:

- volume: 20%
- velocity: 25%
- acceleration: 20%
- cross-source spread: 15%
- search interest: 10%
- persistence: 10%

### 5.2 Editorial Score (0–100)

Measures whether MALDITOESPEJO should invest reporting capacity in the story.

- relevance: 20%
- public impact: 20%
- novelty: 15%
- editorial fit: 15%
- verification readiness: 15%
- originality opportunity: 10%
- source independence: 5%

### 5.3 Risk Score (0–100)

Risk is not a measure of whether a story is false. It measures the editorial danger of publishing it without additional work.

Consider:

- weak provenance
- conflicting reports
- unverifiable central claim
- manipulated or synthetic media indicators
- excessive reliance on a single source
- legal/ethical sensitivity
- certainty inflation risk
- headline sensationalism risk

### 5.4 Newsroom Priority Score (0–100)

The final priority must reward both attention and editorial value while penalizing risk:

`NEWSROOM_PRIORITY = 0.40 × VIRALITY + 0.50 × EDITORIAL_SCORE + 0.10 × TIMELINESS − RISK_PENALTY`

The implementation normalizes the result to 0–100.

Risk must not erase an important story automatically. Instead it increases the required verification depth.

## 6. Trend intelligence

The engine must prefer **rate of change** over raw accumulated volume when detecting emerging stories.

A candidate with modest volume but explosive growth can outrank an older story with a larger historical audience.

Required temporal signals:

- first seen
- current volume
- previous-window volume
- velocity
- acceleration
- persistence
- decay

The engine should compare equivalent time windows and avoid treating old accumulated attention as new momentum.

## 7. Cross-source independence

Repeated publication does not equal independent confirmation.

The engine must distinguish:

`SOURCE COUNT ≠ INDEPENDENT SOURCE COUNT`

Syndication, copied articles, wire-service reproduction and identical press-release text should not inflate independence.

The source/provenance layer remains authoritative for independence.

## 8. Clustering

Multiple URLs reporting the same underlying event must be grouped into one story cluster.

The cluster represents the **story**, while individual URLs remain observations.

Clustering should use, where available:

- entities
- event date/time
- location
- semantic similarity
- distinctive facts
- named actors
- original document references

The system must prevent ten copies of the same story from becoming ten independent candidates.

## 9. Selection tiers

### PRIORIDAD 1 — INVESTIGAR AHORA

High public interest + high editorial value + sufficient path to verification.

### PRIORIDAD 2 — VIGILAR / INVESTIGAR

Strong signal but incomplete evidence, developing story or moderate editorial value.

### PRIORIDAD 3 — TENDENCIA

Highly viral but weak editorial value, duplicated, speculative or low-impact.

### PRIORIDAD 4 — DESCARTAR

Duplicate, stale, clearly outside editorial scope, or insufficiently meaningful.

A story with unresolved central evidence may remain visible as a candidate but must not be represented as verified.

## 10. Anti-clickbait safeguards

The engine must not reward sensational wording itself.

Headline emotionality, outrage, fear or controversy may be used as signals of attention but cannot increase editorial value.

The system must explicitly detect:

- sensational headlines
- unsupported causal claims
- absolute claims
- “shock”/“incredible” framing
- premature conclusions
- claims presented as facts when they are statements or allegations

## 11. Editorial diversity

The daily list must not become dominated by one topic, publisher, geography or event.

The selection layer should apply diversity constraints across:

- sections
- countries/regions
- subjects
- entities
- story clusters
- source families

The newsroom should receive both:

- **TOP GLOBAL STORIES**
- **BEST STORIES BY SECTION**

## 12. Human decision

The engine recommends. The editor decides.

The engine must never silently transform:

- candidate → verified fact
- statement → fact
- allegation → fact
- viral post → evidence
- repeated reports → independent corroboration

## 13. Daily newsroom output

The daily report should contain:

1. Top 20 story candidates.
2. Top 10 emerging trends.
3. Top 5 stories per section where enough candidates exist.
4. Stories rising fastest.
5. Stories with strongest independent-source support.
6. Stories with high virality but low editorial value.
7. Stories with high editorial value but low virality.
8. Stories requiring immediate verification.
9. Stories that should not be published without resolving a specific uncertainty.

Each candidate should expose the reason for its position in plain language.

Example:

`#1 — Priority 94`

`Está creciendo muy rápido, afecta a un gran número de personas y existe una vía clara para contrastarlo con fuentes primarias.`

## 14. Learning loop

After publication, the system should store outcome signals such as:

- readership
- engagement
- time on article
- subsequent citations
- correction rate
- update rate
- editorial usefulness
- verification effort

These signals must improve future **selection**, not rewrite historical scores or alter facts retroactively.

## 15. Non-negotiable separation

`VIRALITY → ATTENTION`

`EDITORIAL SCORE → NEWSROOM VALUE`

`EVIDENCE → FACTUAL SUPPORT`

`VERIFICATION → PUBLISHABILITY`

`HUMAN APPROVAL → PUBLICATION DECISION`

This separation is foundational to MALDITOESPEJO.
