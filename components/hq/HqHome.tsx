"use client";

import Link from "next/link";
import { useState } from "react";
import { ScalePath } from "@/components/ScalePath";
import { formatMoney, formatPeople, formatPeopleLong, ofBillion } from "@/lib/format";
import { nextScaleStep } from "@/lib/scale";
import { useStore } from "@/lib/store";

export function HqHome() {
  const { company, companyMarkets, companyInsights, focuses, bets, addFocus, toggleFocus } =
    useStore();
  const [focus, setFocus] = useState("");

  if (!company) return <EmptyHq />;

  const named = companyMarkets.reduce((sum, market) => sum + market.population, 0);
  const next = nextScaleStep(company.peopleReached);
  const openFocus = focuses.filter((item) => item.companyId === company.id);
  const activeBets = bets.filter((item) => item.companyId === company.id && item.status === "active");

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-[0.18em] text-hq-mist">Headquarters</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="font-display text-4xl tracking-tight md:text-5xl">{company.name}</h1>
          <p className="mt-2 max-w-2xl text-hq-mist">{company.tagline}</p>
        </div>
        <Link href={`/c/${company.slug}`} className="text-sm text-hq-mist hover:text-hq-text">
          Public page →
        </Link>
      </div>

      <div className="mt-8 rounded-2xl bg-hq-panel p-5 hq-hairline md:p-6">
        <ScalePath people={company.peopleReached} tone="dark" />
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-4">
        <Stat label="People reached" value={formatPeopleLong(company.peopleReached)} />
        <Stat label="Of a billion" value={`${ofBillion(company.peopleReached).toFixed(4)}%`} />
        <Stat label="Named market" value={formatPeople(named)} />
        <Stat label="Next milestone" value={formatPeople(next)} />
      </div>

      <div className="mt-6 grid gap-4 lg:grid-cols-3">
        <section className="rounded-2xl bg-hq-panel p-5 hq-hairline lg:col-span-2">
          <h2 className="text-sm font-medium">This week</h2>
          <form
            className="mt-4 flex gap-2"
            onSubmit={(event) => {
              event.preventDefault();
              addFocus(focus);
              setFocus("");
            }}
          >
            <input
              value={focus}
              onChange={(event) => setFocus(event.target.value)}
              placeholder="Add a focus"
              className="h-10 flex-1 rounded-lg bg-hq-raised px-3 text-sm outline-none hq-hairline"
            />
            <button type="submit" className="h-10 rounded-lg bg-hq-text px-4 text-sm text-hq">
              Add
            </button>
          </form>
          <ul className="mt-4 divide-y divide-white/10">
            {openFocus.length === 0 ? (
              <li className="py-3 text-sm text-hq-mist">No focuses yet.</li>
            ) : (
              openFocus.map((item) => (
                <li key={item.id} className="flex items-center justify-between gap-3 py-3 text-sm">
                  <button type="button" onClick={() => toggleFocus(item.id)} className="text-left">
                    <span className={item.status === "done" ? "text-hq-mist line-through" : ""}>
                      {item.title}
                    </span>
                    <span className="ml-2 text-hq-mist">{item.owner}</span>
                  </button>
                  <span className="text-xs uppercase tracking-wide text-hq-mist">{item.status}</span>
                </li>
              ))
            )}
          </ul>
        </section>

        <section className="rounded-2xl bg-hq-panel p-5 hq-hairline">
          <h2 className="text-sm font-medium">Read</h2>
          <ul className="mt-4 space-y-3">
            {companyInsights.length === 0 ? (
              <li className="text-sm text-hq-mist">No insights yet. Add markets.</li>
            ) : (
              companyInsights.map((item) => (
                <li key={item.id} className="text-sm leading-6 text-hq-mist">
                  <span className="mr-2 font-mono text-[10px] uppercase text-hq-text">
                    {item.kind}
                  </span>
                  {item.text}
                </li>
              ))
            )}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-2">
        <section className="rounded-2xl bg-hq-panel p-5 hq-hairline">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Live markets</h2>
            <Link href="/markets" className="text-xs text-hq-mist">
              All →
            </Link>
          </div>
          <ul className="mt-4 space-y-3">
            {companyMarkets.slice(0, 5).map((market) => (
              <li key={market.id} className="flex items-center justify-between text-sm">
                <span>
                  {market.name}
                  <span className="ml-2 text-xs text-hq-mist">{market.status}</span>
                </span>
                <span className="font-mono text-xs">{formatPeople(market.peopleReached)}</span>
              </li>
            ))}
            {companyMarkets.length === 0 ? (
              <li className="text-sm text-hq-mist">Name the first country.</li>
            ) : null}
          </ul>
        </section>
        <section className="rounded-2xl bg-hq-panel p-5 hq-hairline">
          <div className="flex items-center justify-between">
            <h2 className="text-sm font-medium">Active bets</h2>
            <span className="font-mono text-xs text-hq-mist">{activeBets.length}</span>
          </div>
          <ul className="mt-4 space-y-3">
            {activeBets.map((bet) => (
              <li key={bet.id}>
                <p className="text-sm">{bet.title}</p>
                <p className="mt-1 text-sm text-hq-mist">{bet.detail}</p>
              </li>
            ))}
            {activeBets.length === 0 ? (
              <li className="text-sm text-hq-mist">No active bets.</li>
            ) : null}
          </ul>
        </section>
      </div>

      <div className="mt-6 grid gap-4 md:grid-cols-3">
        <Stat label="ARR" value={formatMoney(company.arr)} />
        <Stat label="Runway" value={`${company.runwayMonths} mo`} />
        <Stat label="Team" value={String(company.teamSize)} />
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-hq-panel p-4 hq-hairline">
      <p className="text-xs uppercase tracking-[0.14em] text-hq-mist">{label}</p>
      <p className="mt-2 font-mono text-xl tabular">{value}</p>
    </div>
  );
}

function EmptyHq() {
  return (
    <div className="mx-auto max-w-xl py-20 text-center">
      <h1 className="font-display text-4xl">No company on this account.</h1>
      <p className="mt-3 text-hq-mist">Create one to open HQ.</p>
      <Link href="/join" className="mt-6 inline-block text-sm text-hq-text">
        Start a company →
      </Link>
    </div>
  );
}
