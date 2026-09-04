# MALDITO ESPEJO — Automatizaciones del proyecto

**Documento de referencia técnica y editorial**  
**Repositorio:** `MALDITOESPEJO/MALDITOESPEJO`  
**Rama auditada:** `main`  
**Fecha de auditoría:** 2026-09-04

---

## 1. Propósito

Este documento describe las automatizaciones que existen en el repositorio de MALDITO ESPEJO y, especialmente, la relación entre investigación, evidencia, verificación, redacción, publicación y mantenimiento.

El criterio utilizado es deliberadamente conservador: se documenta **lo que el código implementa**, no aquello que podría hacerse en el futuro. Cuando un script prepara información pero no la valida, se distingue expresamente entre ambas funciones.

MALDITO ESPEJO utiliza una arquitectura editorial basada en expedientes por caso (`editorial/cases`), registros de fuentes (`editorial/sources`), evidencia (`editorial/evidence`), auditoría (`editorial/audit`), gates de publicación (`editorial/publication-gates`), recuperación (`editorial/recovery`), migración (`editorial/migration`) y radares (`editorial/radars`).

---

## 2. Principio arquitectónico fundamental

La automatización no tiene autoridad editorial.

El sistema puede:

- crear y estructurar casos;
- descomponer una pista en afirmaciones verificables;
- preparar planes de investigación;
- consultar y clasificar fuentes registradas;
- importar resultados como candidatos;
- registrar y evaluar evidencia;
- comprobar procedencia, independencia, temporalidad y contradicciones;
- calcular derivados reproducibles;
- determinar un alcance factual publicable;
- generar un borrador restringido a claims verificados;
- comprobar la trazabilidad del texto;
- detectar impactos derivados de cambios en la evidencia;
- mantener versiones, correcciones y avisos;
- registrar eventos de auditoría;
- y bloquear la publicación cuando faltan condiciones.

No puede conceder por sí sola la aprobación editorial humana. El `Publication Gate` exige explícitamente `human_editorial_approval: true`.

---

## 3. Entrada y CASE ENGINE

### `npm run investigate`

Script: `scripts/investigate.mjs`

Convierte una pista, documento o JSON en un expediente `CASE-########` dentro de `editorial/cases`.

Admite:

- `--title` para una pista de noticia;
- `--input` para un documento local;
- `--json` para una entrada estructurada.

Genera una huella SHA-256 de la entrada y crea el caso en estado `INPUT`.

La creación del caso **no investiga por sí misma y nunca certifica una noticia**. La publicación queda expresamente desactivada al entrar en el sistema.

---

## 4. Claims Engine

### `npm run claims`

Script: `scripts/claims.mjs`

Descompone el material de entrada en unidades de afirmación (`claims`) y les asigna:

- `claim_id`;
- tipo (`FACT`, `STATEMENT`, `CONTEXT`, `UNKNOWN`, `PENDING`);
- importancia (`CENTRAL`, `IMPORTANT`, `CONTEXTUAL`, `SECONDARY`);
- estado inicial de verificación;
- tipo de evidencia requerida.

La descomposición es determinista y conservadora. El motor no añade información que no figure en la entrada y no convierte la clasificación en verificación.

---

## 5. Dependencias entre afirmaciones

### `npm run claim:dependencies`

Script: `scripts/dependencies.mjs`.

Registra y valida relaciones explícitas entre claims. Admite tipos como `DIRECT`, `DERIVED`, `CONDITIONAL`, `CONTEXTUAL` y `EDITORIAL`.

Comprueba:

- existencia de los claims de origen y destino;
- tipos válidos;
- ausencia de dependencias consigo mismas;
- ciclos dirigidos;
- claims afectados por dependencias todavía no verificadas.

La regla esencial es que una afirmación derivada no puede superar el nivel de certeza de las afirmaciones de las que depende.

El sistema **no infiere dependencias únicamente por proximidad temática**.

---

## 6. Planificación de investigación

### `npm run research:plan`

Script: `scripts/research-plan.mjs`.

Convierte cada claim en un plan de búsqueda con:

- prioridad;
- evidencia necesaria;
- objetivos de fuente;
- preguntas de búsqueda.

Los objetivos cambian según el tipo de claim. Por ejemplo, una declaración busca una fuente directa o documento primario; un hecho busca evidencia primaria, datos oficiales y corroboración independiente.

