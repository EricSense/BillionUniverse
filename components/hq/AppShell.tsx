"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useEffect, type ReactNode } from "react";
import { Logo } from "@/components/Logo";
import { useStore } from "@/lib/store";

const NAV = [
  { href: "/hq", label: "HQ" },
  { href: "/markets", label: "Markets" },
  { href: "/scale", label: "Scale" },
  { href: "/capital", label: "Capital" },
  { href: "/team", label: "Team" },
  { href: "/directory", label: "Directory" },
  { href: "/settings", label: "Settings" },
];

export function AppShell({ children }: { children: ReactNode }) {
  const { ready, user, company, logout } = useStore();
  const pathname = usePathname();
  const router = useRouter();
  const publicDirectory = pathname === "/directory" || pathname.startsWith("/c/");

  useEffect(() => {
    if (!ready) return;
    if (!user && !publicDirectory) router.replace("/login");
  }, [ready, user, publicDirectory, router]);

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-hq text-hq-mist">
        Loading HQ…
      </div>
    );
  }

  if (!user && !publicDirectory) return null;

  return (
    <div className="min-h-screen bg-hq text-hq-text">
      <aside className="fixed inset-y-0 left-0 z-20 hidden w-56 flex-col border-r border-white/10 bg-hq-panel lg:flex">
        <div className="px-4 py-5">
          <Logo href="/" tone="dark" size="sm" />
        </div>
        <nav className="flex-1 px-3">
          {(user ? NAV : NAV.filter((item) => item.href === "/directory")).map((item) => {
            const active = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`mb-1 block rounded-lg px-3 py-2 text-sm ${
                  active ? "bg-white/10 text-hq-text" : "text-hq-mist hover:text-hq-text"
                }`}
              >
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="border-t border-white/10 px-4 py-4 text-sm">
          {company ? (
            <Link href={`/c/${company.slug}`} className="block text-hq-text">
              {company.name}
            </Link>
          ) : null}
          <p className="mt-1 text-hq-mist">{user?.name ?? "Visitor"}</p>
          {user ? (
            <button type="button" onClick={logout} className="mt-3 text-xs text-hq-mist">
              Log out
            </button>
          ) : (
            <Link href="/login" className="mt-3 block text-xs text-hq-mist">
              Log in
            </Link>
          )}
        </div>
      </aside>

      <div className="lg:pl-56">
        <header className="flex items-center justify-between border-b border-white/10 px-4 py-3 lg:hidden">
          <Logo href="/hq" tone="dark" size="sm" />
          <div className="flex gap-3 overflow-x-auto text-sm text-hq-mist">
            {(user ? NAV : NAV.filter((item) => item.href === "/directory")).map((item) => (
              <Link key={item.href} href={item.href} className="whitespace-nowrap">
                {item.label}
              </Link>
            ))}
          </div>
        </header>
        <div className="px-4 py-6 md:px-8 md:py-8">{children}</div>
      </div>
    </div>
  );
}
