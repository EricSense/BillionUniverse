"use client";

import { formatMoney } from "@/lib/format";
import { useStore } from "@/lib/store";

export function CapitalView() {
  const { company, rounds, updateCompany } = useStore();
  if (!company) return null;

  const companyRounds = rounds.filter((item) => item.companyId === company.id);
  const raised = companyRounds.reduce((sum, item) => sum + item.amount, 0);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-[0.18em] text-hq-mist">Capital</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">Money is a market decision.</h1>
      <p className="mt-3 max-w-2xl text-hq-mist">
        Runway and rounds exist to buy the next country, the next license, the
        next language — not to decorate a deck.
      </p>

      <div className="mt-8 grid gap-4 md:grid-cols-3">
        <div className="rounded-2xl bg-hq-panel p-4 hq-hairline">
          <p className="text-xs uppercase tracking-[0.14em] text-hq-mist">Raised</p>
          <p className="mt-2 font-mono text-2xl tabular">{formatMoney(raised)}</p>
        </div>
        <label className="rounded-2xl bg-hq-panel p-4 hq-hairline">
          <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">ARR</span>
          <input
            type="number"
            min={0}
            value={company.arr}
            onChange={(event) => updateCompany({ arr: Number(event.target.value) || 0 })}
            className="mt-2 h-10 w-full bg-transparent font-mono text-2xl tabular outline-none"
          />
        </label>
        <label className="rounded-2xl bg-hq-panel p-4 hq-hairline">
          <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">Runway (months)</span>
          <input
            type="number"
            min={0}
            value={company.runwayMonths}
            onChange={(event) =>
              updateCompany({ runwayMonths: Number(event.target.value) || 0 })
            }
            className="mt-2 h-10 w-full bg-transparent font-mono text-2xl tabular outline-none"
          />
        </label>
      </div>

      <div className="mt-8 overflow-hidden rounded-2xl bg-hq-panel hq-hairline">
        <table className="w-full text-left text-sm">
          <thead className="text-xs uppercase tracking-[0.12em] text-hq-mist">
            <tr className="border-b border-white/10">
              <th className="px-4 py-3 font-medium">Round</th>
              <th className="px-4 py-3 font-medium">Date</th>
              <th className="px-4 py-3 font-medium">Amount</th>
            </tr>
          </thead>
          <tbody>
            {companyRounds.map((round) => (
              <tr key={round.id} className="border-b border-white/5">
                <td className="px-4 py-3">{round.name}</td>
                <td className="px-4 py-3 text-hq-mist">{round.date}</td>
                <td className="px-4 py-3 font-mono">{formatMoney(round.amount)}</td>
              </tr>
            ))}
            {companyRounds.length === 0 ? (
              <tr>
                <td colSpan={3} className="px-4 py-8 text-center text-hq-mist">
                  No rounds recorded. Bootstrap is a strategy. Pretending you do
                  not need capital for the next market is not.
                </td>
              </tr>
            ) : null}
          </tbody>
        </table>
      </div>
    </div>
  );
}
