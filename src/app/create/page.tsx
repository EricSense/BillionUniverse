"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { KindMark, StakeMark } from "@/components/marks";
import { createNode, understandDescription, type UnderstandResult } from "@/lib/client";
import type { PayTier } from "@/lib/types";

const EXAMPLES = [
  "A game mechanic with gravity wells that pull projectiles",
  "An inventory workflow that tracks ingredient stock and reorders from a supplier",
  "A shipping automation that turns a packing list into a carrier label",
  "A 3d printer on the factory floor that runs signed gcode",
  "An agent that negotiates parts buys against published quotes",
];

export default function CreatePage() {
  const router = useRouter();
  const [description, setDescription] = useState("");
  const [ownerName, setOwnerName] = useState("");
  const [payTier, setPayTier] = useState<PayTier>("individual");
  const [reading, setReading] = useState(false);
  const [saving, setSaving] = useState(false);
  const [result, setResult] = useState<UnderstandResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  async function onRead(event: React.FormEvent) {
    event.preventDefault();
    setReading(true);
    setError(null);
    const next = await understandDescription(description);
    setReading(false);
    if (next.error) {
      setError(next.error);
      setResult(null);
      return;
    }
    setResult(next);
  }

  async function onPlug() {
    setSaving(true);
    setError(null);
    const created = await createNode({
      description,
      ownerName: ownerName || "You",
      payTier,
      ownerKind: payTier === "individual" ? "person" : "company",
    });
    setSaving(false);
    if (created.error || !created.node) {
      setError(created.error ?? "Could not join the network.");
      return;
    }
    router.push(`/nodes/${created.node.id}`);
  }

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Creation</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-star sm:text-5xl">
        Describe what you have, or what you want.
      </h1>
      <p className="mt-5 max-w-2xl text-star-dim">
        AI represents it as a node — not just a file or an app, but something with a legible
        purpose and interface. Then the network can find what it should connect to by meaning.
      </p>

      <form onSubmit={onRead} className="mt-10 grid gap-8 lg:grid-cols-[1.15fr_0.85fr]">
        <div>
          <label htmlFor="description" className="text-[11px] uppercase tracking-[0.18em] text-star-mute">
            Expression
          </label>
          <textarea
            id="description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={7}
            placeholder="A teenager's gravity-well mechanic. A bakery's inventory. A CRM you already run. A printer on the floor."
            className="mt-2 w-full resize-y rounded-2xl border border-white/10 bg-ink-900/70 px-4 py-3 text-star outline-none ring-gold/0 transition focus:border-gold/40 focus:ring-2 focus:ring-gold/20"
          />
          <div className="mt-3 flex flex-wrap gap-2">
            {EXAMPLES.map((ex) => (
              <button
                key={ex}
                type="button"
                onClick={() => setDescription(ex)}
                className="rounded-full px-3 py-1 text-left text-xs text-star-dim ring-1 ring-white/10 hover:text-star"
              >
                {ex}
              </button>
            ))}
          </div>
          <div className="mt-6 grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="owner" className="text-[11px] uppercase tracking-[0.18em] text-star-mute">
                Your name
              </label>
              <input
                id="owner"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                placeholder="Maya Chen"
                className="mt-2 w-full rounded-xl border border-white/10 bg-ink-900/70 px-3 py-2 text-sm outline-none focus:border-gold/40"
              />
            </div>
            <div>
              <p className="text-[11px] uppercase tracking-[0.18em] text-star-mute">Pay tier</p>
              <div className="mt-2 flex flex-wrap gap-2">
                {(["individual", "company", "enterprise"] as const).map((tier) => (
                  <button
                    key={tier}
                    type="button"
                    onClick={() => setPayTier(tier)}
                    className={`rounded-full px-3 py-1.5 text-xs capitalize ${
                      payTier === tier ? "bg-gold text-ink-950" : "ring-1 ring-white/10 text-star-dim"
                    }`}
                  >
                    {tier}
                  </button>
                ))}
              </div>
            </div>
          </div>
          <button
            type="submit"
            disabled={reading}
            className="mt-6 rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink-950 disabled:opacity-60"
          >
            {reading ? "Reading…" : "Read this into a node"}
          </button>
          {error ? <p className="mt-3 text-sm text-rust">{error}</p> : null}
        </div>

        <aside className="rounded-2xl border border-white/[0.08] bg-ink-900/50 p-6">
          {!result ? (
            <p className="text-sm leading-relaxed text-star-mute">
              The network will extract a name, a kind, a domain, an interface, and the nearest
              existing nodes by meaning. Joining is the easy part — that&apos;s the point.
            </p>
          ) : (
            <div>
              <div className="flex flex-wrap items-center gap-2">
                <KindMark kind={result.intent.kind} />
                <StakeMark stakes={result.intent.suggestedStakes} />
                <span className="font-mono text-[10px] text-star-mute">{result.intent.domain}</span>
              </div>
              <h2 className="mt-3 font-serif text-3xl text-star">{result.intent.name}</h2>
              <p className="mt-2 text-sm text-star-dim">{result.intent.purpose}</p>
              <h3 className="mt-6 text-[11px] uppercase tracking-[0.18em] text-star-mute">Interface</h3>
              <ul className="mt-2 space-y-2">
                {result.intent.capabilities.map((cap) => (
                  <li key={cap.id} className="rounded-xl bg-white/[0.03] px-3 py-2">
                    <p className="text-sm text-star">
                      <span className="font-mono text-[10px] uppercase text-gold">{cap.direction}</span>{" "}
                      {cap.name}
                    </p>
                    <p className="font-mono text-[11px] text-star-mute">{cap.contract}</p>
                  </li>
                ))}
              </ul>
              <h3 className="mt-6 text-[11px] uppercase tracking-[0.18em] text-star-mute">
                Suggested by meaning
              </h3>
              <ul className="mt-2 space-y-2">
                {result.matches.map((m) => (
                  <li key={m.id}>
                    <Link href={`/nodes/${m.id}`} className="block rounded-xl px-2 py-2 hover:bg-white/[0.04]">
                      <p className="text-sm text-star">
                        {m.name}{" "}
                        <span className="font-mono text-[10px] text-gold">{m.score}</span>
                      </p>
                      <p className="text-xs text-star-mute">{m.reasons[0]}</p>
                    </Link>
                  </li>
                ))}
              </ul>
              <button
                type="button"
                onClick={onPlug}
                disabled={saving}
                className="mt-6 w-full rounded-full bg-star px-5 py-2.5 text-sm font-medium text-ink-950 disabled:opacity-60"
              >
                {saving ? "Joining…" : "Plug this into the network"}
              </button>
            </div>
          )}
        </aside>
      </form>
    </div>
  );
}
