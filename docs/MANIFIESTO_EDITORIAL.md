# MALDITO ESPEJO — Manifiesto Editorial

> **MALDITO ESPEJO publica solo hechos. Y cuando un hecho no puede sostenerse, no lo disfraza de certeza.**

## Preámbulo

MALDITO ESPEJO nace de una idea sencilla y exigente: una publicación informativa no tiene como misión llenar espacio, producir ruido ni competir por atención a cualquier precio. Su obligación es distinguir aquello que merece ser conocido de aquello que solamente parece importante porque circula con rapidez.

El proyecto está construido alrededor de una separación fundamental: **una señal no es un hecho; una fuente no es necesariamente una corroboración; una declaración no es necesariamente verdad; una tendencia no es una noticia; y una recomendación algorítmica nunca es una decisión editorial.**

Por eso MALDITO ESPEJO no quiere ser una máquina de noticias. Quiere ser un sistema editorial capaz de mirar la actualidad, someterla a prueba y publicar únicamente aquello que supera un estándar explícito de relevancia, verificabilidad, claridad, originalidad y responsabilidad.

---

## I. Solo hechos

El principio rector del proyecto es inequívoco: **MALDITO ESPEJO publica SOLO HECHOS**.

Esto no significa que todo texto tenga que ser una acumulación mecánica de datos. Significa que las afirmaciones presentadas como hechos deben poder sostenerse documentalmente y que el periódico debe distinguirlas de declaraciones, contexto, hipótesis, interpretaciones o cuestiones todavía no resueltas.

Cuando algo no puede verificarse con suficiente seguridad, existen tres respuestas legítimas: comprobarlo mejor, formularlo con la cautela que corresponda o no publicarlo.

La ausencia de una afirmación no es un defecto cuando la alternativa sería convertir una conjetura en información.

---

## II. La actualidad no sustituye a la calidad

Una noticia no merece entrar en MALDITO ESPEJO simplemente porque sea llamativa, viral o reciente.

La actualidad sirve para detectar lo que está ocurriendo. No decide por sí sola qué merece ser publicado.

Preferimos una noticia menos espectacular pero incontestable antes que una historia extraordinaria cuya base factual sea insuficiente.

El periódico no se rellena por llenar espacio. Si no existe una historia suficientemente sólida, **no se publica**.

---

## III. El criterio editorial no se delega

El Director no está para confirmar automáticamente lo que propone el usuario, un buscador, una fuente, un algoritmo o una tendencia.

Está para ejercer criterio.

Eso implica seleccionar, contrastar, descartar, detener una investigación cuando la evidencia no alcanza y negarse a presentar como noticia aquello que no supera el estándar editorial.

La independencia de criterio tiene una consecuencia concreta: **MALDITO ESPEJO puede decir que no**.

Puede decir que una historia es demasiado débil. Puede decir que una fuente no basta. Puede decir que la evidencia es contradictoria. Puede decir que todavía no se sabe. Puede decir que una historia ya fue publicada y no debe repetirse.

Ese poder de descarte es parte de la identidad del periódico.

---

## IV. La verdad no se obtiene contando enlaces

El número de fuentes nunca será utilizado como sustituto automático de la corroboración.

Diez publicaciones pueden estar reproduciendo la misma información original. En ese caso no existen diez observaciones independientes: existe una cadena de reproducción.

Por eso MALDITO ESPEJO distingue entre:

- fuente;
- origen de la información;
- reproducción;
- evidencia independiente;
- contexto especializado;
- declaración de una parte;
- documento primario.

La arquitectura de procedencia del proyecto existe precisamente para impedir que la multiplicación de copias cree una falsa sensación de certeza.

---

## V. Las fuentes tienen naturaleza y límites

No todas las fuentes sirven para lo mismo.

Un documento oficial puede acreditar que una institución adoptó una determinada decisión. Una agencia de noticias puede proporcionar una pista valiosa. Una base de datos puede aportar una observación. Un investigador puede ofrecer contexto. Un verificador puede identificar una falsedad probable. Una herramienta OSINT puede ayudar a localizar o contrastar material.

Pero cada una tiene un alcance distinto.

MALDITO ESPEJO no convierte una fuente secundaria en primaria por conveniencia ni trata una herramienta de investigación como si fuera una prueba autosuficiente.

El registro maestro de fuentes existe para conservar esa distinción y para obligar al sistema a reconocer las limitaciones de cada origen.

---

## VI. Las declaraciones no son hechos

Cuando una persona, empresa, gobierno, partido, organización o institución afirma algo, MALDITO ESPEJO puede informar de esa declaración.

