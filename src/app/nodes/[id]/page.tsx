import Link from "next/link";
import { notFound } from "next/navigation";
import { KindMark, StakeMark, StatusDot } from "@/components/marks";
import { NetworkGraph } from "@/components/NetworkGraph";
import { TrustBar } from "@/components/TrustBar";
import { rankMatches } from "@/lib/engine/match";
import { formatBU } from "@/lib/engine/value";
import { getState } from "@/lib/store";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const node = getState().nodes.find((n) => n.id === id);
  return { title: node?.name ?? "Node" };
}

export default async function NodePage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const state = getState();
  const node = state.nodes.find((n) => n.id === id);
  if (!node) notFound();

  const connections = state.connections.filter((c) => c.path.includes(id));
  const matches = rankMatches(node, state.nodes, 5);
  const highlight = [id, ...connections.flatMap((c) => c.path)];

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-star-mute">
        <Link href="/network" className="hover:text-star">
          Network
        </Link>{" "}
        / {node.domain}
      </p>
      <div className="mt-4 flex flex-wrap items-center gap-3">
        <KindMark kind={node.kind} />
        <StakeMark stakes={node.trust.stakeCeiling} />
        {node.origin === "user" ? (
          <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-aqua">Joined this session</span>
        ) : null}
      </div>
      <h1 className="mt-4 font-serif text-5xl text-star">{node.name}</h1>
      <p className="mt-3 text-star-dim">
        {node.owner.name} · {node.owner.kind} · {node.owner.payTier}
      </p>
      <p className="mt-6 max-w-2xl text-lg leading-relaxed text-star-dim">{node.purpose}</p>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-star-mute">{node.description}</p>

      <div className="mt-10 grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
        <div className="space-y-6">
          <section className="rounded-2xl border border-white/[0.08] bg-ink-900/50 p-5">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-star-mute">Trust</h2>
            <div className="mt-4">
              <TrustBar score={node.trust.score} ceiling={node.trust.stakeCeiling} />
            </div>
            <ul className="mt-5 space-y-3">
              {node.trust.events.length === 0 ? (
                <li className="text-sm text-star-mute">No record yet. Every live connection writes one.</li>
              ) : (
                node.trust.events.map((event) => (
                  <li key={event.id} className="text-sm">
                    <span className={event.delta >= 0 ? "text-aqua" : "text-rust"}>
                      {event.delta >= 0 ? "+" : ""}
                      {event.delta}
                    </span>{" "}
                    <span className="text-star-dim">{event.reason}</span>
                  </li>
                ))
              )}
            </ul>
          </section>

          <section className="rounded-2xl border border-white/[0.08] bg-ink-900/50 p-5">
            <h2 className="text-[11px] uppercase tracking-[0.18em] text-star-mute">Interface</h2>
            <ul className="mt-4 space-y-3">
              {node.capabilities.map((cap) => (
                <li key={cap.id}>
                  <p className="text-sm text-star">
                    <span className="font-mono text-[10px] uppercase text-gold">{cap.direction}</span> {cap.name}
                  </p>
                  <p className="font-mono text-[11px] text-star-mute">{cap.contract}</p>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div>
          <NetworkGraph
            nodes={state.nodes}
            connections={state.connections}
            highlight={highlight}
            selectedId={id}
          />
        </div>
      </div>

      <section className="mt-14">
        <h2 className="font-serif text-2xl text-star">Connections</h2>
        <ul className="mt-5 divide-y divide-white/[0.06] border-y border-white/[0.06]">
          {connections.length === 0 ? (
            <li className="py-4 text-sm text-star-mute">None yet. The network can still suggest matches.</li>
          ) : (
            connections.map((c) => {
              const otherId = c.sourceId === id ? c.targetId : c.sourceId;
              const other = state.nodes.find((n) => n.id === otherId);
              return (
                <li key={c.id} className="flex flex-wrap items-center justify-between gap-3 py-4">
                  <div>
                    <p className="text-sm text-star">
                      {c.path.map((pid) => state.nodes.find((n) => n.id === pid)?.name ?? pid).join(" → ")}
                    </p>
                    <p className="mt-1 max-w-xl text-xs text-star-mute">{c.bridge.summary}</p>
                  </div>
                  <div className="flex items-center gap-3 text-xs">
                    <StatusDot status={c.status} />
                    <StakeMark stakes={c.stakes} />
                    <span className="font-mono text-star-dim">{formatBU(c.value.amount)}</span>
                    <Link href={`/connect?from=${id}&to=${other?.id ?? otherId}`} className="text-gold">
                      Open
                    </Link>
                  </div>
                </li>
              );
            })
          )}
        </ul>
      </section>

      <section className="mt-14">
        <h2 className="font-serif text-2xl text-star">Suggested by meaning</h2>
        <div className="mt-5 grid gap-4 md:grid-cols-2">
          {matches.map((m) => (
            <Link
              key={m.node.id}
              href={`/connect?from=${id}&to=${m.node.id}`}
              className="rounded-2xl border border-white/[0.07] p-5 hover:border-gold/30"
            >
              <div className="flex items-center justify-between">
                <KindMark kind={m.node.kind} />
                <span className="font-mono text-xs text-gold">{m.score}</span>
              </div>
              <h3 className="mt-3 font-serif text-xl text-star">{m.node.name}</h3>
              <p className="mt-2 text-sm text-star-dim">{m.node.purpose}</p>
              <p className="mt-3 text-xs text-star-mute">{m.reasons[0]}</p>
            </Link>
          ))}
        </div>
      </section>
    </div>
  );
}
