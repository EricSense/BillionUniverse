import Link from "next/link";
import { COMPANY, NAV } from "@/lib/brand";
import { Lockup } from "./Mark";

export function Chrome({ children }: { children: React.ReactNode }) {
  return (
    <div className="min-h-screen bg-paper">
      <header className="sticky top-0 z-20 border-b border-line/80 bg-paper/85 backdrop-blur-md">
        <div className="mx-auto flex h-[4.25rem] max-w-6xl items-center justify-between px-6">
          <Link href="/" aria-label="BillionUniverse home">
            <Lockup markClass="h-9 w-9" textClass="text-[17px] tracking-tight text-ink" />
          </Link>
          <nav className="flex items-center gap-8 text-[12px] font-medium uppercase tracking-[0.2em] text-mute">
            {NAV.map((item) => (
              <Link key={item.href} href={item.href} className="transition-colors hover:text-ink">
                {item.label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      {children}
      <footer className="border-t border-line">
        <div className="mx-auto flex max-w-6xl items-center justify-between px-6 py-8 text-[12px] tracking-[0.16em] text-mute uppercase">
          <span>BillionUniverse</span>
          <span>{COMPANY.tag}</span>
        </div>
      </footer>
    </div>
  );
}
