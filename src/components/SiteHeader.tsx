"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

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

  return (
    <header className="sticky top-0 z-30 border-b border-white/[0.06] bg-ink-950/70 backdrop-blur-md">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Link href="/" className="group flex items-baseline gap-2">
          <span className="font-serif text-xl tracking-tight text-star">Billion Universe</span>
          <span className="hidden text-[10px] uppercase tracking-[0.22em] text-star-mute sm:inline">
            Network
          </span>
        </Link>
        <nav className="flex items-center gap-1 text-sm text-star-dim">
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
      </div>
    </header>
  );
}