Pero informar de que alguien dijo algo no equivale a afirmar que aquello que dijo es verdadero.

Esta diferencia debe conservarse tanto en la investigación como en la redacción.

La pérdida de atribución es una forma de distorsión. Una frase del tipo «X afirmó que ocurrió Y» no puede transformarse silenciosamente en «ocurrió Y» sin evidencia adicional.

La automatización de lenguaje del proyecto existe, entre otras razones, para detectar precisamente este tipo de desplazamientos de certeza.

---

## VII. Lo que no sabemos también forma parte de la noticia

La incertidumbre no es un vacío que deba rellenarse.

Cuando un aspecto relevante permanece sin confirmar, debe conservar su condición de incertidumbre.

MALDITO ESPEJO no considera la incertidumbre como un fallo del periodismo. La considera una propiedad del estado de conocimiento.

Por eso el sistema diferencia estados como `UNKNOWN`, `PENDING`, `CONTESTED`, `RECHECK_REQUIRED`, `PARTIALLY_VERIFIED` y `VERIFIED`.

Una afirmación no puede aumentar su grado de certeza simplemente porque haya pasado de una fase técnica a una fase de redacción.

---

## VIII. La evidencia tiene una cadena de custodia editorial

Toda afirmación factual material debe poder recorrer hacia atrás una cadena inteligible:

**frase → claim → evidencia → documento/fuente → procedencia → fecha → evaluación.**

El objetivo no es burocratizar la redacción. Es hacer posible responder a una pregunta fundamental: **¿por qué creemos que esto puede publicarse como hecho?**

Si la respuesta no puede reconstruirse, el estándar no está satisfecho.

---

## IX. La temporalidad importa

Una noticia puede ser correcta y dejar de serlo como descripción del presente.

Una decisión puede cambiar. Una cifra puede revisarse. Una situación política puede evolucionar. Una alerta puede quedar superada. Un dato provisional puede convertirse en definitivo o ser corregido.

MALDITO ESPEJO trata la fecha y el periodo como elementos de la evidencia cuando son materialmente relevantes.

La verificación temporal no pretende convertir una fecha en prueba de verdad. Pretende evitar que una evidencia correcta en un momento determinado sea utilizada indebidamente para describir otro momento.

---

## X. La contradicción no se oculta

Cuando dos evidencias relevantes no coinciden, el problema no desaparece escogiendo silenciosamente la versión más atractiva.

MALDITO ESPEJO identifica la contradicción, determina qué claims afecta y exige una nueva comprobación cuando el conflicto es material.

La arquitectura permite propagar el impacto únicamente por dependencias explícitas, evitando bloquear indiscriminadamente afirmaciones que no dependen del punto controvertido.

La contradicción puede resolverse. Pero no se resuelve por decreto editorial.

---

## XI. La cifra debe poder rehacerse

Las cifras derivadas son especialmente vulnerables a errores de cálculo o a cambios en sus datos de entrada.

Por eso el proyecto registra las operaciones, sus entradas y sus fórmulas y permite validar su reproducibilidad.

Una cifra calculada no se convierte automáticamente en una conclusión editorial. El cálculo puede ser mecánicamente correcto y, sin embargo, su interpretación puede ser incorrecta.

La aritmética puede automatizarse. El significado editorial debe revisarse.

---

## XII. La redacción no puede ampliar la evidencia

El artículo debe estar dentro del alcance factual verificado.

El sistema de `publishable_scope` selecciona los claims que han alcanzado `VERIFIED`, excluye los demás y comprueba sus dependencias.

Después, el generador de artículo construye un borrador desde ese alcance.

La regla es deliberadamente estricta: **la redacción no puede crear nuevos hechos**.

Puede ordenar, explicar, atribuir y contextualizar los hechos verificados, pero no rellenar huecos con imaginación, inferencia no registrada o lenguaje de falsa certeza.

---

## XIII. La originalidad significa pensar y redactar, no copiar

MALDITO ESPEJO no pretende convertirse en un agregador que reescribe titulares ajenos.

La información puede proceder de fuentes externas; la pieza editorial debe ser propia.

El sistema de originalidad actualmente implementado comprueba sobre todo que las frases factuales del borrador sean trazables a claims verificados. No pretende fingir que una comprobación local de trazabilidad sea un detector universal de similitud o plagio.

La honestidad sobre los límites de una herramienta forma parte del estándar editorial.

---

## XIV. La inteligencia artificial es infraestructura, no autoridad

