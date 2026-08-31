"use client";

import { useMemo, useState } from "react";
import { COUNTRIES } from "@/lib/catalog";
import {
  coveragePct,
  formatPeople,
  formatPeopleLong,
  marketStatusLabel,
} from "@/lib/format";
import type { MarketStatus } from "@/lib/types";
import { useStore } from "@/lib/store";

export function MarketsView() {
  const { company, companyMarkets, addMarket, updateMarket, removeMarket } = useStore();
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  const named = companyMarkets.reduce((sum, market) => sum + market.population, 0);
  const reached = companyMarkets.reduce((sum, market) => sum + market.peopleReached, 0);
  const available = useMemo(
    () =>
      COUNTRIES.filter(
        (country) => !companyMarkets.some((market) => market.name === country.name),
      ),
    [companyMarkets],
  );

  if (!company) return null;

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-[0.18em] text-hq-mist">Markets</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">Name the people.</h1>
      <p className="mt-3 max-w-2xl text-hq-mist">
        A billion is not a mood. It is countries, languages, and populations you
        intend to serve. Coverage is people reached in those markets — not
        website visits.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <Stat label="Named population" value={formatPeopleLong(named)} />
        <Stat label="Reached in-market" value={formatPeopleLong(reached)} />
        <Stat label="Coverage" value={`${coveragePct(reached, named).toFixed(3)}%`} />
      </div>

      <form
        className="mt-8 flex flex-col gap-3 rounded-2xl bg-hq-panel p-4 hq-hairline sm:flex-row"
        onSubmit={(event) => {
          event.preventDefault();
          const result = addMarket(name);
          if (result) setError(result);
          else {
            setError("");
            setName("");
          }
        }}
      >
        <select
          value={name}
          onChange={(event) => setName(event.target.value)}
          className="h-11 flex-1 rounded-lg bg-hq-raised px-3 text-sm outline-none hq-hairline"
        >
          <option value="">Add a country</option>
          {available.map((country) => (
            <option key={country.name} value={country.name}>
              {country.name} · {formatPeople(country.population)}
            </option>
          ))}
        </select>
        <button type="submit" className="h-11 rounded-lg bg-hq-text px-5 text-sm text-hq">
          Add market
        </button>
      </form>
      {error ? <p className="mt-2 text-sm text-red-300">{error}</p> : null}

      <div className="mt-6 overflow-x-auto rounded-2xl bg-hq-panel hq-hairline">
        <table className="w-full min-w-[720px] text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.12em] text-hq-mist">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Market</th>
              <th className="px-4 py-3 font-medium">Region</th>
              <th className="px-4 py-3 font-medium">Language</th>
              <th className="px-4 py-3 font-medium">Status</th>
              <th className="px-4 py-3 font-medium">Population</th>
              <th className="px-4 py-3 font-medium">Reached</th>
              <th className="px-4 py-3 font-medium"></th>
            </tr>
          </thead>
          <tbody>
            {companyMarkets.map((market) => (
              <tr key={market.id} className="border-b border-white/5">
                <td className="px-4 py-3">{market.name}</td>
                <td className="px-4 py-3 text-hq-mist">{market.region}</td>
                <td className="px-4 py-3 text-hq-mist">{market.language}</td>
                <td className="px-4 py-3">
                  <select
                    value={market.status}
                    onChange={(event) =>
                      updateMarket(market.id, { status: event.target.value as MarketStatus })
                    }
                    className="rounded-md bg-hq-raised px-2 py-1 text-xs outline-none"
                  >
                    {(["research", "entering", "live", "scaled"] as const).map((status) => (
                      <option key={status} value={status}>
                        {marketStatusLabel(status)}
                      </option>
                    ))}
                  </select>
                </td>
                <td className="px-4 py-3 font-mono text-xs">{formatPeople(market.population)}</td>
                <td className="px-4 py-3">
                  <input
                    type="number"
                    min={0}
                    value={market.peopleReached}
                    onChange={(event) =>
                      updateMarket(market.id, {
                        peopleReached: Number(event.target.value) || 0,
                      })
                    }
                    className="w-28 rounded-md bg-hq-raised px-2 py-1 font-mono text-xs outline-none"
                  />
                </td>
                <td className="px-4 py-3 text-right">
                  <button
                    type="button"
                    onClick={() => removeMarket(market.id)}
                    className="text-xs text-hq-mist"
                  >
                    Remove
                  </button>
                </td>
              </tr>
            ))}
            {companyMarkets.length === 0 ? (
              <tr>
                <td colSpan={7} className="px-4 py-8 text-center text-hq-mist">
                  No markets yet. Start with the country you can actually serve this year.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
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
