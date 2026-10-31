"use client";

import Link from "next/link";
import { useState } from "react";

import { sections } from "@/data/sections";

export function MobileNavigation() {
  const [open, setOpen] = useState(false);

  function toggle() {
    setOpen((v) => !v);
  }

  function close() {
    setOpen(false);
  }

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={toggle}
        aria-expanded={open}
        aria-controls="mobile-menu"
        aria-label={open ? "Cerrar menú" : "Abrir menú"}
        className="icon-btn icon-btn-menu"
      >
        <svg
          width="22"
          height="22"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.6"
          strokeLinecap="square"
          aria-hidden="true"
        >
          {open ? (
            <>
              <path d="M18 6 6 18" />
              <path d="m6 6 12 12" />
            </>
          ) : (
            <>
              <path d="M4 7h16" />
              <path d="M4 12h16" />
              <path d="M4 17h16" />
            </>
          )}
        </svg>
        <span>Menú</span>
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Secciones principales (móvil)"
          className="mobile-panel"
        >
          <ul>
            {sections.map((section) => (
              <li key={section.slug}>
                <Link href={section.url} onClick={close}>
                  {section.name}
                </Link>
              </li>
            ))}
            <li>
              <Link href="/lo-ultimo" onClick={close}>
                Lo último
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
