import type { ReactNode } from "react";
import Link from "next/link";
import { Mark } from "./Mark";

const LINKS = [
  ["Node", "/node"],
  ["Fleet", "/fleet"],
  ["Stack", "/stack"],
  ["Plan", "/plan"],
] as const;

export function Chrome({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen">
      <header className="sticky top-0 z-20 border-b border-line bg-void/90 backdrop-blur">
        <div className="mx-auto flex max-w-6xl items-center gap-8 px-5 py-3">
          <Link href="/" className="flex items-center gap-2">
            <Mark />
            <span className="text-sm tracking-wide">Billion Universe</span>
          </Link>
          <nav className="hidden items-center gap-5 text-[13px] text-mist md:flex">
            {LINKS.map(([label, href]) => (
              <Link key={href} href={href} className="hover:text-paper">
                {label}
              </Link>
            ))}
          </nav>
          <Link href="/node" className="ml-auto bg-heat px-3 py-1.5 text-[13px] text-white">
            Open Node 1
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
          <p>Billion Universe — the place layer.</p>
          <p className="mono">NODE · FLEET · COPYABLE</p>
        </div>
      </footer>
    </div>
  );
}
