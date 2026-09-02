# MALDITOESPEJO — RADAR ARCHITECTURE

## Purpose

The Radar Layer is the continuous detection system of MALDITOESPEJO. It does not publish automatically. It detects relevant changes, classifies them, correlates them and passes editorial signals to human review.

## Radar families

### 1. NEWS RADAR
Detects breaking news, institutional announcements, press releases, declarations and scheduled events.

### 2. DOCUMENT RADAR
Detects laws, regulations, judgments, resolutions, official reports, filings and newly published institutional documents.

### 3. DATA RADAR
Detects statistical releases, dataset updates, indicators, revisions and threshold crossings.

### 4. MARKET RADAR
Detects market, financial, monetary, trade and corporate developments using primary financial/economic sources plus qualified secondary discovery sources.

### 5. REGULATORY RADAR
Detects regulatory actions, sanctions, consultations, enforcement, supervisory measures and legal changes.

### 6. ALERT RADAR
Detects emergency, health, environmental, cybersecurity, humanitarian and public-safety alerts.

### 7. AI RADAR
Monitors AI regulation, AI incidents, model releases, safety developments, research and institutional policy.

### 8. CYBER RADAR
Correlates vulnerability identifiers, severity, exploitation evidence, security advisories and incident information.

### 9. SCIENCE RADAR
Monitors scientific publications, institutional announcements, datasets, major experiments and reproducible evidence.

### 10. POLITICAL RADAR
Monitors governments, legislatures, courts, parties, public institutions and official political decisions.

### 11. GEOPOLITICAL RADAR
Monitors states, international organizations, diplomatic actions, sanctions, treaties and geopolitical developments.

### 12. ELECTION RADAR
Monitors official electoral calendars, results, recounts, runoff processes, electoral litigation and certification.

### 13. SOCIAL DATA RADAR
Monitors population, labour, migration, health, education and social indicators.

### 14. HUMAN DEVELOPMENT RADAR
Monitors displacement, food security, humanitarian pressure, health emergencies and development indicators.

### 15. ENVIRONMENTAL DATA RADAR
Monitors climate, weather, biodiversity, pollution, environmental indicators and Earth-observation data.

### 16. CLAIM RADAR
Detects consequential public claims that require evidence-based verification.

### 17. VERIFICATION RADAR
Activates when an image, video, document, location, date or factual claim requires independent verification.

### 18. DISINFORMATION RADAR
Detects coordinated narratives, recurring false claims, manipulated media and information operations.

### 19. OSINT RADAR
Uses open-source intelligence to reconstruct events, locations, timelines and relationships.

### 20. GEOLOCATION RADAR
Combines visual, cartographic, satellite, terrain, street-level and shadow evidence to determine location.

### 21. SATELLITE RADAR
Monitors Earth-observation imagery and changes relevant to conflicts, disasters, infrastructure and environmental events.

### 22. AVIATION RADAR
Monitors flight movements, aircraft metadata, airport operations and historical traces.

### 23. MARITIME RADAR
Monitors AIS information, maritime movements, ports, vessels and maritime events.

### 24. CHRONOLOCATION RADAR
Determines or constrains when an image/video/event occurred using independent temporal evidence.

### 25. CONFLICT RADAR
Combines conflict-event datasets, official statements, humanitarian information, satellite evidence and OSINT.

### 26. DEFENSE RADAR
Monitors military expenditure, arms transfers, defense developments and strategic-security analysis.

### 27. HUMANITARIAN CONFLICT RADAR
Monitors casualties, displacement, food insecurity, health consequences and humanitarian access.

### 28. DAMAGE VERIFICATION RADAR
Verifies alleged physical damage through before/after imagery, geolocation, satellite imagery and independent sources.

## Architecture rule

A radar is a detector, not an editorial authority. Detection creates a candidate signal. Publication requires verification and human editorial judgment.

## Processing chain

SOURCE → CHANNEL → FEED → EVENT/DATA/CLAIM → SIGNAL → CORRELATION → VERIFICATION → PRIORITY → HUMAN EDITOR → PUBLICATION

## Independence rule

Multiple channels belonging to the same institution do not constitute independent corroboration. Independence is evaluated at source/institution level, not URL count.

## Primary-source rule

Whenever practical, an editorial signal must resolve to the original document, dataset, ruling, official statement, image, video or other primary evidence. Secondary media are used for discovery, context and cross-checking.

## Conflict rule

When credible sources disagree, the system must not silently choose one. It creates an `EDITORIAL_CONFLICT_ALERT` containing both sources, timestamps, authority levels, evidence and the unresolved point for human review.
