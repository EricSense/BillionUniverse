import Link from "next/link";
import { StakeMark, StatusDot } from "@/components/marks";
import { formatBU } from "@/lib/engine/value";
import { getState } from "@/lib/store";

export const metadata = { title: "Value" };
export const dynamic = "force-dynamic";

export default function ValuePage() {
  const state = getState();
  const volume = state.connections.reduce((sum, c) => sum + c.value.amount, 0);
  const settled = state.settlements.reduce((sum, s) => sum + s.amount, 0);
  const byOwner = new Map<string, number>();
  for (const s of state.settlements) {
    for (const b of s.beneficiaries) {
      byOwner.set(b.owner, (byOwner.get(b.owner) ?? 0) + b.amount);
    }
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Value</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-star sm:text-5xl">
        Every connection is also a transaction.
      </h1>
      <p className="mt-5 max-w-2xl text-star-dim">
        The network prices a path by what it&apos;s worth and how much trust it required. Value
        flows back to whoever&apos;s work made it possible — sometimes several hops removed from
        the person who benefits.
      </p>

      <div className="mt-10 grid gap-4 sm:grid-cols-3">
        <Tile label="Priced volume" value={formatBU(volume)} />
        <Tile label="Settled" value={formatBU(settled)} />
        <Tile label="Contributors paid" value={String(byOwner.size)} />
      </div>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-star">Ledger</h2>
        <ul className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {state.connections.map((c) => {
            const path = c.path.map((id) => state.nodes.find((n) => n.id === id)?.name ?? id).join(" → ");
            return (
              <li key={c.id} className="grid gap-3 py-4 md:grid-cols-[1fr_auto]">
                <div>
                  <p className="text-sm text-star">{path}</p>
                  <div className="mt-2 flex flex-wrap items-center gap-3 text-xs">
                    <StatusDot status={c.status} />
                    <span className="capitalize text-star-dim">{c.status}</span>
                    <StakeMark stakes={c.stakes} />
                    {c.path.length > 2 ? (
                      <span className="text-star-mute">{c.path.length - 2} hop{c.path.length > 3 ? "s" : ""}</span>
                    ) : null}
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-serif text-2xl text-star">{formatBU(c.value.amount)}</p>
                  <p className="mt-1 font-mono text-[10px] text-star-mute">
                    {c.value.split
                      .map((s) => {
                        const n = state.nodes.find((node) => node.id === s.nodeId);
                        return `${n?.name ?? s.nodeId} ${(s.share * 100).toFixed(0)}%`;
                      })
                      .join(" · ")}
                  </p>
                </div>
              </li>
            );
          })}
        </ul>
      </section>

      <section className="mt-16 grid gap-10 lg:grid-cols-2">
        <div>
          <h2 className="font-serif text-2xl text-star">Settlements</h2>
          {state.settlements.length === 0 ? (
            <p className="mt-4 text-sm text-star-mute">
              Execute a live connection in the studio to write a settlement.
            </p>
          ) : (
            <ul className="mt-5 space-y-4">
              {state.settlements.map((s) => (
                <li key={s.id} className="rounded-2xl border border-white/[0.07] p-5">
                  <p className="font-serif text-xl text-star">{formatBU(s.amount)}</p>
                  <ul className="mt-3 space-y-1 text-sm text-star-dim">
                    {s.beneficiaries.map((b) => (
                      <li key={`${s.id}-${b.nodeId}`}>
                        {b.owner} · {formatBU(b.amount)} — {b.reason}
                      </li>
                    ))}
                  </ul>
                </li>
              ))}
            </ul>
          )}
        </div>
        <div>
          <h2 className="font-serif text-2xl text-star">Why this is bigger than a marketplace</h2>
          <p className="mt-4 text-sm leading-relaxed text-star-dim">
            The addressable opportunity isn&apos;t how much new content gets made. It&apos;s a share
            of all the interoperability the economy already needs and currently pays enormous sums
            to build manually — plus everything new that only becomes possible once connection is
            cheap.
          </p>
          <Link href="/pricing" className="mt-5 inline-block text-sm text-gold link-underline">
            How people and companies pay
          </Link>
        </div>
      </section>
    </div>
  );
}

function Tile({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-ink-900/50 px-5 py-4">
      <p className="font-serif text-3xl text-star">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-star-mute">{label}</p>
    </div>
  );
}
