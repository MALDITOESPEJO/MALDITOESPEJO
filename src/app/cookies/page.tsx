import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Cookies",
  description:
    "Política de cookies de MALDITOESPEJO. Uso exclusivo de cookies técnicas y de seguridad necesarias para el funcionamiento. Sin cookies de seguimiento ni publicidad.",
  alternates: { canonical: "/cookies" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Política de Cookies — MALDITOESPEJO",
    description: "Solo cookies técnicas. Sin seguimiento ni publicidad.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Política de Cookies — MALDITOESPEJO",
    description: "Solo cookies técnicas. Sin seguimiento ni publicidad.",
  },
};

export default function CookiesPage() {
  return (
    <article className="container-editorial py-16 md:py-24">
      <nav aria-label="Migas de pan" className="mb-10 text-xs text-faint">
        <Link href="/" className="hover:text-ink transition-colors">Inicio</Link>
        <span className="mx-2">/</span>
        <span className="text-muted">Cookies</span>
      </nav>
      <header className="max-w-[var(--max-width-reading)]">
        <p className="text-xs uppercase tracking-[0.2em] text-faint mb-6">Información técnica</p>
        <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground mb-8 leading-tight">Política de Cookies</h1>
        <p className="text-muted">Última actualización: septiembre de 2026</p>
      </header>
      <div className="mt-12 pt-12 border-t border-border max-w-[var(--max-width-reading)] space-y-12 text-foreground leading-relaxed">
        <div><h2 className="font-display font-bold tracking-tight text-2xl mb-4">1. Qué son las cookies</h2><p>Las cookies son pequeños archivos de texto que los sitios web almacenan en el dispositivo del usuario (ordenador, teléfono móvil, tableta) cuando este accede a ellos.</p><p>Estos archivos permiten que el sitio web recuerde información sobre la visita del usuario, como sus preferencias de idioma, configuración de visualización u otros datos técnicos, facilitando así la navegación y mejorando la experiencia de uso.</p><p>Las cookies pueden ser instaladas por el propio sitio web visitado (cookies propias) o por terceros que prestan servicios al sitio (cookies de terceros).</p></div>
        <div><h2 className="font-display font-bold tracking-tight text-2xl mb-4">2. Cookies utilizadas en este sitio web</h2><p>El sitio web MALDITOESPEJO utiliza exclusivamente cookies técnicas estrictamente necesarias para su correcto funcionamiento. En particular:</p><ul className="list-disc list-inside space-y-3 mt-4"><li><strong>Cookies de sesión:</strong> permiten mantener la navegación del usuario durante su visita al sitio. Se eliminan automáticamente al cerrar el navegador.</li><li><strong>Cookies técnicas de seguridad:</strong> contribuyen a la protección del sitio web frente a accesos no autorizados o usos indebidos.</li><li><strong>Cookies de preferencias técnicas:</strong> almacenan configuraciones básicas del usuario, como el idioma seleccionado o el modo de visualización, incluida la propia preferencia de cookies que el usuario indique en el aviso de este sitio.</li></ul><p className="mt-4">Estas cookies son imprescindibles para el funcionamiento del sitio y no requieren el consentimiento previo del usuario conforme al artículo 22.2 de la Ley 34/2002 (LSSI-CE).</p></div>
        <div><h2 className="font-display font-bold tracking-tight text-2xl mb-4">3. Cookies que no se utilizan</h2><p>El sitio web MALDITOESPEJO <strong>no utiliza</strong> los siguientes tipos de cookies:</p><ul className="list-disc list-inside space-y-2 mt-4"><li><strong>Cookies publicitarias:</strong> no se muestran anuncios ni se utilizan cookies para fines de publicidad.</li><li><strong>Cookies de seguimiento comercial:</strong> no se realiza seguimiento del comportamiento del usuario con fines de marketing.</li><li><strong>Cookies de perfilado:</strong> no se elaboran perfiles de usuario basados en su navegación.</li><li><strong>Cookies de redes sociales:</strong> no se integran botones de redes sociales que instalen cookies de seguimiento.</li><li><strong>Cookies analíticas de terceros con fines comerciales:</strong> no se utilizan herramientas de análisis que compartan datos con terceros para fines publicitarios.</li></ul><p className="mt-4">El compromiso del proyecto es mantener un uso mínimo y proporcional de las cookies, limitado a lo estrictamente necesario para el funcionamiento técnico del sitio.</p></div>
        <div><h2 className="font-display font-bold tracking-tight text-2xl mb-4">4. Gestión de cookies por el usuario</h2><p>El usuario puede configurar su navegador para aceptar, rechazar o eliminar las cookies. A continuación se proporcionan enlaces a las instrucciones de los navegadores más utilizados:</p><ul className="list-disc list-inside space-y-2 mt-4"><li><strong>Google Chrome:</strong> <a href="https://support.google.com/chrome/answer/95647?hl=es&co=GENIE.Platform%3DDesktop" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Configuración de cookies en Chrome</a></li><li><strong>Mozilla Firefox:</strong> <a href="https://support.mozilla.org/es/kb/cookies-informacion-que-los-sitios-web-guardan-en-" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Configuración de cookies en Firefox</a></li><li><strong>Safari:</strong> <a href="https://support.apple.com/es-es/guide/safari/sfri11471/mac" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Configuración de cookies en Safari</a></li><li><strong>Microsoft Edge:</strong> <a href="https://support.microsoft.com/es-es/microsoft-edge/eliminar-cookies-en-microsoft-edge-63947406-40ac-c3b8-57b9-2a946a29ae09" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Configuración de cookies en Edge</a></li></ul><p className="mt-4">Si el usuario desactiva las cookies técnicas, es posible que algunas funcionalidades del sitio web no funcionen correctamente o que la experiencia de navegación se vea afectada.</p></div>
        <div><h2 className="font-display font-bold tracking-tight text-2xl mb-4">5. Actualización de esta política</h2><p>Esta Política de Cookies podrá ser modificada para adaptarla a cambios normativos, técnicos o funcionales del sitio web.</p><p>Cualquier modificación será publicada en esta página con indicación de la fecha de última actualización. Se recomienda a los usuarios revisar periódicamente esta política.</p></div>
        <div><h2 className="font-display font-bold tracking-tight text-2xl mb-4">6. Más información</h2><p>Para cualquier consulta relacionada con el uso de cookies en este sitio web, el usuario puede ponerse en contacto mediante correo electrónico a <a href="mailto:carmelocotonblanco@gmail.com" className="text-accent hover:underline">carmelocotonblanco@gmail.com</a>.</p><p>Para obtener más información sobre cookies y sus derechos como usuario, puede consultar la página web de la <a href="https://www.aepd.es/es" target="_blank" rel="noopener noreferrer" className="text-accent hover:underline">Agencia Española de Protección de Datos (AEPD)</a>.</p></div>
      </div>
    </article>
  );
}
