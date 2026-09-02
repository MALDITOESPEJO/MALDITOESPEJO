# EDITORIAL ACTOR & NETWORK INTELLIGENCE ENGINE

## 1. Purpose

This engine models actors, organizations, institutions, accounts, networks and observable relationships relevant to editorial investigations.

Its purpose is to answer:

- Who is directly observed?
- Who is attributed to an action or statement?
- What evidence supports the attribution?
- What relationships are independently established?
- What remains suspected or unknown?

It does **not** infer responsibility, malicious intent or coordination from network structure alone.

## 2. Canonical chain

`ACTOR → OBSERVABLE ACTION → EVIDENCE → RELATIONSHIP → NETWORK → ATTRIBUTION ASSESSMENT → HUMAN REVIEW`

For information operations:

`ACTOR/NETWORK → CONTENT/CLAIM → PROPAGATION → BEHAVIORAL EVIDENCE → ATTRIBUTION HYPOTHESIS`

Attribution is a separate evidentiary problem from narrative identification.

## 3. Actor taxonomy

Actors may include:

- person;
- public official;
- political organization;
- government institution;
- company;
- NGO/civil-society organization;
- media organization;
- research institution;
- online account;
- anonymous account;
- bot/automated system;
- suspected network;
- state-linked entity;
- criminal organization;
- unknown actor.

Actor type must describe the observed entity, not imply culpability.

## 4. Identity states

Use explicit identity states:

`IDENTIFIED`, `PARTIALLY_IDENTIFIED`, `PSEUDONYMOUS`, `ANONYMOUS`, `IMPERSONATOR`, `UNCONFIRMED`, `UNKNOWN`.

Identity resolution requires evidence. Similar usernames, profile photographs, writing style or posting patterns are leads, not proof.

## 5. Relationship taxonomy

Relationships may include:

- `EMPLOYMENT`
- `OFFICIAL_AFFILIATION`
- `OWNERSHIP`
- `CONTROL`
- `MEMBERSHIP`
- `FUNDING`
- `PARTNERSHIP`
- `COMMUNICATION`
- `QUOTING`
- `REPOSTING`
- `AMPLIFICATION`
- `COMMON_SOURCE`
- `COMMON_INFRASTRUCTURE`
- `SHARED_MEDIA`
- `COORDINATED_BEHAVIOR_SUSPECTED`

Every relationship requires provenance and temporal scope.

## 6. Observed versus inferred

The engine separates:

`OBSERVED` — directly evidenced behavior or relationship.

`REPORTED` — attributed to a credible source but not independently established.

`INFERRED` — analytical conclusion derived from multiple observations.

`SUSPECTED` — hypothesis requiring further evidence.

`ESTABLISHED` — conclusion meeting the applicable evidentiary standard.

No inferred relationship may be silently converted into an observed fact.

## 7. Attribution levels

Attribution should be recorded independently from identity:

- `NO_ATTRIBUTION`
- `ACTOR_MENTIONED`
- `ACTOR_SELF_IDENTIFIED`
- `ACTOR_DOCUMENTED`
- `ACTOR_CORROBORATED`
- `ACTOR_ATTRIBUTION_ASSESSED`
- `ACTOR_ATTRIBUTION_ESTABLISHED`
- `ATTRIBUTION_DISPUTED`
- `ATTRIBUTION_UNKNOWN`

Attribution confidence must be explicit.

## 8. Coordination assessment

Potential coordination indicators include:

- synchronized actions;
- common infrastructure;
- unusual repeated assets;
- shared unpublished material;
- reciprocal amplification;
- common operational timing;
- common administrative control evidence;
- repeated uncommon errors or artifacts.

These indicators trigger investigation. They do not by themselves establish coordination.

## 9. Network construction

Networks should be constructed from documented relationships, not visual proximity alone.

Useful network measures include:

- node count;
- edge count;
- independent evidence lineages;
- common-parent concentration;
- temporal synchronization;
- reciprocal amplification;
- source concentration;
- geographic concentration;
- institutional concentration;
- evidence reuse.

Network metrics are diagnostics, never automatic culpability scores.

## 10. Common-lineage protection

If several actors reproduce the same upstream document, dataset, agency dispatch, witness, image or statement, the engine must preserve the common lineage.

`MANY ACTORS + ONE UNDERLYING EVIDENCE = NOT MANY INDEPENDENT SOURCES`

## 11. State-linked attribution

Attribution to a government or state-linked actor requires stronger evidence than thematic similarity, political alignment or geographic proximity.

Relevant evidence may include:

- official records;
- authenticated infrastructure evidence;
- financial/control records;
- documented organizational links;
- independent technical investigation;
- multiple independent evidence lineages;
- credible intelligence reporting where provenance can be described.

Classified or inaccessible evidence must not be represented as publicly verified fact without appropriate qualification.

## 12. Identity and privacy safeguards

The engine must minimize unnecessary personal data.

Do not expose private personal information merely because it may assist identification. Public-interest relevance, necessity and proportionality must be considered before publication.

Anonymous or pseudonymous actors should remain anonymous where identification is not essential and sufficiently evidenced.

## 13. Alternative explanations

Every significant attribution hypothesis must test plausible alternatives, including:

- organic propagation;
- common news source;
- ordinary professional relationship;
- shared public information;
- independent timing coincidence;
- automated platform recommendation;
- legitimate campaign activity;
- parody or impersonation;
- third-party reuse.

## 14. Actor lifecycle

`DISCOVERED → IDENTIFIED/UNCONFIRMED → OBSERVED → RELATIONSHIP_ASSESSED → ATTRIBUTION_REVIEW → ESTABLISHED/DISPUTED/UNKNOWN → HISTORICAL`.

Historical actor records must remain auditable even when identities or relationships later change.

## 15. Alerts

- `ACTOR_IDENTITY_ANOMALY`
- `ACTOR_IMPERSONATION_SUSPECTED`
- `ACTOR_RELATIONSHIP_UNVERIFIED`
- `ACTOR_COMMON_LINEAGE`
- `ACTOR_COORDINATION_SUSPECTED`
- `ACTOR_NETWORK_CONCENTRATION`
- `ACTOR_ATTRIBUTION_CONFLICT`
- `ACTOR_ATTRIBUTION_GAP`
- `ACTOR_STATE_LINKAGE_REQUIRES_REVIEW`
- `ACTOR_NETWORK_EVIDENCE_BOTTLENECK`

## 16. Human gate

No automated system may:

- declare an individual responsible for an event;
- identify an anonymous individual solely through probabilistic similarity;
- label an actor malicious based only on network centrality;
- infer state responsibility from thematic similarity;
- equate political affiliation with information manipulation;
- publish consequential attribution without human editorial review.

## 17. Integration

`NARRATIVE INTELLIGENCE → ACTOR OBSERVATIONS → LINEAGE → EVIDENCE → NETWORK ANALYSIS → ATTRIBUTION ASSESSMENT → CASE → EDITORIAL DECISION`

Actor analysis feeds editorial investigation; it does not replace primary evidence.

## 18. Core principle

> **Identify relationships only as strongly as the evidence permits, and never confuse a network map with proof of responsibility.**
