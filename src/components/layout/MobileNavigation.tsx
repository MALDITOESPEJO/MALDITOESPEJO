"use client";

import Link from "next/link";
import { useState } from "react";

import { sections } from "@/data/sections";

/** Menú hamburguesa (todos los anchos): lista completa de secciones y accesos. */
export function MobileNavigation() {
  const [open, setOpen] = useState(false);
  const close = () => setOpen(false);

  return (
    <div className="w-menu">
      <button
        type="button"
        onClick={() => setOpen((v) => !v)}
        aria-expanded={open}
        aria-controls="site-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="w-menu-btn"
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="square" aria-hidden="true">
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M3 7h18" />
              <path d="M3 12h18" />
              <path d="M3 17h18" />
            </>
          )}
        </svg>
      </button>

      {open && (
        <nav id="site-menu" aria-label="Menú del sitio" className="w-menu-panel">
          <ul>
            {sections.map((s) => (
              <li key={s.slug}>
                <Link href={s.url} onClick={close}>
                  {s.name}
                </Link>
              </li>
            ))}
            <li className="w-menu-sep">
              <Link href="/lo-ultimo" onClick={close}>
                Lo último
              </Link>
            </li>
            <li>
              <Link href="/search" onClick={close}>
                Buscar
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
