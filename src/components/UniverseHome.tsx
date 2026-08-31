"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { greetingFor, gravityTitle, primaryModules, secondarySignals, thesisFor } from "@/lib/copy";
import { describePerson } from "@/lib/person";
import { usePerson } from "./PersonProvider";
import { Sigil } from "./Sigil";

export function UniverseHome() {
  const { person, ready, clear } = usePerson();
  const [now, setNow] = useState(() => new Date());

  useEffect(() => {
    const timer = window.setInterval(() => setNow(new Date()), 60_000);
    return () => window.clearInterval(timer);
  }, []);

  if (!ready) {
    return (
      <div className="relative z-10 mx-auto max-w-4xl px-6 py-24">
        <p className="kicker">Shaping</p>
        <p className="font-display mt-4 text-3xl">Listening for you…</p>
      </div>
    );
  }

  if (!person) {
    return (
      <div className="relative z-10 mx-auto max-w-3xl px-6 py-24">
        <p className="kicker">Uninhabited</p>
        <h1 className="font-display mt-4 text-4xl md:text-6xl">This room has no person yet.</h1>
        <p className="mt-5 max-w-xl text-muted">
          Platforms ship empty dashboards. We wait. Arrive, and the universe will take your shape.
        </p>
        <Link href="/arrive" className="btn btn-primary mt-8">
          Arrive
        </Link>
      </div>
    );
  }

  const modules = primaryModules(person);
  const signals = secondarySignals(person);

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-6 pb-24 pt-8">
      <div className="flex flex-wrap items-start justify-between gap-6">
        <div className="max-w-3xl">
          <p className="kicker">{gravityTitle(person.gravity)}</p>
          <h1 className="font-display mt-4 text-4xl leading-tight md:text-6xl">
            {greetingFor(person, now)}
          </h1>
          <p className="mt-5 max-w-2xl text-muted">{thesisFor(person)}</p>
        </div>
        <div className="flex items-center gap-4">
          <Sigil name={person.name} size={84} />
        </div>
      </div>

      <div className="universe-grid mt-12">
        {modules.map((module) => (
          <article key={module.title} className="surface p-6 md:p-8">
            <p className="kicker">{module.kicker}</p>
            <h2 className="font-display mt-4 text-2xl md:text-3xl">{module.title}</h2>
            <p className="mt-4 leading-relaxed text-muted">{module.body}</p>
            <p className="mt-6 font-mono text-[11px] uppercase tracking-[0.18em] text-accent">
              {module.meta}
            </p>
          </article>
        ))}
      </div>

      <aside className="surface mt-10 p-6">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <p className="kicker">The universe remembers</p>
            <p className="mt-3 max-w-xl text-sm text-muted">{describePerson(person)}</p>
            <dl className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
              {signals.map((signal) => (
                <div key={signal.label}>
                  <dt className="kicker">{signal.label}</dt>
                  <dd className="mt-2 font-display text-xl capitalize">{signal.value}</dd>
                </div>
              ))}
            </dl>
          </div>
          <div className="flex flex-wrap gap-3">
            <Link href="/arrive" className="btn btn-primary">
              Reshape
            </Link>
            <Link href="/witness" className="btn btn-ghost">
              Witness others
            </Link>
            <button type="button" className="btn btn-ghost" onClick={clear}>
              Forget me
            </button>
          </div>
        </div>
      </aside>
    </div>
  );
}
