import Link from "next/link";

export function Footer() {
  const year = new Date().getFullYear();

  return (
    <footer className="mt-24 border-t border-border">
      <div className="container-editorial py-12">
        <div className="flex flex-col gap-8 md:flex-row md:items-start md:justify-between">
          <div className="max-w-xs">
            <p className="text-[1.05rem] font-black uppercase tracking-[0.04em] text-foreground">
              Maldito<span className="text-accent">espejo</span>
            </p>
            <p className="mt-3 text-sm text-muted">
              Información basada en hechos, datos, documentos y declaraciones
              atribuibles. Sin opinión ni interpretación.
            </p>
          </div>

          <nav aria-label="Secciones">
            <ul className="flex flex-wrap gap-x-6 gap-y-3 text-sm text-muted">
              {[
                { name: "Actualidad", url: "/actualidad" },
                { name: "Política", url: "/politica" },
                { name: "Economía", url: "/economia" },
                { name: "Sociedad", url: "/sociedad" },
                { name: "Mundo", url: "/mundo" },
                { name: "Tecnología", url: "/tecnologia" },
                { name: "Cartagena", url: "/cartagena" },
              ].map((s) => (
                <li key={s.url}>
                  <Link href={s.url} className="transition-colors hover:text-ink">
                    {s.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
        </div>

        <div className="mt-10 border-t border-border pt-6 text-xs text-faint">
          <div className="flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
            <p>© {year} MALDITOESPEJO. Todos los derechos reservados.</p>
            <nav aria-label="Información legal">
              <ul className="flex flex-wrap gap-x-5 gap-y-2">
                <li><Link href="/aviso-legal" className="transition-colors hover:text-ink">Aviso Legal</Link></li>
                <li><Link href="/politica-de-privacidad" className="transition-colors hover:text-ink">Privacidad</Link></li>
                <li><Link href="/cookies" className="transition-colors hover:text-ink">Cookies</Link></li>
              </ul>
            </nav>
          </div>
        </div>
      </div>
    </footer>
  );
}
