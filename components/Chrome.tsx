import type { ReactNode } from "react";
import Link from "next/link";
import { Logo } from "./Logo";

const LINKS = [
  ["Catalog", "/catalog"],
  ["Kit", "/kit"],
  ["Pipeline", "/pipeline"],
  ["90 days", "/plan"],
  ["Ops", "/ops"],
  ["Spec", "/spec"],
  ["Thesis", "/thesis"],
] as const;

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-30 border-b border-line/80 bg-void/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-6 px-5 py-3">
          <Link href="/" className="flex items-center gap-2.5">
            <Logo />
            <span className="serif text-lg tracking-tight">Billion Universe</span>
          </Link>
          <nav className="hidden flex-1 items-center gap-5 overflow-x-auto text-[13px] text-mist md:flex">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href} className="whitespace-nowrap hover:text-paper">
                {label}
              </Link>
            ))}
          </nav>
          <Link
            href="/pilot"
            className="ml-auto bg-scan px-3 py-1.5 text-[13px] font-medium text-void"
          >
            Request a pilot
          </Link>
        </div>
        <nav className="flex gap-4 overflow-x-auto border-t border-line px-5 py-2 text-[12px] text-mist md:hidden">
          {LINKS.map(([label, href]) => (
            <Link key={href} href={href} className="whitespace-nowrap">
              {label}
            </Link>
          ))}
        </nav>
      </header>
      {children}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl flex-col gap-2 px-5 py-8 text-[12px] text-mist md:flex-row md:justify-between">
          <p>Billion Universe — physical reality, captured as training data.</p>
          <p className="mono">UB-01 · Walker v0 · 24h SLA</p>
        </div>
      </footer>
    </div>
  );
}