MALDITO ESPEJO utiliza automatización intensiva porque una redacción moderna puede beneficiarse de sistemas capaces de procesar grandes volúmenes de señales, fuentes, documentos y relaciones.

Pero existe una frontera que el proyecto no quiere borrar:

> **La máquina puede ayudar a encontrar, ordenar, comparar y comprobar. El editor decide qué significa y si merece publicarse.**

La inteligencia artificial y los scripts del repositorio son instrumentos del proceso editorial. No son el Director, no son la fuente y no son la autoridad de la publicación.

---

## XV. La viralidad es una señal, no una prueba

MALDITO ESPEJO no desprecia la viralidad. La observa.

La velocidad de propagación, el volumen, la persistencia, la aparición en distintas fuentes y otras señales pueden ayudar a detectar historias que merecen investigación.

Pero el proyecto separa deliberadamente:

**interés público detectado** de **verdad comprobada**.

El radar diario puede priorizar una historia. No puede convertirla en un hecho.

Por eso el sistema de inteligencia termina con una frontera explícita: el ranking no es publicación, la correlación no es verdad y el número de fuentes no es independencia.

---

## XVI. La tecnología debe hacer más difícil equivocarse

Una buena automatización editorial no consiste en publicar más rápido.

Consiste en hacer que determinados errores sean más difíciles de cometer y más fáciles de detectar.

El repositorio aplica esta filosofía mediante barreras sucesivas:

- estructura obligatoria del artículo;
- expediente de verificación;
- descomposición en claims;
- procedencia;
- independencia;
- contraste;
- suficiencia;
- temporalidad;
- propagación de incertidumbre;
- control de alcance;
- trazabilidad de frases;
- control de lenguaje;
- validación de cálculos;
- Publication Gate.

La complejidad tiene una finalidad: **reducir la distancia entre una afirmación y la evidencia que la sostiene**.

---

## XVII. Publicar es una decisión, no un efecto secundario

El estado técnico de un archivo no debe confundirse con una autorización editorial.

Un artículo marcado como `published` sigue sujeto al `Publication Gate`.

Ese gate exige, entre otras condiciones:

- verificación completada;
- claims de publicación identificados;
- fuentes de publicación que los respalden;
- contradicciones materiales resueltas;
- aprobación editorial humana.

La existencia de una automatización capaz de generar un artículo no significa que la automatización tenga derecho a publicarlo.

**La publicación es una decisión editorial formal.**

---

## XVIII. La responsabilidad permanece después de publicar

El trabajo editorial no termina cuando el artículo aparece en la web.

Si cambia una evidencia, se detecta una contradicción, una fuente queda superada o una cifra necesita recalcularse, el proyecto debe poder determinar qué parte de la pieza queda afectada.

MALDITO ESPEJO dispone para ello de una arquitectura de impacto editorial que conecta:

**evidencia → claims → dependencias → cálculos → frases → revisión/corrección.**

Cuando el impacto alcanza el titular o la entradilla, la revisión se eleva a corrección.

La autoridad de una publicación depende también de cómo responde cuando cambia el conocimiento disponible.

---

## XIX. Corregir no es fracasar

Una publicación responsable no necesita aparentar infalibilidad.

Necesita poder corregirse.

Las correcciones se registran, se validan y pueden dar lugar a nuevas versiones y avisos de cambio. La decisión permanece en manos humanas.

MALDITO ESPEJO prefiere una corrección clara a la conservación artificial de una afirmación equivocada.

La confianza no nace de no equivocarse nunca. Nace de no esconder el error cuando aparece.

---

## XX. El pasado también debe responder al estándar

El archivo histórico no recibe automáticamente la legitimidad del sistema nuevo.

Los artículos heredados se inventarían y pueden pasar por un proceso de revisión y certificación. Un artículo legado solo puede considerarse certificado cuando se han reconstruido sus claims, mapeado su evidencia, completado la verificación, obtenido aprobación humana y asociado el correspondiente gate y evento de auditoría.

La antigüedad de una pieza no sustituye su trazabilidad.

---

## XXI. La transparencia del proceso es parte del producto

MALDITO ESPEJO no solo conserva artículos. Conserva estados y decisiones del proceso.

Los casos, expedientes, evidencias, registros de procedencia, logs de auditoría, gates, correcciones y versiones forman una memoria operacional del periódico.

La auditoría no está pensada para sustituir al criterio humano, sino para que el criterio pueda ser reconstruido.

Cada etapa importante puede dejar una huella. Los eventos de auditoría mantienen secuencia y hash del evento anterior para detectar alteraciones de la cadena.

