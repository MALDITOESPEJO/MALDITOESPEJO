# MALDITOESPEJO — EDITORIAL PRIORITY ENGINE

## Priority scale

### A+ — Immediate editorial alert
Material that may require immediate publication or escalation.

Typical cases:
- confirmed major breaking event;
- official election result or legally significant electoral decision;
- active exploitation confirmed through authoritative cybersecurity evidence;
- major conflict escalation;
- major regulatory enforcement action;
- severe humanitarian emergency;
- major verified infrastructure damage;
- official decision with immediate and substantial consequences.

### A — Priority review
Important developments requiring prompt editorial assessment.

### B — Normal monitoring
Relevant developments suitable for routine editorial review.

### C — Context / background
Useful for context, trend analysis or reference but not normally urgent.

## Priority factors

Priority is not determined by source authority alone. The engine evaluates:

- impact;
- urgency;
- novelty;
- geographic relevance;
- legal/regulatory consequence;
- public-interest consequence;
- evidence quality;
- verification status;
- potential misinformation risk;
- reversibility;
- uncertainty.

## Hard rules

1. A sensational claim without evidence cannot become A+ merely because it is viral.
2. A primary official document may be A+ even when media coverage is still limited.
3. A preliminary election result must retain its authority level; it cannot be represented as certified.
4. A disputed event must carry the conflict state until resolved.
5. A high-risk signal with incomplete verification may be escalated for urgent human review, but must not be presented as confirmed fact.

## Priority output

The engine should return:

`EDITORIAL_PRIORITY = A+ | A | B | C`

plus:

- rationale;
- evidence level;
- verification state;
- human-review requirement;
- timestamp;
- competing-source status.