El plan no equivale a evidencia aceptada.

---

## 7. Investigación web e importación

### `npm run web:research`

Script: `scripts/web-research.mjs`.

Prepara consultas documentales a partir del `research_plan` y genera un identificador estable del lote de consultas.

Su comportamiento es deliberadamente no simulativo: **prepara búsquedas, pero no inventa resultados ni evidencia**.

### `npm run web:search`

Script: `scripts/search-web.mjs`.

Actúa como capa de búsqueda web externa utilizada por el pipeline.

### `npm run web:import`

Script: `scripts/import-web-results.mjs`.

Importa resultados web estructurados y los incorpora al expediente como `web_results`.

Los resultados importados son solamente **candidatos documentales**. Requieren evaluación editorial antes de convertirse en evidencia aceptada.

---

## 8. Resolución y autoridad de fuentes

### `npm run source:resolve`

Script: `scripts/resolve-source.mjs`.

Compara candidatos con `editorial/sources/MASTER_SOURCE_REGISTRY_NORMALIZED.csv`.

Solo resuelve automáticamente una fuente cuando existe una coincidencia única con el registro maestro. Las coincidencias ambiguas o inexistentes quedan para revisión humana.

### `npm run source:authority`

Script: `scripts/source-authority.mjs`.

Clasifica las fuentes según su naturaleza y función editorial, distinguiendo, entre otras, evidencia primaria directa, fuentes oficiales directas, reproducción secundaria y contexto especializado.

La autoridad de una fuente no se considera equivalente a la verdad completa del claim.

### `npm run source:check`

Script: `scripts/check-source-universe.mjs`.

Comprueba el universo registrado de fuentes, canales y endpoints. Intenta alcanzar los endpoints HTTP, distingue feeds, datos, web, herramientas manuales y endpoints no URL, y produce `editorial/radars/daily-source-coverage.json`.

Una fuente registrada sin endpoint no se interpreta como una fuente analizada. Una herramienta manual tampoco se falsifica como analizada.

---

## 9. Radar diario de inteligencia de noticias

El repositorio dispone de una cadena específica de inteligencia de actualidad:

`check-source-universe` → `ingest-news-feeds` → `cluster-news-events` → `correlate-news-signals` → `rank-news` → `daily-news-report`.

### `npm run news:ingest`

`ingest-news-feeds.mjs` recorre el universo de fuentes/endpoints registrado y genera candidatos de noticia a partir de feeds y determinados payloads de datos.

Mantiene estado de primera detección y registra observaciones de cobertura. Los endpoints que requieren navegación manual o tratamiento interactivo se encolan para revisión; no se convierten en falsos vacíos.

### `npm run news:events`

`cluster-news-events.mjs` agrupa candidatos potencialmente relacionados y calcula señales temporales como velocidad, persistencia, propagación entre fuentes y aceleración.

El agrupamiento sirve para detectar una historia/evento común; **no convierte la similitud en verdad**.

### `npm run news:correlate`

`correlate-news-signals.mjs` calcula correlaciones, señales emergentes y confianza. Distingue `SAME_EVENT`, `RELATED_EVENT`, `PARALLEL_SIGNAL` y `DUPLICATE`.

Una fuente secundaria o varias reproducciones no equivalen automáticamente a corroboración independiente.

### `npm run news:rank`

`rank-news.mjs` produce una prioridad de newsroom combinando señales de viralidad, valor editorial, actualidad y riesgo.

La ponderación implementada es:

- viralidad: 40 %;
- valor editorial: 50 %;
- actualidad: 10 %;
- penalización adicional cuando el riesgo supera el umbral definido.

La viralidad se descompone en volumen, velocidad, aceleración, propagación entre fuentes, interés de búsqueda y persistencia. El valor editorial considera relevancia, impacto, novedad, encaje editorial, preparación para verificación, oportunidad de originalidad e independencia de fuentes.

El ranking **no es una autorización de publicación**.

### `npm run news:report`

`daily-news-report.mjs` convierte el ranking en un informe legible con:

- oportunidades de publicación;
- tendencias emergentes;
- alta viralidad/bajo valor editorial;
- alto valor editorial/baja viralidad;
- bloqueados o que requieren cautela.

La propia salida conserva la frontera: el informe recomienda qué investigar, no qué publicar.

### `npm run news:intelligence`

