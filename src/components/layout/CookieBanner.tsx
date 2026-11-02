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
      className="cookie"
    >
      <div className="cookie-inner">
        <div>
          <h2 className="cookie-title">Privacidad y Transparencia</h2>
          <p id="cookie-description" className="cookie-text">
            En Maldito Espejo utilizamos cookies propias y de terceros para analizar nuestros servicios y mostrarle publicidad relacionada con sus preferencias mediante el análisis de sus hábitos de navegación.{" "}
            <Link href="/cookies">Leer Política de Cookies</Link>
          </p>
        </div>
        <div className="cookie-actions">
          <button type="button" onClick={() => saveConsent("all")} className="cookie-btn cookie-btn-hot">
            Aceptar todas
          </button>
          <button type="button" onClick={() => saveConsent("necessary")} className="cookie-btn">
            Rechazar opcionales
          </button>
          <Link href="/cookies" className="cookie-link">
            Configurar
          </Link>
        </div>
      </div>
    </aside>
  );
}
