import Link from "next/link";
import { Logo } from "@/components/Logo";
import type { ReactNode } from "react";

export function MarketingChrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="flex items-center gap-5 text-sm text-ink-soft">
            <Link href="/thesis">Thesis</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/directory">Directory</Link>
            <Link href="/login" className="rounded-full bg-ink px-4 py-2 text-paper">
              Log in
            </Link>
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl justify-between px-5 py-8 text-sm text-mist">
          <span>Billion Universe</span>
          <span>Build for a billion.</span>
        </div>
      </footer>
    </div>
  );
}
