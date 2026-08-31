"use client";

import Link from "next/link";
import { Logo } from "@/components/Logo";
import { ScalePath } from "@/components/ScalePath";
import { coveragePct, formatMoney, formatPeople, formatPeopleLong, sectorLabel } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CompanyPublic({ slug }: { slug: string }) {
  const { companies, markets, milestones, bets, ready } = useStore();
  if (!ready) {
    return <div className="min-h-screen bg-paper px-6 py-20 text-mist">Loading…</div>;
  }

  const company = companies.find((item) => item.slug === slug && item.public);
  if (!company) {
    return (
      <div className="min-h-screen bg-paper px-6 py-20">
        <Logo />
        <h1 className="font-display mt-10 text-4xl">No public company at this address.</h1>
        <Link href="/directory" className="mt-4 inline-block text-sm text-mist">
          Back to directory
        </Link>
      </div>
    );
  }

  const companyMarkets = markets.filter((item) => item.companyId === company.id);
  const named = companyMarkets.reduce((sum, item) => sum + item.population, 0);
  const reached = companyMarkets.reduce((sum, item) => sum + item.peopleReached, 0);
  const companyMilestones = milestones
    .filter((item) => item.companyId === company.id)
    .sort((a, b) => a.people - b.people);
  const activeBets = bets.filter((item) => item.companyId === company.id && item.status === "active");

  return (
    <div className="min-h-screen bg-paper text-ink">
      <header className="border-b border-rule">
        <div className="mx-auto flex h-16 max-w-5xl items-center justify-between px-5">
          <Logo />
          <Link href="/directory" className="text-sm text-mist">
            Directory
          </Link>
        </div>
      </header>
      <article className="mx-auto max-w-5xl px-5 py-14">
        <p className="text-xs uppercase tracking-[0.18em] text-mist">
          {sectorLabel(company.sector)} · {company.hq} · est. {company.founded}
        </p>
        <h1 className="font-display mt-4 text-5xl tracking-tight">{company.name}</h1>
        <p className="mt-4 max-w-2xl text-xl leading-8 text-ink-soft">{company.tagline}</p>
        <p className="mt-8 max-w-2xl text-lg leading-8 text-ink-soft">{company.thesis}</p>

        <div className="mt-12 rounded-2xl bg-ink p-6 text-paper md:p-8">
          <p className="font-display text-5xl tabular">{formatPeopleLong(company.peopleReached)}</p>
          <p className="mt-2 text-paper/60">people reached</p>
          <div className="mt-8">
            <ScalePath people={company.peopleReached} tone="dark" />
          </div>
        </div>

        <dl className="mt-8 grid gap-4 md:grid-cols-4">
          <Item label="Named market" value={formatPeople(named)} />
          <Item label="In-market coverage" value={`${coveragePct(reached, named).toFixed(2)}%`} />
          <Item label="ARR" value={formatMoney(company.arr)} />
          <Item label="Team" value={String(company.teamSize)} />
        </dl>

        <h2 className="mt-14 text-xl font-medium">Markets</h2>
        <div className="mt-4 divide-y divide-rule border-y border-rule">
          {companyMarkets.map((market) => (
            <div key={market.id} className="grid grid-cols-2 gap-2 py-3 md:grid-cols-4">
              <span>{market.name}</span>
              <span className="text-mist">{market.status}</span>
              <span className="font-mono text-sm">{formatPeople(market.population)}</span>
              <span className="font-mono text-sm">{formatPeople(market.peopleReached)} reached</span>
            </div>
          ))}
        </div>

        <h2 className="mt-14 text-xl font-medium">Path</h2>
        <ol className="mt-4 space-y-2">
          {companyMilestones.map((item) => (
            <li key={item.id} className="flex justify-between border-b border-rule py-2 text-sm">
              <span>
                {item.title}
                <span className="ml-2 font-mono text-mist">{formatPeople(item.people)}</span>
              </span>
              <span className="text-mist">{item.status}</span>
            </li>
          ))}
        </ol>

        {activeBets.length > 0 ? (
          <>
            <h2 className="mt-14 text-xl font-medium">Bets</h2>
            <ul className="mt-4 space-y-4">
              {activeBets.map((bet) => (
                <li key={bet.id}>
                  <p className="font-medium">{bet.title}</p>
                  <p className="mt-1 text-ink-soft">{bet.detail}</p>
                </li>
              ))}
            </ul>
          </>
        ) : null}
      </article>
    </div>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl p-4 hairline">
      <dt className="text-xs uppercase tracking-[0.14em] text-mist">{label}</dt>
      <dd className="mt-2 font-mono text-lg">{value}</dd>
    </div>
  );
}
