"use client";

import Link from "next/link";
import { useState, type FormEvent } from "react";
import { Logo } from "@/components/Logo";
import { ScalePath } from "@/components/ScalePath";
import { formatPeople, formatPeopleLong } from "@/lib/format";
import { useStore } from "@/lib/store";

const WAITLIST_BASE = 4120;

export function Landing() {
  const { companies, waitlist, addWaitlist } = useStore();
  const [email, setEmail] = useState("");
  const [joined, setJoined] = useState(false);
  const [error, setError] = useState("");

  const publicCompanies = companies.filter((company) => company.public);
  const waitlistCount = WAITLIST_BASE + waitlist.length;

  async function onWaitlist(event: FormEvent) {
    event.preventDefault();
    const value = email.trim().toLowerCase();
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      setError("Enter a real email.");
      return;
    }
    setError("");
    addWaitlist(value);
    try {
      await fetch("/api/waitlist", {
        method: "POST",
        headers: { "content-type": "application/json" },
        body: JSON.stringify({ email: value }),
      });
    } catch {
      /* local waitlist still counts */
    }
    setJoined(true);
  }

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="sticky top-0 z-20 border-b border-rule/80 bg-paper/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
          <Logo />
          <nav className="hidden items-center gap-7 text-sm text-ink-soft md:flex">
            <a href="#product">Product</a>
            <a href="#path">The path</a>
            <Link href="/thesis">Thesis</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/directory">Directory</Link>
          </nav>
          <div className="flex items-center gap-3">
            <Link href="/login" className="hidden text-sm text-ink-soft sm:inline">
              Log in
            </Link>
            <Link
              href="/join"
              className="rounded-full bg-ink px-4 py-2 text-sm font-medium text-paper"
            >
              Start a company
            </Link>
          </div>
        </div>
      </header>

      <main>
        <section className="mx-auto max-w-6xl px-5 pb-20 pt-16 md:pt-24">
          <p className="text-xs uppercase tracking-[0.22em] text-mist">
            Company operating system
          </p>
          <h1 className="font-display mt-5 max-w-4xl text-[2.6rem] leading-[1.05] tracking-tight md:text-7xl">
            Build for a billion.
          </h1>
          <p className="mt-6 max-w-2xl text-lg leading-8 text-ink-soft md:text-xl">
            Billion Universe is how ambitious companies name the people they serve,
            measure who they actually reach, and run the path from first user to
            one billion humans. Not a pitch deck. The operating system.
          </p>
          <div className="mt-10 flex flex-wrap items-center gap-3">
            <Link
              href="/join"
              className="rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper"
            >
              Open the HQ
            </Link>
            <Link
              href="/login"
              className="rounded-full px-5 py-3 text-sm font-medium hairline"
            >
              View the Relay demo
            </Link>
          </div>
          <p className="mt-5 text-sm text-mist">
            {waitlistCount.toLocaleString("en-US")} on the early list · Demo{" "}
            <span className="font-mono text-ink">founder@billionuniverse.com</span> /{" "}
            <span className="font-mono text-ink">scale1B</span>
          </p>

          <div className="mt-16 overflow-hidden rounded-2xl bg-ink px-6 py-8 text-paper md:px-10 md:py-10">
            <div className="flex flex-col gap-8 md:flex-row md:items-end md:justify-between">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-paper/50">
                  The number that matters
                </p>
                <p className="font-display mt-3 text-5xl tracking-tight md:text-7xl">
                  1,000,000,000
                </p>
                <p className="mt-2 text-paper/70">people. Everything else is a lagging indicator.</p>
              </div>
              <div className="max-w-sm text-sm leading-6 text-paper/70">
                Most software is built for a zip code, a niche, a Series A slide.
                The companies that change a century pick a human problem that a
                billion people have — then they do the unglamorous work of
                markets, language, licensing, and distribution.
              </div>
            </div>
            <div className="mt-10">
              <ScalePath people={2_140_000} tone="dark" />
            </div>
            <div className="mt-10 grid gap-3 md:grid-cols-3">
              {publicCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/c/${company.slug}`}
                  className="rounded-xl bg-white/5 px-4 py-4 hq-hairline"
                >
                  <p className="text-sm font-medium">{company.name}</p>
                  <p className="mt-1 line-clamp-2 text-sm text-paper/55">{company.tagline}</p>
                  <p className="mt-4 font-mono text-xs text-paper/80">
                    {formatPeople(company.peopleReached)} people reached
                  </p>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section id="product" className="border-t border-rule">
          <div className="mx-auto grid max-w-6xl gap-12 px-5 py-20 md:grid-cols-2">
            <div>
              <p className="text-xs uppercase tracking-[0.2em] text-mist">The problem</p>
              <h2 className="font-display mt-4 text-4xl tracking-tight md:text-5xl">
                Ambition dies in twelve tabs.
              </h2>
            </div>
            <div className="space-y-4 text-lg leading-8 text-ink-soft">
              <p>
                Founders who say “we’re going after a billion people” still run
                the company in Notion, a spreadsheet of countries, a deck from
                last quarter, and a dashboard that counts signups — not humans
                in markets.
              </p>
              <p>
                Scale is not a vibe. It is named populations, live coverage,
                capital that matches the next country, and a path you can
                defend. Billion Universe puts that in one HQ.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-rule bg-paper-2/50">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="text-xs uppercase tracking-[0.2em] text-mist">What you run</p>
            <h2 className="font-display mt-4 max-w-3xl text-4xl tracking-tight">
              Four objects. That is the company.
            </h2>
            <div className="mt-12 grid gap-6 md:grid-cols-2">
              {[
                {
                  n: "01",
                  title: "Markets",
                  body: "Countries, languages, and addressable people. You cannot reach a billion if you will not say which billion.",
                },
                {
                  n: "02",
                  title: "Coverage",
                  body: "People reached versus the population you named. Flags on a slide are not a business. Depth is.",
                },
                {
                  n: "03",
                  title: "The path",
                  body: "1k → 10k → 100k → 1M → 10M → 100M → 1B. Logarithmic, honest, always on screen.",
                },
                {
                  n: "04",
                  title: "Capital & talent",
                  body: "Runway, rounds, and the hires that unlock the next market — not a generic org chart.",
                },
              ].map((item) => (
                <article key={item.n} className="rounded-2xl bg-paper p-6 hairline">
                  <p className="font-mono text-xs text-mist">{item.n}</p>
                  <h3 className="mt-4 text-xl font-medium tracking-tight">{item.title}</h3>
                  <p className="mt-3 leading-7 text-ink-soft">{item.body}</p>
                </article>
              ))}
            </div>
          </div>
        </section>

        <section id="path" className="border-t border-rule">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <p className="text-xs uppercase tracking-[0.2em] text-mist">Who it is for</p>
            <h2 className="font-display mt-4 max-w-3xl text-4xl tracking-tight">
              Operators whose TAM is measured in hundreds of millions of humans.
            </h2>
            <div className="mt-10 grid gap-8 text-ink-soft md:grid-cols-3">
              <p>
                Payments, health, climate, education, work, identity — sectors
                where the customer already exists at population scale, and the
                software has not caught up.
              </p>
              <p>
                Founders building from Lagos, Bengaluru, São Paulo, Jakarta,
                Nairobi — and the operators in London or SF who are actually
                going where the people are.
              </p>
              <p>
                Studios and funds that hold more than one company, and need to
                see, on one screen, who is actually on a path to a billion.
              </p>
            </div>
          </div>
        </section>

        <section className="border-t border-rule">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <div className="flex flex-col justify-between gap-6 md:flex-row md:items-end">
              <div>
                <p className="text-xs uppercase tracking-[0.2em] text-mist">Directory</p>
                <h2 className="font-display mt-4 text-4xl tracking-tight">
                  Companies that stated the number.
                </h2>
              </div>
              <Link href="/directory" className="text-sm font-medium text-accent">
                Open the directory →
              </Link>
            </div>
            <div className="mt-10 divide-y divide-rule border-y border-rule">
              {publicCompanies.map((company) => (
                <Link
                  key={company.id}
                  href={`/c/${company.slug}`}
                  className="grid grid-cols-1 gap-2 py-5 md:grid-cols-12 md:items-center"
                >
                  <span className="text-lg font-medium md:col-span-3">{company.name}</span>
                  <span className="text-ink-soft md:col-span-6">{company.tagline}</span>
                  <span className="font-mono text-sm md:col-span-3 md:text-right">
                    {formatPeopleLong(company.peopleReached)}
                  </span>
                </Link>
              ))}
            </div>
          </div>
        </section>

        <section className="border-t border-rule bg-ink text-paper">
          <div className="mx-auto max-w-6xl px-5 py-20">
            <h2 className="font-display max-w-3xl text-4xl tracking-tight md:text-5xl">
              Early access for teams who will not build a small thing.
            </h2>
            <p className="mt-5 max-w-xl text-paper/70">
              The HQ is live in this build. Join the list if you want the hosted
              product, team seats, and a public company page that investors can
              actually read.
            </p>
            {joined ? (
              <p className="mt-8 text-lg">You’re on the list. Go build the thing.</p>
            ) : (
              <form onSubmit={onWaitlist} className="mt-8 flex max-w-md flex-col gap-3 sm:flex-row">
                <input
                  type="email"
                  value={email}
                  onChange={(event) => setEmail(event.target.value)}
                  placeholder="Work email"
                  className="h-12 flex-1 rounded-full bg-white/5 px-5 text-sm outline-none hq-hairline placeholder:text-paper/40"
                />
                <button
                  type="submit"
                  className="h-12 rounded-full bg-paper px-6 text-sm font-medium text-ink"
                >
                  Join the list
                </button>
              </form>
            )}
            {error ? <p className="mt-3 text-sm text-red-300">{error}</p> : null}
          </div>
        </section>
      </main>

      <footer className="border-t border-rule">
        <div className="mx-auto flex max-w-6xl flex-col gap-4 px-5 py-10 text-sm text-mist md:flex-row md:items-center md:justify-between">
          <Logo />
          <div className="flex flex-wrap gap-5">
            <Link href="/thesis">Thesis</Link>
            <Link href="/pricing">Pricing</Link>
            <Link href="/directory">Directory</Link>
            <Link href="/login">Log in</Link>
          </div>
          <p>© {new Date().getFullYear()} Billion Universe</p>
        </div>
      </footer>
    </div>
  );
}
