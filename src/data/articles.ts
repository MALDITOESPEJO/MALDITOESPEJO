import type { Article } from "./types";

/* ============================================================
   MALDITOESPEJO — CONTENIDO DE DEMOSTRACION
   ------------------------------------------------------------
   TODO el contenido de este archivo es FICTICIO y esta marcado
   internamente con `isDemo: true`. No debe presentarse como
   informacion real. Sustituir por contenido editorial real en
   una fase posterior.
   ============================================================ */

/* Articulos principales de la demo (estructura rica). */
export const baseArticles: Article[] = [
  {
    slug: "gobierno-anuncia-medida-demonstracion",
    title: "El Gobierno anuncia una nueva medida sobre vivienda",
    dek: "La medida fue aprobada este lunes y entrará en vigor el 1 de enero. El texto oficial ha sido publicado.",
    section: "politica",
    publishedAt: "2026-08-31T09:00:00",
    author: { name: "Marta Ruiz", role: "Redacción" },
    keyFacts: [
      "El Gobierno aprobó la medida este lunes, 31 de agosto de 2026.",
      "La norma afecta al mercado de alquiler de las capitales de provincia.",
      "Entrará en vigor el 1 de enero de 2027.",
      "El texto oficial ha sido publicado en el boletín correspondiente.",
    ],
    unknownFacts: [
      "No consta en el texto oficial el calendario de desarrollo regulatorio de la norma.",
      "La información disponible no permite cuantificar el impacto presupuestario estimado.",
    ],
    body: [
      {
        type: "fact",
        content:
          "Este lunes el Gobierno ha aprobado una medida sobre vivienda en el mercado de alquiler de las capitales de provincia. La decisión se ha adoptado en la reunión ordinaria del Consejo de Ministros.",
      },
      {
        type: "fact",
        content:
          "La norma establece un marco temporal para determinadas operaciones de alquiler. El texto oficial, que recoge las disposiciones concretas, ha sido publicado y está accesible.",
      },
      {
        type: "fact",
        content:
          "La medida forma parte de un paquete más amplio, cuya tramitación legislativa continúa abierta.",
      },
    ],
    data: [
      { label: "Fecha de aprobación", value: "31/08/2026" },
      { label: "Entrada en vigor", value: "01/01/2027" },
      { label: "Ámbito", value: "Capitales de provincia" },
      { label: "Estado", value: "Aprobado en Consejo de Ministros" },
    ],
    sources: [
      { label: "Texto oficial de la norma" },
      { label: "Comparecencia del Ministerio" },
    ],
    whatsNext: [
      "El texto pasa ahora a la fase de desarrollo regulatorio.",
      "El ministerio ha convocado una comparecencia parlamentaria la próxima semana.",
    ],
    isDemo: true,
  },
  {
    slug: "inflacion-baja-agosto-demonstracion",
    title: "La inflación baja al 2,4% en agosto",
    dek: "El dato, publicado esta mañana, sitúa la tasa un 0,3 puntos por debajo del mes anterior.",
    section: "economia",
    publishedAt: "2026-08-31T08:30:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "La tasa interanual de inflación se situó en el 2,4% en agosto.",
      "La cifra supone una reducción de 0,3 puntos respecto a julio.",
      "El dato ha sido publicado esta mañana por el organismo competente.",
      "La energía registró la mayor caída de la cesta.",
    ],
    unknownFacts: [
      "Los efectos del repunte de los precios de alimentos de temporada aún no se han cuantificado.",
    ],
    body: [
      {
        type: "fact",
        content:
          "La tasa interanual de inflación se situó en el 2,4% en agosto, según el dato publicado esta mañana por el organismo estadístico oficial.",
      },
      {
        type: "fact",
        content:
          "La cifra supone una reducción de 0,3 puntos respecto a la tasa registrada en julio. La energía ha sido el componente con mayor contribución a la bajada.",
      },
      {
        type: "fact",
        content:
          "El dato coincidente y el núcleo subyacente muestran evoluciones distintas que se detallan en el informe publicado.",
      },
    ],
    data: [
      { label: "Tasa interanual", value: "2,4%" },
      { label: "Variación mensual", value: "-0,3 puntos" },
      { label: "Componente con mayor caída", value: "Energía" },
      { label: "Dato publicado", value: "31/08/2026" },
    ],
    sources: [
      { label: "Nota del organismo estadístico" },
    ],
    whatsNext: [
      "El organismo publicará el dato definitivo durante la segunda quincena de septiembre.",
      "El Banco Central ha señalado que evaluará la cifra en su próxima reunión.",
    ],
    isDemo: true,
  },
  {
    slug: "tribunal-supremo-sentencia-demonstracion",
    title: "El Tribunal Supremo dicta sentencia sobre el recurso presentado en 2024",
    dek: "La sala ha hecho pública la resolución este martes. El texto íntegro está disponible.",
    section: "actualidad",
    publishedAt: "2026-08-31T07:45:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "La sala ha hecho pública la sentencia este martes, 31 de agosto.",
      "El recurso fue presentado en noviembre de 2024.",
      "El texto íntegro de la resolución está disponible.",
      "La sentencia establece un criterio sobre el procedimiento recurrido.",
    ],
    unknownFacts: [
      "Las partes aún no han anunciado si presentarán recurso de casación.",
    ],
    body: [
      {
        type: "fact",
        content:
          "La sala correspondiente del Tribunal Supremo ha hecho pública este martes la sentencia sobre el recurso presentado en noviembre de 2024.",
      },
      {
        type: "fact",
        content:
          "La resolución establece el criterio del tribunal sobre el objeto del procedimiento. El texto íntegro de la sentencia está disponible para consulta.",
      },
      {
        type: "fact",
        content: "Las partes han recibido la notificación de la resolución.",
      },
    ],
    sources: [
      { label: "Texto de la sentencia" },
    ],
    whatsNext: [
      "Las partes disponen del plazo legal para decidir si interponen recurso de casación.",
    ],
    isDemo: true,
  },
  {
    slug: "censo-habitantes-region-demonstracion",
    title: "La población de la región crece un 1,8% en un año",
    dek: "El censo publicado esta semana recoge un aumento de 62.000 personas respecto al año anterior.",
    section: "sociedad",
    publishedAt: "2026-08-31T07:00:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "La población de la región creció un 1,8% en el último año.",
      "El aumento representa 62.000 personas más respecto al año anterior.",
      "El censo fue publicado esta semana por el organismo competente.",
      "El crecimiento se concentra en las áreas metropolitanas.",
    ],
    unknownFacts: [
      "El desglose definitivo por municipio se publicará dentro de dos meses.",
    ],
    body: [
      {
        type: "fact",
        content:
          "La población de la región creció un 1,8% en el último año, según el censo publicado esta semana por el organismo estadístico competente.",
      },
      {
        type: "fact",
        content:
          "El aumento representa 62.000 personas más respecto al año anterior. El crecimiento se concentra en las áreas metropolitanas.",
      },
      {
        type: "fact",
        content:
          "El resto del territorio registra una evolución estable durante el mismo periodo.",
      },
    ],
    data: [
      { label: "Crecimiento", value: "1,8%" },
      { label: "Personas más", value: "62.000" },
      { label: "Áreas con mayor aumento", value: "Metropolitanas" },
    ],
    sources: [
      { label: "Informe censal" },
    ],
    whatsNext: [
      "El desglose definitivo por municipio se publicará dentro de dos meses.",
    ],
    isDemo: true,
  },
  {
    slug: "tratado-comercial-firmado-demonstracion",
    title: "Dos países firman un tratado comercial en la cumbre regional",
    dek: "La firma tuvo lugar este lunes al mediodía. Los detalles se harán públicos mañana.",
    section: "mundo",
    publishedAt: "2026-08-31T06:30:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "La firma tuvo lugar este lunes al mediodía en la sede de la cumbre regional.",
      "Participan dos delegaciones nacionales.",
      "Los detalles del contenido se harán públicos mañana.",
      "El acuerdo requiere ratificación de los parlamentos de ambos países.",
    ],
    unknownFacts: [
      "No consta en la información disponible el texto íntegro del acuerdo.",
    ],
    body: [
      {
        type: "fact",
        content:
          "Dos países firmaron este lunes un tratado comercial en el marco de la cumbre regional que se celebra esta semana.",
      },
      {
        type: "fact",
        content:
          "La firma tuvo lugar al mediodía en la sede de la cumbre. Los detalles del contenido se harán públicos mañana mediante una nota conjunta.",
      },
      {
        type: "fact",
        content:
          "El acuerdo requerirá la ratificación de los parlamentos de ambos países antes de su entrada en vigor.",
      },
    ],
    sources: [
      { label: "Nota conjunta de las dos delegaciones" },
    ],
    whatsNext: [
      "Las delegaciones han anunciado una comparecencia conjunta para mañana.",
      "Los parlamentos iniciarán el proceso de ratificación en las próximas semanas.",
    ],
    isDemo: true,
  },
  {
    slug: "actualizacion-programa-empresa-demonstracion",
    title: "Una empresa publica una actualización de su programa de gestión",
    dek: "La versión nueva estará disponible para descarga a partir de mañana.",
    section: "tecnologia",
    publishedAt: "2026-08-31T06:00:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "La empresa publicó la actualización de su programa de gestión este lunes.",
      "La versión nueva estará disponible para descarga a partir de mañana.",
      "La actualización incorpora correcciones documentadas en la nota de la versión.",
      "Los requisitos de instalación se han publicado.",
    ],
    unknownFacts: [
      "La información disponible no permite determinar el calendario de las siguientes versiones.",
    ],
    body: [
      {
        type: "fact",
        content:
          "La empresa ha publicado este lunes una actualización de su programa de gestión. La versión nueva estará disponible para descarga a partir de mañana.",
      },
      {
        type: "fact",
        content:
          "La actualización incorpora las correcciones documentadas en la nota de versión. Los requisitos de instalación y el procedimiento de actualización han sido publicados.",
      },
    ],
    sources: [
      { label: "Nota de versión" },
    ],
    whatsNext: [
      "El equipo ha señalado que las incidencias conocidas se comunicarán a través del canal oficial.",
    ],
    isDemo: true,
  },
  {
    id: "gobierno-aprueba-medida-portada",
    slug: "gobierno-aprueba-medida-demonstracion-portada",
    title: "El Gobierno aprueba la nueva medida y publica el texto definitivo",
    dek: "El texto definitivo de la norma, con su anexo de aplicación, está ya publicado en el boletín oficial y accesible.",
    section: "politica",
    publishedAt: "2026-08-31T12:32:00",
    updatedAt: "2026-08-31T13:40:00",
    author: { name: "MALDITOESPEJO", isOrganization: true, role: "Redacción" },
    keyFacts: [
      "El Gobierno aprobó la norma este lunes por mayoría en el Consejo de Ministros.",
      "El texto definitivo fue publicado esta mañana junto a su anexo de aplicación.",
      "El texto definitivo establece que la medida entrará en vigor durante los próximos meses.",
      "El ministerio ha convocado una comparecencia parlamentaria la próxima semana.",
    ],
    unknownFacts: [
      "No consta en el texto publicado el calendario de desarrollo regulatorio de la norma.",
      "La información disponible no permite cuantificar el impacto presupuestario estimado.",
    ],
    timeline: [
      { time: "09:00", text: "El Gobierno aprueba la medida en la reunión ordinaria del Consejo de Ministros." },
      { time: "11:30", text: "El boletín oficial publica el texto definitivo y su anexo de aplicación." },
      { time: "13:40", text: "El ministerio anuncia la comparecencia parlamentaria de la próxima semana." },
    ],
    updates: [
      { time: "13:40", text: "Se incorpora el anuncio del ministerio de una comparecencia parlamentaria la próxima semana." },
    ],
    body: [
      {
        type: "fact",
        content:
          "El Gobierno aprobó este lunes la nueva medida en la reunión ordinaria del Consejo de Ministros y publicó el texto definitivo de la norma.",
        sourceIds: ["source-1", "source-2"],
      },
      {
        type: "fact",
        content:
          "El documento establece el procedimiento de aplicación y recoge su anexo. Tanto el texto como su anexo están accesibles en el boletín oficial.",
        sourceIds: ["source-2"],
      },
      {
        type: "statement",
        attribution: "Ministerio competente",
        content:
          "El Ministerio competente ha afirmado que la norma entrará en vigor durante los próximos meses y ha anunciado la convocatoria de una comparecencia parlamentaria la próxima semana para detallar el calendario de desarrollo.",
        sourceIds: ["source-1"],
      },
      {
        type: "fact",
        content: "El texto publicado es la versión definitiva.",
        sourceIds: ["source-2"],
      },
    ],
    data: [
      { label: "Fecha de aprobación", value: "31/08/2026" },
      { label: "Entrada en vigor", value: "Próximos meses" },
      { label: "Estado", value: "Aprobado y publicado" },
    ],
    sources: [
      {
        id: "source-1",
        entity: "Ministerio competente",
        label: "Comunicado de aprobación",
        nature: "comunicado oficial",
        date: "31 agosto 2026",
      },
      {
        id: "source-2",
        entity: "Boletín oficial",
        label: "Texto definitivo y anexo de aplicación",
        nature: "documento",
        date: "31 agosto 2026",
      },
      {
        id: "source-3",
        entity: "Sala de prensa del Gobierno",
        label: "Comparecencia parlamentaria",
        nature: "rueda de prensa",
        date: "31 agosto 2026",
      },
    ],
    whatsNext: [
      "El ministerio ha convocado una comparecencia parlamentaria la próxima semana.",
    ],
    relatedArticles: [
      "gobierno-anuncia-medida-demonstracion",
      "banco-central-tipos-demonstracion",
      "inflacion-baja-agosto-demonstracion",
    ],
    isDemo: true,
  },
  {
    slug: "banco-central-tipos-demonstracion",
    title: "El Banco Central publica la decisión sobre los tipos oficiales",
    dek: "La entidad mantiene el tipo de referencia y detalla su calendario de revisiones.",
    section: "economia",
    publishedAt: "2026-08-31T12:18:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "El Banco Central mantiene hoy el tipo de referencia vigente.",
      "El comunicado detalla el calendario de revisiones trimestrales.",
      "La decisión fue adoptada por el consejo de gobierno.",
    ],
    unknownFacts: [
      "Las actas detalladas de la reunión se publicarán dentro de tres semanas.",
    ],
    body: [
      {
        type: "fact",
        content:
          "El Banco Central ha publicado este mediodía la decisión de su consejo de gobierno sobre los tipos oficiales de referencia.",
      },
      {
        type: "fact",
        content:
          "La entidad mantiene el tipo vigente y comunica el calendario de revisiones para los próximos trimestres.",
      },
      {
        type: "fact",
        content:
          "Las actas detalladas de la reunión se harán públicas dentro de tres semanas.",
      },
    ],
    sources: [
      { label: "Comunicado del Banco Central" },
    ],
    whatsNext: [
      "La próxima revisión está prevista para la reunión de septiembre.",
    ],
    isDemo: true,
  },
  {
    slug: "ue-posicion-comun-demonstracion",
    title: "La UE acuerda una posición común en la reunión ministerial",
    dek: "Los ministros cerraron la declaración al término de la jornada de hoy.",
    section: "mundo",
    publishedAt: "2026-08-31T12:04:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "Los ministros acordaron una posición común al final de la jornada.",
      "La declaración conjunta fue publicada por la presidencia de turno.",
      "El acuerdo recoge los puntos consensuados por todas las delegaciones.",
    ],
    unknownFacts: [
      "El texto definitivo de la declaración se publicará mañana.",
    ],
    body: [
      {
        type: "fact",
        content:
          "Los ministros de la Unión Europea acordaron este lunes una posición común al término de la reunión ministerial celebrada hoy.",
      },
      {
        type: "fact",
        content:
          "La presidencia de turno publicó la declaración conjunta, que recoge los puntos consensuados por todas las delegaciones.",
      },
      {
        type: "fact",
        content: "El texto definitivo de la declaración se hará público mañana.",
      },
    ],
    sources: [
      { label: "Declaración de la presidencia de turno" },
    ],
    whatsNext: [
      "El texto definitivo de la declaración se publicará mañana.",
    ],
    isDemo: true,
  },
  {
    slug: "ministerio-empleo-demonstracion",
    title: "El Ministerio publica las cifras trimestrales de empleo",
    dek: "El informe recoge los datos del segundo trimestre desglosados por sector.",
    section: "sociedad",
    publishedAt: "2026-08-31T11:51:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "El Ministerio publicó hoy el informe trimestral de empleo.",
      "El informe desglosa los datos por sector y por comunidad autónoma.",
      "Los datos recogen el segundo trimestre del año.",
    ],
    unknownFacts: [
      "El desglose definitivo por municipio se publicará más adelante.",
    ],
    body: [
      {
        type: "fact",
        content:
          "El Ministerio publicó este lunes el informe trimestral de empleo, que recoge los datos del segundo trimestre desglosados por sector.",
      },
      {
        type: "fact",
        content:
          "El informe incluye la distribución por comunidad autónoma y las variaciones respecto al trimestre anterior.",
      },
      {
        type: "fact",
        content:
          "El desglose definitivo por municipio se publicará en fechas posteriores.",
      },
    ],
    sources: [
      { label: "Informe trimestral de empleo" },
    ],
    whatsNext: [
      "El próximo informe trimestral se publicará dentro de tres meses.",
    ],
    isDemo: true,
  },
  {
    slug: "empresa-servicio-pago-demonstracion",
    title: "La empresa presenta su nuevo servicio de pago",
    dek: "El servicio estará disponible inicialmente en dos países.",
    section: "tecnologia",
    publishedAt: "2026-08-31T11:37:00",
    author: { name: "MALDITOESPEJO", isOrganization: true },
    keyFacts: [
      "La empresa presentó hoy su nuevo servicio de pago.",
      "El servicio estará disponible inicialmente en dos países.",
      "Los requisitos técnicos se han publicado en la documentación oficial.",
    ],
    unknownFacts: [
      "La información disponible no permite determinar el calendario de expansión a otros mercados.",
    ],
    body: [
      {
        type: "fact",
        content:
          "La empresa presentó este lunes su nuevo servicio de pago, que estará disponible inicialmente en dos países.",
      },
      {
        type: "fact",
        content:
          "Los requisitos técnicos y el procedimiento de alta se han publicado en la documentación oficial.",
      },
      {
        type: "fact",
        content:
          "La empresa no ha anunciado aún un calendario de expansión a otros mercados.",
      },
    ],
    sources: [
      { label: "Documentación del servicio" },
    ],
    whatsNext: [
      "La empresa ha señalado que comunicará el calendario de expansión en próximas fechas.",
    ],
    isDemo: true,
  },
];
export const articles: Article[] = baseArticles;

export function getArticleBySlug(slug: string): Article | undefined {
  return articles.find((a) => a.slug === slug);
}
