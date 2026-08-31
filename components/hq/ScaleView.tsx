"use client";

import { ScalePath } from "@/components/ScalePath";
import { formatPeople, formatPeopleLong, ofBillion } from "@/lib/format";
import { nextScaleStep } from "@/lib/scale";
import { useStore } from "@/lib/store";
import { useState } from "react";

export function ScaleView() {
  const { company, companyMarkets, milestones, bets, setPeopleReached, addBet, setBetStatus } =
    useStore();
  const [title, setTitle] = useState("");
  const [detail, setDetail] = useState("");

  if (!company) return null;

  const companyMilestones = milestones
    .filter((item) => item.companyId === company.id)
    .sort((a, b) => a.people - b.people);
  const companyBets = bets.filter((item) => item.companyId === company.id);
  const next = nextScaleStep(company.peopleReached);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-[0.18em] text-hq-mist">Scale</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">The path is the product.</h1>
      <p className="mt-3 max-w-2xl text-hq-mist">
        Every company in Billion Universe is plotted on the same axis: people
        reached, from one to one billion. Vanity metrics do not move the marker.
      </p>

      <div className="mt-8 rounded-2xl bg-hq-panel p-6 hq-hairline">
        <p className="font-display text-5xl tabular tracking-tight md:text-6xl">
          {formatPeopleLong(company.peopleReached)}
        </p>
        <p className="mt-2 text-hq-mist">
          {ofBillion(company.peopleReached).toFixed(5)}% of one billion · next {formatPeople(next)}
        </p>
        <div className="mt-8">
          <ScalePath people={company.peopleReached} tone="dark" />
        </div>
        <label className="mt-8 block max-w-md">
          <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">
            Update people reached
          </span>
          <input
            type="number"
            min={0}
            value={company.peopleReached}
            onChange={(event) => setPeopleReached(Number(event.target.value) || 0)}
            className="mt-2 h-11 w-full rounded-lg bg-hq-raised px-3 font-mono text-sm outline-none hq-hairline"
          />
        </label>
        <button
          type="button"
          className="mt-3 text-sm text-hq-mist"
          onClick={() =>
            setPeopleReached(
              companyMarkets.reduce((sum, market) => sum + market.peopleReached, 0),
            )
          }
        >
          Use in-market total
        </button>
      </div>

      <ol className="mt-8 space-y-3">
        {companyMilestones.map((item) => (
          <li
            key={item.id}
            className="flex flex-wrap items-center justify-between gap-3 rounded-2xl bg-hq-panel px-5 py-4 hq-hairline"
          >
            <div>
              <p className="font-mono text-xs text-hq-mist">{formatPeople(item.people)}</p>
              <p className="mt-1 text-sm">{item.title}</p>
            </div>
            <span
              className={`text-xs uppercase tracking-[0.14em] ${
                item.status === "done"
                  ? "text-emerald-400/80"
                  : item.status === "current"
                    ? "text-hq-text"
                    : "text-hq-mist"
              }`}
            >
              {item.status}
            </span>
          </li>
        ))}
      </ol>

      <section className="mt-10">
        <h2 className="text-xl font-medium">Bets</h2>
        <p className="mt-2 max-w-2xl text-sm text-hq-mist">
          The few things that have to be true for the path to work. Kill them
          when they are wrong. Do not collect them like slogans.
        </p>
        <form
          className="mt-6 grid gap-3 rounded-2xl bg-hq-panel p-4 hq-hairline md:grid-cols-[1fr_1fr_auto]"
          onSubmit={(event) => {
            event.preventDefault();
            addBet(title, detail);
            setTitle("");
            setDetail("");
          }}
        >
          <input
            value={title}
            onChange={(event) => setTitle(event.target.value)}
            placeholder="Bet"
            className="h-11 rounded-lg bg-hq-raised px-3 text-sm outline-none hq-hairline"
          />
          <input
            value={detail}
            onChange={(event) => setDetail(event.target.value)}
            placeholder="Why it has to be true"
            className="h-11 rounded-lg bg-hq-raised px-3 text-sm outline-none hq-hairline"
          />
          <button type="submit" className="h-11 rounded-lg bg-hq-text px-5 text-sm text-hq">
            Add bet
          </button>
        </form>
        <ul className="mt-4 space-y-3">
          {companyBets.map((bet) => (
            <li key={bet.id} className="rounded-2xl bg-hq-panel p-4 hq-hairline">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <p className="text-sm font-medium">{bet.title}</p>
                  <p className="mt-1 text-sm text-hq-mist">{bet.detail}</p>
                </div>
                <div className="flex gap-2">
                  {(["active", "won", "killed"] as const).map((status) => (
                    <button
                      key={status}
                      type="button"
                      onClick={() => setBetStatus(bet.id, status)}
                      className={`rounded-full px-3 py-1 text-xs ${
                        bet.status === status ? "bg-white/15 text-hq-text" : "text-hq-mist"
                      }`}
                    >
                      {status}
                    </button>
                  ))}
                </div>
              </div>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
