import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Aviso Legal",
  description:
    "Aviso legal de MALDITOESPEJO. Titularidad, condiciones de uso, propiedad intelectual y exención de responsabilidad.",
  alternates: { canonical: "/aviso-legal" },
  openGraph: {
    siteName: "MALDITOESPEJO",
    title: "Aviso Legal — MALDITOESPEJO",
    description:
      "Titularidad, condiciones de uso, propiedad intelectual y exención de responsabilidad.",
    type: "website",
    locale: "es_ES",
  },
  twitter: {
    card: "summary",
    title: "Aviso Legal — MALDITOESPEJO",
    description: "Titularidad, condiciones de uso y exención de responsabilidad.",
  },
};

export default function AvisoLegalPage() {
  return (
    <div className="container-editorial py-16 md:py-24">
      <nav aria-label="Migas de pan" className="mb-10 text-xs text-faint">
        <Link href="/" className="hover:text-ink transition-colors">
          Inicio
        </Link>
        <span className="mx-2">/</span>
        <span className="text-muted">Aviso Legal</span>
      </nav>

      <div className="max-w-[var(--max-width-reading)]">
        <p className="text-xs uppercase tracking-[0.2em] text-faint mb-6">Información legal</p>
        <h1 className="font-display font-bold tracking-tight text-4xl md:text-5xl text-foreground mb-8 leading-tight">
          Aviso Legal
        </h1>
        <p className="text-muted">Última actualización: septiembre de 2026</p>
      </div>

      <div className="mt-12 pt-12 border-t border-border max-w-[var(--max-width-reading)] space-y-12 text-foreground leading-relaxed">
        <div>
          <h2 className="font-display font-bold tracking-tight text-2xl mb-4">1. Identificación del responsable</h2>
          <p>
            En cumplimiento de lo establecido en la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la
            Información y de Comercio Electrónico (LSSI-CE), y del Reglamento (UE) 2016/679, General de Protección
            de Datos (RGPD), se facilita la siguiente información:
          </p>
          <ul className="list-none space-y-3 mt-4 pl-0">
            <li><strong>Denominación del proyecto:</strong> MALDITOESPEJO</li>
            <li><strong>Naturaleza:</strong> Proyecto editorial independiente, sin personalidad jurídica propia ni finalidad comercial</li>
            <li><strong>Objeto:</strong> Divulgación informativa basada en hechos, datos, documentos y declaraciones atribuibles, sin opinión ni interpretación</li>
            <li><strong>Finalidad:</strong> Editorial, no comercial. El proyecto no realiza actividades comerciales, no vende productos o servicios, ni genera ingresos publicitarios</li>
            <li><strong>Ámbito territorial:</strong> España y Unión Europea</li>
            <li>
              <strong>Contacto:</strong> Mediante correo electrónico a{" "}
              <a href="mailto:carmelocotonblanco@gmail.com" className="text-accent hover:underline">carmelocotonblanco@gmail.com</a>
            </li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold tracking-tight text-2xl mb-4">2. Condiciones de uso</h2>
          <p>El acceso al sitio web MALDITOESPEJO es libre y gratuito. Su uso atribuye la condición de usuario, quien acepta las siguientes condiciones:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Utilizar los contenidos con fines exclusivamente informativos, educativos o de investigación.</li>
            <li>No emplear los contenidos con fines ilícitos o contrarios al ordenamiento jurídico vigente.</li>
            <li>No reproducir, distribuir o modificar los contenidos sin autorización expresa del titular.</li>
            <li>No realizar acciones que puedan dañar, inutilizar o sobrecargar el funcionamiento del sitio web.</li>
          </ul>
          <p className="mt-4">El titular se reserva el derecho de modificar estas condiciones en cualquier momento, siendo efectivas desde su publicación en el sitio web.</p>
        </div>

        <div>
          <h2 className="font-display font-bold tracking-tight text-2xl mb-4">3. Propiedad intelectual</h2>
          <p>Todos los contenidos del sitio web, incluyendo textos, análisis, estructura, diseño gráfico y código fuente, están protegidos por las normas de propiedad intelectual e industrial aplicables.</p>
          <p>La titularidad de los derechos de explotación corresponde al responsable del proyecto MALDITOESPEJO, salvo indicación expresa en contrario.</p>
          <p>Queda prohibida la reproducción, distribución, comunicación pública o transformación, total o parcial, de los contenidos sin autorización expresa y por escrito del titular.</p>
          <p>El acceso al sitio web no implica, en ningún caso, cesión, renuncia o transmisión de derechos de propiedad intelectual o industrial.</p>
        </div>

        <div>
          <h2 className="font-display font-bold tracking-tight text-2xl mb-4">4. Exclusión de responsabilidad</h2>
          <p>Los contenidos publicados en MALDITOESPEJO tienen carácter exclusivamente informativo y editorial.</p>
          <p className="font-medium text-foreground mt-4">En ningún caso constituyen asesoramiento profesional, consultoría ni recomendación de productos o servicios.</p>
          <p className="mt-4">El responsable del proyecto no se responsabiliza de:</p>
          <ul className="list-disc list-inside space-y-2 mt-4">
            <li>Las decisiones adoptadas por los usuarios a partir de la información contenida en el sitio web.</li>
            <li>El uso que terceros puedan hacer de los contenidos publicados, incluyendo su reproducción, modificación o interpretación.</li>
            <li>La exactitud, actualidad o integridad de la información en todo momento.</li>
            <li>Los contenidos, políticas de privacidad o prácticas de los sitios web de terceros enlazados, cuya inclusión tiene finalidad exclusivamente informativa y no implica respaldo ni relación alguna con dichos sitios.</li>
            <li>Los daños o perjuicios derivados del uso o imposibilidad de uso del sitio web, incluyendo interrupciones técnicas o errores en el acceso.</li>
          </ul>
        </div>

        <div>
          <h2 className="font-display font-bold tracking-tight text-2xl mb-4">5. Legislación aplicable y jurisdicción</h2>
          <p>Las presentes condiciones se rigen por la legislación española y la normativa de la Unión Europea que resulte de aplicación.</p>
          <p>Para la resolución de cualquier controversia que pudiera derivarse del acceso o uso del sitio web, las partes se someten a la jurisdicción de los juzgados y tribunales españoles competentes.</p>
        </div>
      </div>
    </div>
  );
}
