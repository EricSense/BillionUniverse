"use client";

import Link from "next/link";
import { useSearchParams } from "next/navigation";
import { Suspense, useEffect, useState } from "react";
import { KindMark, StakeMark, StatusDot } from "@/components/marks";
import { fetchNetwork, proposeBridge, runConnection } from "@/lib/client";
import { formatBU } from "@/lib/engine/value";
import type { Connection, NetworkNode, StakeLevel } from "@/lib/types";

function ConnectStudio() {
  const params = useSearchParams();
  const [nodes, setNodes] = useState<NetworkNode[]>([]);
  const [from, setFrom] = useState(params.get("from") ?? "");
  const [to, setTo] = useState(params.get("to") ?? "");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [connection, setConnection] = useState<Connection | null>(null);
  const [gate, setGate] = useState<{
    allowed: boolean;
    reason: string;
    required: StakeLevel;
    missing: string[];
  } | null>(null);
  const [settled, setSettled] = useState<string | null>(null);

  useEffect(() => {
    fetchNetwork().then((state) => {
      setNodes(state.nodes);
      if (!from && state.nodes[0]) setFrom(state.nodes[0].id);
      if (!to && state.nodes[1]) setTo(state.nodes[1].id);
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const source = nodes.find((n) => n.id === from);
  const target = nodes.find((n) => n.id === to);

  async function onBridge(event: React.FormEvent) {
    event.preventDefault();
    if (!from || !to || from === to) {
      setError("Pick two different nodes.");
      return;
    }
    setBusy(true);
    setError(null);
    setSettled(null);
    const next = await proposeBridge(from, to, true);
    setBusy(false);
    if (next.error) {
      setError(next.error);
      return;
    }
    setConnection(next.connection);
    setGate(next.gate);
  }

  async function onExecute() {
    if (!connection) return;
    setBusy(true);
    const next = await runConnection(connection.id);
    setBusy(false);
    if (next.error) {
      setError(next.error);
      return;
    }
    setConnection(next.connection);
    setSettled(`Settled ${formatBU(next.settlement?.amount ?? connection.value.amount)}.`);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Connection</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-star sm:text-5xl">
        Two interfaces. One bridge. No shared standard.
      </h1>
      <p className="mt-5 max-w-2xl text-star-dim">
        The same mechanism whether you&apos;re dropping an art pack into a game or letting two
        company agents settle a buy. Trust decides whether the path may run.
      </p>

      <form onSubmit={onBridge} className="mt-10 grid gap-4 sm:grid-cols-[1fr_auto_1fr_auto] sm:items-end">
        <SelectNode label="From" value={from} nodes={nodes} onChange={setFrom} />
        <p className="hidden pb-3 font-serif text-2xl text-gold sm:block">→</p>
        <SelectNode label="To" value={to} nodes={nodes} onChange={setTo} />
        <button
          type="submit"
          disabled={busy}
          className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink-950 disabled:opacity-60"
        >
          {busy ? "Reading…" : "Build the bridge"}
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}

      <div className="mt-10 grid gap-6 lg:grid-cols-2">
        <NodePreview node={source} />
        <NodePreview node={target} />
      </div>

      {connection && gate ? (
        <section className="mt-12 rounded-2xl border border-white/[0.08] bg-ink-900/50 p-6">
          <div className="flex flex-wrap items-center gap-3">
            <StatusDot status={connection.status} />
            <span className="text-sm capitalize text-star">{connection.status}</span>
            <StakeMark stakes={connection.stakes} />
            <span className="font-mono text-xs text-star-mute">{formatBU(connection.value.amount)}</span>
          </div>
          <p className="mt-4 text-star-dim">{connection.bridge.summary}</p>
          <p className="mt-2 text-sm text-star-mute">
            Path:{" "}
            {connection.path
              .map((id) => nodes.find((n) => n.id === id)?.name ?? id)
              .join(" → ")}
          </p>

          <h2 className="mt-8 text-[11px] uppercase tracking-[0.18em] text-star-mute">Mappings</h2>
          <ul className="mt-3 space-y-3">
            {connection.bridge.mappings.map((m, i) => (
              <li key={`${m.from}-${i}`} className="rounded-xl bg-white/[0.03] px-4 py-3">
                <p className="font-mono text-[11px] text-gold">
                  {m.from} → {m.to}
                </p>
                <p className="mt-1 text-sm text-star-dim">{m.transform}</p>
              </li>
            ))}
          </ul>
          {connection.bridge.unresolved.length ? (
            <ul className="mt-4 space-y-1 text-sm text-gold-bright">
              {connection.bridge.unresolved.map((u) => (
                <li key={u}>{u}</li>
              ))}
            </ul>
          ) : null}

          <div className="mt-8 rounded-xl border border-white/[0.06] p-4">
            <p className="text-[11px] uppercase tracking-[0.18em] text-star-mute">Trust gate</p>
            <p className="mt-2 text-sm text-star">{gate.reason}</p>
            {gate.missing.length ? (
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-rust">
                {gate.missing.map((m) => (
                  <li key={m}>{m}</li>
                ))}
              </ul>
            ) : (
              <p className="mt-2 text-sm text-aqua">This path may execute.</p>
            )}
          </div>

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={onExecute}
              disabled={busy || connection.status === "blocked" || connection.status === "executed"}
              className="rounded-full bg-star px-5 py-2 text-sm font-medium text-ink-950 disabled:cursor-not-allowed disabled:opacity-40"
            >
              {connection.status === "executed" ? "Already executed" : "Execute"}
            </button>
            <Link href="/value" className="text-sm text-gold link-underline">
              See settlement
            </Link>
            {settled ? <span className="text-sm text-aqua">{settled}</span> : null}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function SelectNode({
  label,
  value,
  nodes,
  onChange,
}: {
  label: string;
  value: string;
  nodes: NetworkNode[];
  onChange: (id: string) => void;
}) {
  return (
    <label className="block text-[11px] uppercase tracking-[0.18em] text-star-mute">
      {label}
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900 px-3 py-2 text-sm normal-case tracking-normal text-star outline-none"
      >
        {nodes.map((n) => (
          <option key={n.id} value={n.id}>
            {n.name} · {n.kind}
          </option>
        ))}
      </select>
    </label>
  );
}

function NodePreview({ node }: { node?: NetworkNode }) {
  if (!node) {
    return <div className="rounded-2xl border border-dashed border-white/10 p-6 text-sm text-star-mute">Select a node.</div>;
  }
  return (
    <Link href={`/nodes/${node.id}`} className="block rounded-2xl border border-white/[0.08] bg-ink-900/40 p-5 hover:border-gold/30">
      <div className="flex items-center gap-2">
        <KindMark kind={node.kind} />
        <span className="font-mono text-[10px] text-star-mute">{node.owner.name}</span>
      </div>
      <h2 className="mt-2 font-serif text-2xl text-star">{node.name}</h2>
      <p className="mt-2 text-sm text-star-dim">{node.purpose}</p>
      <ul className="mt-4 space-y-1">
        {node.capabilities.map((c) => (
          <li key={c.id} className="font-mono text-[11px] text-star-mute">
            {c.direction} · {c.contract}
          </li>
        ))}
      </ul>
    </Link>
  );
}

export default function ConnectPage() {
  return (
    <Suspense fallback={<div className="mx-auto max-w-6xl px-5 py-20 text-star-dim">Loading the studio…</div>}>
      <ConnectStudio />
    </Suspense>
  );
}
