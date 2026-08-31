"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { usePerson } from "./PersonProvider";

const links = [
  { href: "/", label: "Thesis" },
  { href: "/arrive", label: "Arrive" },
  { href: "/universe", label: "Universe" },
  { href: "/witness", label: "Witness" },
];

export function Nav() {
  const pathname = usePathname();
  const { person, ready } = usePerson();

  return (
    <header className="relative z-20">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-6 py-5">
        <Link href="/" className="flex items-baseline gap-2">
          <span className="font-display text-lg font-semibold tracking-display">
            Billion Universe
          </span>
        </Link>
        <nav className="flex flex-wrap items-center gap-1 text-xs uppercase tracking-[0.18em] text-muted">
          {links.map((link) => {
            const active = pathname === link.href;
            return (
              <Link
                key={link.href}
                href={link.href}
                className={`rounded-person px-3 py-2 transition ${
                  active ? "text-fg" : "hover:text-fg"
                }`}
              >
                {link.label}
              </Link>
            );
          })}
        </nav>
        <p className="hidden font-mono text-[10px] uppercase tracking-[0.18em] text-muted sm:block">
          {ready && person ? person.name : "Uninhabited"}
        </p>
      </div>
    </header>
  );
}
