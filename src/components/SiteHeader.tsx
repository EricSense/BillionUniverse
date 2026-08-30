"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

const LINKS = [
  { href: "/network", label: "Network" },
  { href: "/create", label: "Plug in" },
  { href: "/connect", label: "Connect" },
  { href: "/trust", label: "Trust" },
  { href: "/value", label: "Value" },
  { href: "/how", label: "How" },
];

export function SiteHeader() {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="flex items-baseline gap-2" onClick={() => setOpen(false)}>
          <span className="font-serif text-xl tracking-tight text-star">Billion Universe</span>
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-star-mute sm:inline">
            Network
          </span>
        </Link>
        <nav className="hidden items-center gap-1 text-sm text-star-dim md:flex">
          {LINKS.map((link) => {
            const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-full px-3 py-1.5 transition ${
                  active ? "bg-white/[0.06] text-star" : "hover:text-star"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <button
          type="button"
          className="rounded-full px-3 py-1.5 text-sm text-star ring-1 ring-white/15 md:hidden"
          aria-expanded={open}
          aria-controls="mobile-nav"
          onClick={() => setOpen((v) => !v)}
        >
          {open ? "Close" : "Menu"}
        </button>
      </div>
      {open ? (
        <nav id="mobile-nav" className="border-t border-white/[0.06] px-5 py-3 md:hidden">
          <ul className="grid grid-cols-2 gap-2 text-sm">
            {LINKS.map((link) => {
              const active = pathname === link.href || pathname.startsWith(`${link.href}/`);
              return (
                <li key={link.href}>
                  <Link
                    href={link.href}
                    onClick={() => setOpen(false)}
                    className={`block rounded-xl px-3 py-2 ${
                      active ? "bg-white/[0.08] text-star" : "text-star-dim"
                    }`}
                  >
                    {link.label}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>
      ) : null}
    </header>
  );
}
