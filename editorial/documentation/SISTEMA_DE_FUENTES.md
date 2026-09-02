# MALDITOESPEJO — SISTEMA DE FUENTES

## 1. Finalidad

El Sistema de Fuentes es la infraestructura editorial destinada a descubrir, documentar, verificar, correlacionar y priorizar información antes de su publicación.

MALDITOESPEJO no debe funcionar como un agregador de titulares. Debe reconstruir la procedencia de la información y distinguir hechos, datos, afirmaciones, análisis y narrativas.

## 2. Principio rector

`FUENTE → CANAL → FEED/ENDPOINT → OBSERVACIÓN → EVENTO/CLAIM → CORRELACIÓN → VERIFICACIÓN → PRIORIDAD → EDITOR → PUBLICACIÓN`

## 3. Tipología

El sistema distingue:

- fuentes primarias institucionales;
- fuentes primarias documentales;
- datasets y organismos estadísticos;
- fuentes científicas y técnicas;
- agencias y medios secundarios;
- fact-checkers;
- OSINT y herramientas de verificación;
- fuentes de observación geoespacial, aviación y marítimas.

## 4. Regla de primariedad

La fuente más cercana al hecho debe prevalecer como evidencia cuando esté disponible y sea competente para ese hecho.

La prensa secundaria sirve para descubrir, contextualizar y contrastar. No convierte por sí sola una afirmación en hecho probado.

## 5. Separación estructural

El registro maestro separa:

`SOURCE → CHANNEL → FEED → TOPIC → EDITORIAL SIGNAL → SECTION → PRIORITY`

Esto evita inflar artificialmente el número de fuentes y permite que una institución tenga múltiples canales sin duplicarla.

## 6. Entidades editoriales

### EVENT
Algo que ocurrió o una decisión institucional que tuvo lugar.

### CLAIM
Una afirmación susceptible de ser verdadera, falsa, engañosa o no demostrada.

### NARRATIVE
Una estructura discursiva que conecta múltiples claims y puede revelar una campaña o patrón informativo.

### SIGNAL
Una interpretación editorial estructurada de la relevancia de una observación.

### CONFLICT ALERT
Registro explícito de una discrepancia entre fuentes creíbles.

## 7. Verificación

Estados principales:

`UNVERIFIED | PENDING | VERIFIED | PARTIALLY_VERIFIED | CONTRADICTED | MANIPULATED`

La verificación debe ser proporcional al impacto de la información. Cuanto mayor sea el impacto potencial, mayor debe ser la exigencia de evidencia y corroboración.

## 8. Radares

El sistema incorpora radares especializados de noticias, documentos, datos, mercados, regulación, alertas, IA, ciberseguridad, ciencia, política, geopolítica, elecciones, sociedad, desarrollo humano, ambiente, claims, verificación, desinformación, OSINT, geolocalización, satélite, aviación, marítimo, cronolocalización, conflictos, defensa, humanitario y daños.

## 9. Motores

Los motores principales son:

- Signal Engine;
- Correlation Engine;
- Editorial Priority Engine;
- Verification Chain.

## 10. Prioridad

`A+` — inmediata / crítica

`A` — prioritaria

`B` — seguimiento ordinario

`C` — contexto

La prioridad no equivale a certeza. Un acontecimiento puede ser A+ por su importancia y seguir `PENDING` si aún no existe evidencia suficiente.

## 11. Elecciones

Los resultados deben conservar su autoridad procesal:

`OFFICIAL → CERTIFIED → PRELIMINARY → OBSERVATION → ESTIMATE → POLL → ANALYSIS`

Nunca debe transformarse silenciosamente un resultado preliminar en certificado.

## 12. Ciberseguridad

La correlación puede combinar CVE, NVD y CISA KEV. La existencia de una vulnerabilidad no equivale por sí sola a explotación activa. La explotación debe quedar respaldada por evidencia apropiada.

## 13. Conflictos y defensa

Se distinguen evento de conflicto, evaluación y pronóstico. ACLED/UCDP proporcionan datos estructurados de conflicto; IISS aporta análisis estratégico; SIPRI aporta datos de armamento y gasto. Las métricas de volumen de transferencias no deben presentarse como valor monetario.

## 14. OSINT y verificación visual

Las investigaciones pueden combinar geolocalización, satélite, Street View, OpenStreetMap, aviación, AIS, metadatos, búsqueda inversa, keyframes y análisis temporal. Ninguna herramienta individual debe considerarse prueba concluyente sin contexto y corroboración.

## 15. Transparencia

Toda señal editorial relevante debe poder responder:

1. ¿De dónde procede?
2. ¿Qué parte es evidencia primaria?
3. ¿Qué parte es afirmación?
4. ¿Qué se ha corroborado independientemente?
5. ¿Qué contradicciones existen?
6. ¿Qué nivel de certeza tenemos?
7. ¿Por qué merece la prioridad asignada?

## 16. Regla final

MALDITOESPEJO debe preferir una afirmación correctamente limitada antes que una afirmación espectacular pero insuficientemente demostrada.
