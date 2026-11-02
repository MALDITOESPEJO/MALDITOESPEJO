import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Política de Privacidad",
  description:
    "Política de privacidad sin tracking ni cookies comerciales. Información sobre tratamiento de datos conforme al RGPD en MALDITOESPEJO.",
  alternates: { canonical: "/politica-de-privacidad" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Política de Privacidad — MALDITOESPEJO",
    description: "Tratamiento de datos conforme al RGPD. Sin tracking ni cookies comerciales.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Política de Privacidad — MALDITOESPEJO",
    description: "Tratamiento de datos conforme al RGPD.",
  },
};

export default function PoliticaPrivacidadPage() {
  return (
    <div className="container-editorial legal">
      <nav aria-label="Migas de pan" className="legal-crumbs">
        <Link href="/" className="hover:text-ink transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="legal-meta">Política de Privacidad</span>
      </nav>
      <div className="legal-head">
        <p className="kicker legal-kicker">Protección de datos</p>
        <h1 className="headline-xl legal-title">Política de Privacidad</h1>
      </div>
      <div className="legal-body">
        <div><h2 className="legal-h2">1. Responsable del tratamiento</h2><p>El responsable del tratamiento de los datos personales es el titular del proyecto editorial independiente MALDITOESPEJO.</p><p className="mt-4"><strong>Contacto:</strong> mediante correo electrónico a <a href="mailto:carmelocotonblanco@gmail.com" className="legal-link">carmelocotonblanco@gmail.com</a>.</p></div>
        <div><h2 className="legal-h2">2. Datos personales tratados</h2><p>Este sitio web no recoge datos personales de forma activa, salvo aquellos que el usuario facilite voluntariamente por correo electrónico.</p><p className="mt-4">Los datos que pueden ser tratados incluyen:</p><ul className="legal-list"><li>Nombre y apellidos (si se facilitan)</li><li>Dirección de correo electrónico</li><li>Mensaje o consulta remitida</li></ul><p className="mt-4"><strong>No se realizan:</strong> registros de usuarios, perfiles automatizados, seguimiento comercial, ni tratamiento de datos para finalidades distintas a la respuesta a consultas editoriales o de contacto.</p><p className="mt-4"><strong>No se venden ni se ceden datos personales</strong> a terceros para finalidades comerciales, publicitarias o de marketing.</p></div>
        <div><h2 className="legal-h2">3. Finalidad del tratamiento</h2><p>Los datos personales facilitados se utilizarán exclusivamente para las siguientes finalidades:</p><ul className="legal-list"><li>Responder a consultas editoriales o de contacto remitidas por el usuario</li><li>Mantener comunicación necesaria para atender las solicitudes recibidas</li><li>Gestionar, en su caso, colaboraciones o propuestas editoriales</li></ul><p className="mt-4"><strong>No se utilizarán los datos</strong> para finalidades comerciales, publicitarias, de marketing, envío de comunicaciones promocionales ni para elaborar perfiles de usuario.</p></div>
        <div><h2 className="legal-h2">4. Base jurídica del tratamiento</h2><p>La base legal del tratamiento de los datos personales es el consentimiento del interesado, conforme al artículo 6.1.a del Reglamento (UE) 2016/679, General de Protección de Datos (RGPD).</p><p className="mt-4">El usuario consiente el tratamiento de sus datos personales al remitir voluntariamente una consulta o mensaje por correo electrónico.</p><p className="mt-4">El consentimiento puede ser retirado en cualquier momento mediante comunicación al responsable, sin que ello afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada.</p></div>
        <div><h2 className="legal-h2">5. Conservación de los datos</h2><p>Los datos personales se conservarán únicamente durante el tiempo necesario para atender la finalidad para la que fueron recabados y, en todo caso, durante los plazos legalmente establecidos.</p><p className="mt-4">En general, los datos se conservarán mientras exista una relación comunicativa activa con el usuario y, una vez finalizada, durante el plazo de prescripción de acciones que pudieran derivarse de dicha relación.</p><p className="mt-4">Transcurrido el plazo de conservación, los datos serán suprimidos de forma segura, garantizando que no puedan ser recuperados ni accedidos.</p></div>
        <div><h2 className="legal-h2">6. Cesión y transferencias internacionales de datos</h2><p><strong>No se ceden datos personales a terceros</strong> para finalidades distintas a las indicadas en esta política, salvo obligación legal.</p><p className="mt-4"><strong>No se realizan transferencias internacionales de datos</strong> fuera del Espacio Económico Europeo (EEE). Todos los datos se procesan y almacenan dentro del territorio de la Unión Europea.</p><p className="mt-4">En caso de que fuera necesario recurrir a servicios de terceros para el funcionamiento técnico del sitio web (por ejemplo, servicios de hosting), se garantizará que dichos proveedores cumplan con las obligaciones del RGPD y no utilicen los datos para finalidades distintas a las estrictamente necesarias para la prestación del servicio.</p></div>
        <div><h2 className="legal-h2">7. Derechos del interesado</h2><p>El usuario, como interesado, tiene derecho a ejercer los siguientes derechos reconocidos en el RGPD:</p><ul className="legal-list"><li><strong>Derecho de acceso</strong> (art. 15 RGPD): obtener información sobre si se están tratando sus datos personales y, en su caso, acceder a los mismos.</li><li><strong>Derecho de rectificación</strong> (art. 16 RGPD): solicitar la corrección de datos inexactos o incompletos.</li><li><strong>Derecho de supresión</strong> (art. 17 RGPD): solicitar la eliminación de sus datos cuando, entre otros supuestos, ya no sean necesarios para las finalidades que motivaron su recogida.</li><li><strong>Derecho de limitación del tratamiento</strong> (art. 18 RGPD): solicitar la limitación del tratamiento en determinadas circunstancias.</li><li><strong>Derecho de oposición</strong> (art. 21 RGPD): oponerse al tratamiento de sus datos personales.</li><li><strong>Derecho a la portabilidad de los datos</strong> (art. 20 RGPD): recibir los datos personales en un formato estructurado y de uso común.</li><li><strong>Derecho a retirar el consentimiento</strong> en cualquier momento, sin que afecte a la licitud del tratamiento basado en el consentimiento previo a su retirada.</li></ul><p className="mt-4">Para ejercer estos derechos, el usuario puede dirigirse al responsable mediante correo electrónico a <a href="mailto:carmelocotonblanco@gmail.com" className="legal-link">carmelocotonblanco@gmail.com</a>, indicando claramente el derecho que desea ejercer y aportando los datos necesarios para su identificación.</p><p className="mt-4">El usuario tiene también derecho a presentar una reclamación ante la <a href="https://www.aepd.es/es" target="_blank" rel="noopener noreferrer" className="legal-link">Agencia Española de Protección de Datos (AEPD)</a> si considera que el tratamiento de sus datos personales vulnera la normativa de protección de datos.</p></div>
        <div><h2 className="legal-h2">8. Medidas de seguridad</h2><p>El responsable ha adoptado las medidas técnicas y organizativas necesarias para garantizar la seguridad de los datos personales y evitar su alteración, pérdida, tratamiento o acceso no autorizado, conforme a lo establecido en el artículo 32 del RGPD.</p></div>
        <div><h2 className="legal-h2">9. Modificaciones de la política de privacidad</h2><p>El responsable se reserva el derecho de modificar esta Política de Privacidad para adaptarla a cambios normativos, jurisprudenciales o técnicos. Cualquier modificación será publicada en esta página con indicación de la fecha de última actualización.</p><p className="mt-4">Se recomienda a los usuarios revisar periódicamente esta política para estar informados sobre cómo se protegen sus datos personales.</p></div>
      </div>
    </div>
  );
}
