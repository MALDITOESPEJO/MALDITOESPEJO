"use client";

import { useState } from "react";

/**
 * Newsletter integrada en el flujo editorial. No debe parecer
 * publicidad. Email no se envía en esta fase (prototipo local).
 */
export function NewsletterBlock() {
  const [email, setEmail] = useState("");
  const [done, setDone] = useState(false);

  function onSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!email.trim()) return;
    setDone(true);
  }

  return (
    <section
      aria-label="Boletín"
      className="border border-border bg-surface px-6 py-8 md:px-10"
    >
      <h2 className="headline-md text-ink">Recibe los hechos en tu correo</h2>
      <p className="mt-3 max-w-md text-[0.98rem] leading-relaxed text-muted">
        Un resumen de los hechos confirmados de la jornada. Sin opinión, sin
        interpretación. (Demostración: no se envía ningún correo.)
      </p>

      {done ? (
        <p className="mt-6 text-sm font-medium text-ink">
          Gracias. Te avisaremos cuando el boletín esté disponible.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-6 flex max-w-md flex-col gap-3 sm:flex-row">
          <label htmlFor="newsletter-email" className="sr-only">
            Correo electrónico
          </label>
          <input
            id="newsletter-email"
            type="email"
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="tucorreo@ejemplo.com"
            className="h-11 w-full border border-border-strong bg-background px-4 text-[0.95rem] text-ink placeholder:text-faint"
          />
          <button
            type="submit"
            className="h-11 shrink-0 bg-ink px-5 text-sm font-semibold text-background transition-colors hover:bg-accent"
          >
            Suscribirme
          </button>
        </form>
      )}
    </section>
  );
}