`daily-news-intelligence-run.mjs` orquesta toda la cadena anterior, registra ejecución y resultado de cada etapa y crea `editorial/radars/daily-news-intelligence.json`.

El resultado incorpora expresamente cuatro límites:

1. el ranking no es publicación;
2. la correlación no es verdad;
3. el número de fuentes no demuestra independencia;
4. la aprobación editorial humana es obligatoria.

---

## 10. Recuperación de evidencia

### `npm run evidence:retrieve`

`retrieve-evidence.mjs` recupera/prepara evidencia documental según el caso.

### `npm run evidence:prepare`

`prepare-evidence-candidates.mjs` transforma resultados web en candidatos normalizados con `claim_id`, fuente, URL/referencia, documento, fecha, extracto, linaje, grupo de independencia y relación de procedencia.

Preparar no equivale a aceptar.

### `npm run evidence:import`

`import-evidence.mjs` incorpora evidencia estructurada al expediente.

### `npm run evidence:accept`

`accept-evidence.mjs` exige información documental mínima y una evaluación explícita. Un título, URL o snippet de búsqueda no basta.

La evidencia aceptada conserva:

- identidad de fuente;
- documento/registro;
- referencia;
- fecha observada/publicada;
- extracto o dato relevante;
- `lineage_id`;
- `independence_group`;
- `relationship_type`;
- evaluación (`SUPPORTS`, `PARTIALLY_SUPPORTS`, `DOES_NOT_SUPPORT`, `CONTESTS`, `SUPERSEDED`, etc.).

La aceptación no equivale a verificación.

---

## 11. Procedencia y genealogía de la evidencia

### `npm run provenance`

`check-provenance.mjs` comprueba la integridad estructural de la procedencia de las evidencias.

Exige identificadores de evidencia, claim, fuente, documento, linaje, grupo de independencia y relación válida.

### `npm run validate:lineage`

`validate-provenance-lineage.mjs` comprueba el registro maestro `editorial/sources/PROVENANCE_LINEAGE_REGISTRY.csv`, detecta registros incompletos, linajes duplicados y grupos de independencia que necesitan evaluación.

La finalidad es evitar que una cadena de reproducciones sea presentada como varias observaciones independientes.

### `npm run independence:enforce`

`enforce-source-independence.mjs` agrupa evidencias por `independence_group` y detecta relaciones reproductoras (`REPRODUCES`, `QUOTES`, `DERIVED_FROM`, `AGGREGATES`). Estas no se cuentan automáticamente como corroboraciones independientes.

---

## 12. Contraste y contradicciones

### `npm run contrast`

`contrast.mjs` compara evidencia vinculada a cada claim y distingue apoyo, apoyo parcial, oposición e insuficiencia.

Una evidencia que contradice un claim genera un conflicto material que requiere revisión.

### `npm run contradictions`

`resolve-contradictions.mjs` formaliza los conflictos y propaga el impacto únicamente por dependencias explícitas. Un conflicto no bloquea automáticamente claims no relacionados.

---

## 13. Suficiencia de evidencia

### `npm run evidence:sufficiency`

`evidence-sufficiency.mjs` evalúa la suficiencia por claim.

Comprueba, entre otras cosas:

- identidad documental;
- procedencia conocida;
- autoridad adecuada de la fuente;
- adecuación temporal;
- dependencias resueltas;
- evidencia de apoyo;
- apoyo parcial;
- contradicciones.

Distingue expresamente entre:

`EVIDENCIA ENCONTRADA` ≠ `EVIDENCIA SUFICIENTE` ≠ `VERDAD MATERIAL`.

Para una declaración directa, el sistema puede considerar suficiente la evidencia para atribuir que una persona o institución realizó esa declaración, sin tratar esa evidencia como prueba de que el contenido declarado sea verdadero.

---

## 14. Cobertura de evidencia

### `npm run evidence:coverage`

`evidence-coverage.mjs` calcula cobertura claim por claim y separa:

- `COVERED`;
- `PARTIALLY_COVERED`;
- `UNCOVERED`;
- `CONTESTED`.

Los huecos críticos pueden obligar a reducir el alcance o continuar la investigación.

---

## 15. Verificación temporal

### `npm run temporal:verify`

`temporal-verify.mjs` comprueba que las fechas de la evidencia sean compatibles con el periodo al que se refiere la afirmación.

