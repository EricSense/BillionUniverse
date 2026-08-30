import { NetworkGraph } from "@/components/NetworkGraph";
import { getState } from "@/lib/store";
import { formatBU } from "@/lib/engine/value";
import Link from "next/link";

export const metadata = { title: "Network" };
export const dynamic = "force-dynamic";

export default function NetworkPage() {
  const state = getState();
  const volume = state.connections.reduce((sum, c) => sum + c.value.amount, 0);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The constellation</p>
      <div className="mt-3 flex flex-wrap items-end justify-between gap-6">
        <h1 className="max-w-2xl font-serif text-4xl text-star sm:text-5xl">
          Everything already connected.
        </h1>
        <p className="max-w-sm text-sm leading-relaxed text-star-dim">
          Nodes are creations, systems, machines, and agents. Lines are bridges the network built —
          colored by the stakes of the connection.
        </p>
      </div>

      <div className="mt-10">
        <NetworkGraph nodes={state.nodes} connections={state.connections} />
      </div>

      <div className="mt-8 grid gap-4 sm:grid-cols-3">
        <Stat label="Nodes" value={String(state.nodes.length)} />
        <Stat label="Connections" value={String(state.connections.length)} />
        <Stat label="Facilitated" value={formatBU(volume)} />
      </div>

      <section className="mt-16 grid gap-10 lg:grid-cols-[1.2fr_0.8fr]">
        <div>
          <h2 className="font-serif text-2xl text-star">Recent activity</h2>
          <ul className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
            {state.activity.slice(0, 8).map((item) => (
              <li key={item.id} className="py-3">
                {item.href ? (
                  <Link href={item.href} className="block text-sm text-star-dim hover:text-star">
                    {item.text}
                  </Link>
                ) : (
                  <p className="text-sm text-star-dim">{item.text}</p>
                )}
                <p className="mt-1 font-mono text-[10px] text-star-mute">
                  {new Date(item.at).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>
        </div>
        <aside>
          <h2 className="font-serif text-2xl text-star">Kinds</h2>
          <p className="mt-3 text-sm leading-relaxed text-star-dim">
            Same mechanism, four kinds of node. Trust decides how far any of them may reach.
          </p>
          <ul className="mt-5 space-y-3 text-sm">
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-slate" />
              <span>
                <strong className="text-star">Creation</strong>
                <span className="block text-star-dim">A person&apos;s work, represented with a purpose and an interface.</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-gold" />
              <span>
                <strong className="text-star">System</strong>
                <span className="block text-star-dim">Existing software that joined instead of waiting for a custom integration.</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-rust" />
              <span>
                <strong className="text-star">Machine</strong>
                <span className="block text-star-dim">Physical actuation. Highest stakes. Enterprise-backed only.</span>
              </span>
            </li>
            <li className="flex gap-3">
              <span className="mt-1 h-2 w-2 rounded-full bg-aqua" />
              <span>
                <strong className="text-star">Agent</strong>
                <span className="block text-star-dim">Acts for a person or company against other nodes on the same network.</span>
              </span>
            </li>
          </ul>
          <Link
            href="/create"
            className="mt-8 inline-block rounded-full bg-gold px-5 py-2 text-sm font-medium text-ink-950"
          >
            Plug something in
          </Link>
        </aside>
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl border border-white/[0.07] bg-ink-900/50 px-5 py-4">
      <p className="font-serif text-2xl text-star">{value}</p>
      <p className="mt-1 text-[11px] uppercase tracking-[0.16em] text-star-mute">{label}</p>
    </div>
  );
}
