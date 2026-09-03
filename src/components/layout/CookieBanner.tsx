"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

const CONSENT_KEY = "malditoespejo-cookie-consent";

type Consent = "all" | "necessary";

export function CookieBanner() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    try {
      setVisible(window.localStorage.getItem(CONSENT_KEY) === null);
    } catch {
      setVisible(true);
    }
  }, []);

  function saveConsent(consent: Consent) {
    try {
      window.localStorage.setItem(CONSENT_KEY, consent);
    } catch {
      // Si el almacenamiento local está bloqueado, ocultamos el aviso durante la sesión.
    }
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <aside
      role="dialog"
      aria-label="Privacidad y Transparencia"
      aria-describedby="cookie-description"
      className="fixed inset-x-0 bottom-0 z-[90] border-t border-border bg-background/98 shadow-[0_-8px_30px_rgba(0,0,0,0.10)] backdrop-blur-md"
    >
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-5 px-5 py-5 md:px-8 md:py-6">
        <div>
          <h2 className="font-display text-xl font-semibold tracking-tight text-foreground">
            Privacidad y Transparencia
          </h2>
          <p id="cookie-description" className="mt-2 max-w-4xl text-sm leading-6 text-muted">
            En Maldito Espejo utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación. {" "}
            <Link
              href="/cookies"
              className="font-medium underline underline-offset-2 transition-opacity hover:opacity-70"
            >
              Leer Política de Cookies
            </Link>
          </p>
        </div>

        <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-end sm:gap-4">
          <button
            type="button"
            onClick={() => saveConsent("all")}
            className="inline-flex min-h-11 items-center justify-center bg-ink px-5 py-2.5 text-sm font-semibold text-background transition-opacity hover:opacity-85 focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
          >
            Aceptar todas
          </button>
          <button
            type="button"
            onClick={() => saveConsent("necessary")}
            className="inline-flex min-h-11 items-center justify-center border border-border px-5 py-2.5 text-sm font-semibold text-foreground transition-colors hover:bg-surface focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
          >
            Rechazar opcionales
          </button>
          <Link
            href="/cookies"
            className="inline-flex min-h-11 items-center justify-center px-3 py-2.5 text-sm font-semibold text-muted underline underline-offset-2 transition-colors hover:text-foreground focus:outline-none focus:ring-2 focus:ring-ink focus:ring-offset-2"
          >
            Configurar
          </Link>
        </div>
      </div>
    </aside>
  );
}
