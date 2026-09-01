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
        className="flex h-10 w-10 items-center justify-center text-ink"
      >
        <svg
          width="20"
          height="20"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
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
      </button>

      {open && (
        <nav
          id="mobile-menu"
          aria-label="Secciones principales (móvil)"
          className="border-t border-border bg-background"
        >
          <ul className="flex flex-col">
            {sections.map((section) => (
              <li key={section.slug} className="border-b border-border">
                <Link
                  href={section.url}
                  onClick={close}
                  className="block px-[var(--gutter-mobile)] py-4 text-base font-medium text-ink"
                >
                  {section.name}
                </Link>
              </li>
            ))}
            <li>
              <Link
                href="/lo-ultimo"
                onClick={close}
                className="block px-[var(--gutter-mobile)] py-4 text-base font-medium text-accent"
              >
                Lo último
              </Link>
            </li>
          </ul>
        </nav>
      )}
    </div>
  );
}
