"use client";

import type { ReactNode } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mark } from "./Mark";
import { DISTRICTS } from "@/lib/world";

const LINKS = [
  { href: "/room", label: "Room" },
  { href: "/atlas", label: "Atlas" },
  ...DISTRICTS.map((d) => ({ href: `/d/${d.slug}`, label: d.name.replace("The ", "") })),
];

export function Shell({ children }: { children: ReactNode }) {
  const path = usePathname();
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-void/85 backdrop-blur">
        <div className="mx-auto flex max-w-5xl items-center gap-6 px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Mark />
            <span className="serif text-lg">Billion Universe</span>
          </Link>
          <nav className="hidden flex-1 items-center gap-4 text-[13px] text-mist md:flex">
            {LINKS.map((l) => (
              <Link
                key={l.href}
                href={l.href}
                className={path === l.href ? "text-lamp" : "hover:text-paper"}
              >
                {l.label}
              </Link>
            ))}
          </nav>
          <Link href="/arrive" className="ml-auto bg-lamp px-3 py-1.5 text-[13px] text-void">
            Claim a room
          </Link>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-line px-5 py-2 text-[12px] text-mist md:hidden">
          {LINKS.map((l) => (
            <Link key={l.href} href={l.href} className="whitespace-nowrap">
              {l.label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
    </div>
  );
}