Distingue información actual, histórica, parcialmente alineada, sustituida, temporalmente controvertida y no evaluada.

La temporalidad es especialmente importante para noticias de actualidad: una evidencia válida ayer puede no describir correctamente el estado actual.

La adecuación temporal no equivale por sí sola a verdad material.

---

## 16. Cálculos y reproducibilidad

### `npm run calculate`

`calculate.mjs` registra cálculos editoriales derivados. Actualmente admite:

- `DIFFERENCE`;
- `PERCENTAGE_CHANGE`;
- `PERCENTAGE_POINTS`.

Guarda inputs, fórmula, resultado y estado de verificación.

### `npm run calculation:provenance`

`validate-calculation-provenance.mjs` comprueba que las cifras derivadas sean reproducibles y que los claims de entrada existan. También marca cálculos que dependen de entradas obsoletas, sustituidas, controvertidas o que requieren recálculo.

La interpretación de una cifra sigue requiriendo revisión editorial humana.

---

## 17. Propagación de incertidumbre

### `npm run uncertainty:propagate`

`propagate-uncertainty.mjs` transmite estados de incertidumbre a través de dependencias explícitas.

Si un claim de origen está pendiente, es desconocido, controvertido, requiere revisión o es parcialmente verificado, los claims dependientes reciben un estado heredado compatible con ese nivel de certeza.

La automatización no declara que el claim sea falso: determina que su nivel de certeza no puede ser superior al de sus dependencias.

---

## 18. Alcance factual publicable

### `npm run scope`

`scope.mjs` construye el subconjunto de claims que puede entrar en una pieza: solo claims `VERIFIED` y con dependencias verificadas.

Puede devolver:

- `AVAILABLE`;
- `PARTIAL`;
- `NONE`.

Si el claim central está bloqueado, el sistema no presupone que un subconjunto de hechos sea automáticamente una noticia coherente: exige revisión editorial.

### `npm run scope:guard`

`article-scope-guard.mjs` impide que una claim fuera del alcance aprobado entre en el artículo como hecho material.

---

## 19. Generación del artículo

### `npm run article:original`

`original-article.mjs` genera un borrador Markdown a partir exclusivamente del alcance de claims verificados.

El borrador distingue estructuralmente:

- hechos;
- declaraciones;
- contexto;
- aquello que todavía no se sabe;
- fuentes.

Se crea con estado `review`, no `published`.

La generación automática **no modifica el estado a publicado**.

---

## 20. Trazabilidad de frase

### `npm run trace:article`

`trace-article.mjs` intenta vincular las frases del borrador con claims aprobados y evidencia.

Distingue:

- `TRACEABLE`;
- `PARTIALLY_TRACEABLE`;
- `UNTRACEABLE`;
- `OUT_OF_SCOPE`.

La correspondencia semántica compleja requiere revisión humana.

---

## 21. Control de lenguaje y certeza

### `npm run language:guard`

`language-guard.mjs` busca transformaciones peligrosas entre evidencia y redacción, especialmente:

- pérdida de atribución;
- inflación de certeza;
- causalidad no acreditada;
- afirmaciones fuera del alcance verificado;
- discrepancias entre claims incluidos y estado real de verificación.

Su principio es que la redacción no puede aumentar la certeza de una afirmación respecto de la evidencia registrada.

---

## 22. Originalidad

### `npm run originality`

`check-originality.mjs` comprueba la trazabilidad de las frases del borrador frente a los claims verificados.

Actualmente registra `similarity_status: NOT_ASSESSABLE` cuando no existe un texto de referencia local para una comparación de similitud. Por tanto, este control **no debe confundirse con un detector externo de plagio**.

Su función implementada es principalmente de trazabilidad: toda frase factual generada automáticamente debe poder vincularse a una afirmación verificada.

---

## 23. Publication Gate

### `npm run check:publication`

`check-publication-gate.mjs` es la barrera final.

Para cada artículo con `status: published`, exige un registro en `editorial/publication-gates` con:

- `article`;
- `verification_completed: true`;
- `publication_claims` no vacío;
- `publication_sources_support: true`;
- `material_contradictions_resolved: true`;
- `human_editorial_approval: true`.

Además comprueba que cada claim declarado publicable:

1. figure como `VERIFIED` en su caso;
2. pertenezca al `publishable_scope`.