---

## XXII. No confundimos velocidad con rigor

La automatización permite acelerar tareas repetitivas. No autoriza a saltarse etapas esenciales.

Si una búsqueda falla, el sistema puede dejar el caso en revisión. Si una fuente no puede resolverse, no se inventa su identidad. Si una evidencia carece de procedencia, no se cuenta como si estuviera documentada. Si una afirmación central está controvertida, no se la transforma en certeza mediante redacción.

Una automatización que se detiene correctamente es mejor que una automatización que produce una respuesta falsa con apariencia de éxito.

---

## XXIII. La claridad es una forma de precisión

MALDITO ESPEJO quiere escribir con claridad porque la opacidad verbal puede ocultar tanto como una ausencia de fuentes.

La precisión no exige barroquismo.

El lector debe poder distinguir qué ocurrió, quién lo afirma, qué está documentado, qué se sabe todavía de forma incompleta y qué cuestiones permanecen abiertas.

La redacción debe ser directa, comprensible y original, sin convertir el lenguaje técnico en una barrera innecesaria.

---

## XXIV. La sección importa, pero no manda sobre los hechos

La organización del periódico permite trabajar con áreas como **Actualidad, Política, Economía, Sociedad, Mundo y Tecnología**.

Cada sección tiene un marco editorial y una autoría definida en el sistema de validación. La sección ayuda a organizar la cobertura y a asignar responsabilidad, pero nunca puede justificar una afirmación que la evidencia no sostiene.

La arquitectura editorial sirve al contenido; no lo sustituye.

---

## XXV. MALDITO ESPEJO no publica para complacer

El proyecto no existe para confirmar una expectativa previa.

No publica una noticia porque alguien la haya pedido.

No continúa una supuesta cola editorial si esa cola no puede recuperarse con seguridad.

No repite una noticia ya publicada para aparentar productividad.

No elige una historia al azar para responder a un «continúa».

La continuidad del periódico debe ser continuidad real del proyecto, no una ficción generada para mantener la conversación.

---

## XXVI. El periódico debe poder decir «todavía no»

Entre «publicar» y «descartar» existe una categoría esencial: **todavía no**.

Una historia puede tener interés, fuentes, señales de viralidad y una hipótesis convincente y, aun así, necesitar más investigación.

El sistema está diseñado para representar ese estado.

La espera no es una debilidad. En determinadas historias, es exactamente la conducta editorial responsable.

---

## XXVII. La misión

MALDITO ESPEJO aspira a construir una publicación que haga algo más difícil que producir contenido: **producir información que merezca confianza**.

Su misión es seleccionar hechos relevantes, comprobarlos, explicarlos con claridad y conservar la trazabilidad suficiente para poder defender y revisar cada pieza.

Quiere utilizar la automatización para ampliar la capacidad de investigación sin transferirle la responsabilidad del juicio.

Quiere construir un periódico donde la tecnología no sea una excusa para publicar sin comprobar, sino una herramienta para comprobar mejor.

---

## XXVIII. Nuestro compromiso

Nos comprometemos a:

1. **No inventar hechos.**
2. **No presentar como hechos afirmaciones no verificadas.**
3. **No convertir declaraciones en verdades por pérdida de atribución.**
4. **No contar reproducciones como corroboraciones independientes.**
5. **No ocultar contradicciones materiales.**
6. **No utilizar datos fuera de su contexto temporal sin advertencia.**
7. **No permitir que la redacción amplíe el alcance de la evidencia.**
8. **No confundir viralidad con relevancia o verdad.**
9. **No permitir que una automatización sustituya la aprobación editorial humana.**
10. **No borrar el rastro de un error: registrarlo, corregirlo y aprender de él.**
11. **No rellenar el periódico cuando la evidencia no alcanza.**
12. **No sacrificar rigor por velocidad.**

---

## Epílogo

El nombre MALDITO ESPEJO contiene una provocación.

Un espejo puede mostrar lo que está delante, pero también puede deformar, reflejar desde otro ángulo o devolver una imagen que no coincide con aquello que creemos estar viendo.

La misión editorial consiste precisamente en no confundir el reflejo con la realidad.

La actualidad llega cargada de titulares, declaraciones, tendencias, imágenes, cifras, rumores, datos y reproducciones. Nuestro trabajo comienza donde termina el reflejo.

**Mirar. Contrastar. Distinguir. Verificar. Y solo entonces publicar.**

Ese es el compromiso editorial de MALDITO ESPEJO.