Por tanto, el estado `published` del Markdown no es suficiente por sí solo.

**La publicación no es una consecuencia automática del ranking, de la evidencia encontrada ni de la redacción generada.**

---

## 24. Auditoría de proceso

### `npm run audit:event`

`audit-event.mjs` registra eventos por caso en `editorial/audit/CASE-########.jsonl`.

Cada evento conserva:

- secuencia;
- timestamp;
- caso;
- etapa;
- tipo de evento;
- estado;
- actor (`SYSTEM`);
- hash del evento anterior;
- detalles.

La cadena hash permite detectar alteraciones o rupturas de secuencia.

### `npm run audit:validate`

`validate-audit-log.mjs` comprueba:

- JSON válido;
- secuencia continua;
- identificadores esperados;
- correspondencia con el caso;
- timestamps;
- integridad de la cadena hash.

---

## 25. Impacto editorial de cambios

### `npm run impact:propagate`

`propagate-editorial-impact.mjs` detecta cambios materiales en evidencia y propaga su impacto a:

- evidencias;
- claims dependientes;
- cálculos;
- frases del artículo.

Distingue niveles de impacto y, cuando se afecta el claim central o una frase crítica, eleva la revisión a un nivel superior.

### `npm run impact:published`

`check-published-impact.mjs` revisa un artículo ya publicado cuando aparece evidencia modificada, sustituida, controvertida, obsoleta o inválida.

Puede generar:

- `NO_IMPACT`;
- `REVIEW_REQUIRED`;
- `CORRECTION_REQUIRED`.

Si la evidencia afecta al titular o a la entradilla, la revisión se eleva específicamente a corrección.

---

## 26. Correcciones, versiones y avisos

### `npm run correction:create`

`create-correction-record.mjs` crea un registro `COR-########` cuando existe un impacto que requiere corrección/revisión.

El registro identifica evidencia desencadenante, claims, frases y cálculos afectados. La decisión permanece pendiente.

### `npm run correction:validate`

`validate-correction-records.mjs` comprueba estados, decisiones, aprobación humana, versiones y fechas de aplicación.

### `npm run version:create`

`create-article-version.mjs` crea un registro histórico de versión. Exige que la corrección esté `APPROVED` y admite `UPDATE`, `CORRECTION` y `WITHDRAWAL`.

La creación de la versión **no modifica automáticamente el contenido publicado**.

### `npm run version:validate`

`validate-article-versions.mjs` verifica continuidad de versiones, `previous_version`, motivos de cambio y estados.

### `npm run notice:create`

`create-change-notice.mjs` genera avisos de actualización o corrección para cambios que afecten contenido publicado.

Los avisos nacen como `DRAFT` y requieren decisión y aprobación editorial.

---

## 27. Recuperación ante fallos

### `npm run recovery:record`

`record-editorial-failure.mjs` registra fallos de ejecución como `FAIL-########`, asociados a:

- `run_id`;
- `case_id`;
- etapa;
- intento;
- tipo y mensaje del error;
- checkpoint;
- siguiente acción.

### `npm run recovery:validate`

`validate-failure-records.mjs` valida la estructura de esos registros y sus estados permitidos.

La filosofía es que un fallo no debe desaparecer silenciosamente: debe quedar registrado para recuperación y auditoría.

---

## 28. Migración de artículos antiguos

### `npm run legacy:inventory`

`inventory-legacy-articles.mjs` inventaría artículos históricos pendientes de migración.

### `npm run legacy:review:init`

`legacy-review-init.mjs` inicia un expediente de revisión para un artículo marcado `LEGACY_UNREVIEWED`.

### `npm run legacy:certify:validate`

`validate-legacy-certifications.mjs` comprueba que un artículo `CERTIFIED` tenga reconstrucción de claims, mapeo de evidencia, verificación, aprobación humana, Publication Gate y auditoría.

### `npm run legacy:gate:readiness`

`check-legacy-gate-readiness.mjs` comprueba la preparación del corpus legado para pasar por el sistema de certificación.

La existencia histórica de un artículo no se trata como equivalente a la certificación bajo el estándar actual.

---

## 29. Validaciones globales de CI

El repositorio contiene `.github/workflows/editorial-validation.yml`, ejecutado en `push` a `main` y en `pull_request` contra `main`.

La workflow instala dependencias con `npm ci --ignore-scripts` y ejecuta, en cadena:

1. `validate:articles`;
2. `validate:verification`;
3. `validate:claims`;
4. `validate:independence`;
5. `validate:lineage`;
6. `audit:validate`;
7. `recovery:validate`;
8. `legacy:certify:validate`;
9. `legacy:gate:readiness`;
10. `test:e2e:editorial`;
11. `check:publication`.

El workflow se presenta como una barrera editorial global: un artículo publicado necesita expediente de aprobación, claims verificadas, fuentes de soporte, contradicciones materiales resueltas y aprobación humana explícita.

---

## 30. Validación de artículos

### `npm run validate:articles`

Comprueba los artículos Markdown de `content/articles` y exige:

- `title`;
- `description`;
- `date`;
- `section`;
- `author`;
- `type`;
- `status`.

También valida formato de fecha, secciones permitidas, correspondencia sección/autor y expediente de verificación cuando el estado es `verified` o `published`.

Las secciones y autores codificados actualmente son:

| Sección | Autor |
|---|---|
| Actualidad | Clara Valdés Moreno |
| Política | Álvaro Serrano Vidal |
| Economía | Marta Robles Ferrer |
| Sociedad | Elena Campos Navarro |
| Mundo | Daniel Ortega Salvat |
| Tecnología | Lucía Martín Vega |

---

## 31. Validación de expedientes de verificación

### `npm run validate:verification`

Comprueba que los artículos `verified` o `published` dispongan de expediente y que éste documente, como mínimo:

- fuentes de publicación;
- relación claim/evidencia;
- control temporal;
- corroboración y contradicciones;
- riesgos de interpretación;
- puntos no resueltos;
- aprobación humana.

### `npm run validate:claims`

`validate-claim-evidence.mjs` comprueba específicamente la trazabilidad afirmación → evidencia y la estructura de los expedientes.

### `npm run validate:independence`

Comprueba que los expedientes de artículos verificados/publicados documenten corroboración, independencia/procedencia y un resultado explícito sobre conflictos.

---

## 32. Estado real del sistema: automatización frente a autoridad

La arquitectura permite distinguir cinco niveles:

**1. Detectar**  
Encontrar una pista o señal.

**2. Documentar**  
Asociar claims, fuentes, documentos y evidencia.

**3. Verificar**  
Evaluar suficiencia, temporalidad, contradicciones, procedencia e independencia.

**4. Redactar**  
Construir un borrador limitado al alcance verificado.

**5. Autorizar**  
Decisión editorial humana formalizada mediante Publication Gate.

La automatización domina los cuatro primeros niveles de forma creciente, pero el quinto permanece deliberadamente fuera de la autonomía del sistema.

---

## 33. Comando maestro

`npm run pipeline -- --title "..."` orquesta el proceso completo:

`investigate` → `claims` → `dependencies` → `research-plan` → `web-research` → `search-web` → `import-web-results` → `resolve-source` → `source-authority` → `retrieve-evidence` → `prepare-evidence-candidates` → `check-provenance` → `contrast` → `resolve-contradictions` → `evidence-sufficiency` → `evidence-coverage` → `enforce-source-independence` → `temporal-verify` → `verify` → `propagate-uncertainty` → `scope` → `original-article` → `article-scope-guard` → `language-guard` → `trace-article` → `validate-calculation-provenance` → `propagate-editorial-impact` → `check-originality` → `check-publication-gate`.

Cada etapa registra un evento de auditoría. Varias etapas pueden detener o poner el caso en revisión. El gate final no hereda `allowFailure`: la barrera de publicación es deliberadamente más estricta que las etapas exploratorias.

---

## 34. Conclusión técnica

MALDITO ESPEJO no está construido como una simple cadena de generación de artículos. El repositorio implementa una **infraestructura de verificación editorial** en la que una noticia debe conservar una cadena de custodia lógica:

`pista → caso → claims → dependencias → fuentes → evidencia → procedencia → contraste → suficiencia → temporalidad → verificación → alcance → redacción → trazabilidad → gate editorial`.

La arquitectura también contempla el ciclo posterior a la publicación: cambios en evidencia → propagación de impacto → revisión → corrección/actualización → nueva versión → aviso público cuando proceda.

El principio técnico que atraviesa el sistema es simple: **ninguna capa automática puede transformar una señal en un hecho ni una recomendación en una autorización editorial**.
