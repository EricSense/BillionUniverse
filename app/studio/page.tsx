"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useMemo } from "react";
import { ArrowUpRight, Plus, Trash2 } from "lucide-react";
import { Mark } from "@/components/Mark";
import { useClientReady, useStore, upsertUniverse, deleteUniverse, setIdentity } from "@/lib/store";
import { STARTER_TEMPLATES } from "@/lib/templates";

export default function StudioPage() {
  const ready = useClientReady();
  const store = useStore();
  const router = useRouter();

  const universes = store.universes;
  const empty = ready && universes.length === 0;
  const peers = useMemo(
    () => store.presence.filter((p) => p.id !== store.identity.id),
    [store.presence, store.identity.id],
  );

  return (
    <div className="stars flex min-h-full flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="text-sm">Billion Universe</span>
        </Link>
        <div className="flex items-center gap-3 text-xs text-mute">
          <span className="hidden sm:inline">
            Directing from {ready ? store.identity.device : "…"}
          </span>
          <input
            aria-label="Your name"
            value={store.identity.name}
            onChange={(e) => setIdentity({ name: e.target.value })}
            className="w-28 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-text outline-none"
          />
          <span
            className="h-2.5 w-2.5 rounded-full"
            style={{ background: store.identity.color }}
          />
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-16">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-end sm:justify-between">
          <div>
            <p className="text-[11px] uppercase tracking-[0.22em] text-lime">Studio</p>
            <h1 className="font-serif mt-2 text-4xl tracking-[-0.03em] sm:text-5xl">Your universes</h1>
            <p className="mt-2 max-w-xl text-sm leading-6 text-mute">
              A universe is a graph plus a job log. Open one on this device, or another tab — presence
              and edits sync over a local collab channel.
            </p>
          </div>
          {peers.length > 0 && (
            <p className="text-xs text-cyan">{peers.length} other director{peers.length === 1 ? "" : "s"} nearby</p>
          )}
        </div>

        <div className="mt-8 grid gap-3 sm:grid-cols-3">
          {STARTER_TEMPLATES.map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => {
                const u = t.factory();
                upsertUniverse(u);
                router.push(`/studio/${u.id}`);
              }}
              className="panel rounded-3xl p-5 text-left transition hover:border-lime/30"
            >
              <p className="font-mono text-[11px] text-violet">{t.kind}</p>
              <p className="mt-2 flex items-center justify-between text-base">
                {t.name}
                <Plus size={16} className="text-lime" />
              </p>
              <p className="mt-1 text-sm text-mute">{t.blurb}</p>
            </button>
          ))}
        </div>

        <h2 className="mt-12 text-sm uppercase tracking-[0.18em] text-mute">Open</h2>
        <div className="mt-4 grid gap-3">
          {!ready && <div className="panel h-24 animate-pulse rounded-3xl" />}
          {empty && (
            <p className="rounded-3xl border border-dashed border-white/12 px-5 py-10 text-sm text-mute">
              No universes yet. Start from a template above.
            </p>
          )}
          {universes.map((u) => (
            <div
              key={u.id}
              className="panel flex flex-col gap-3 rounded-3xl p-5 sm:flex-row sm:items-center sm:justify-between"
            >
              <div>
                <p className="text-lg">{u.name}</p>
                <p className="mt-1 max-w-xl text-sm text-mute">{u.description}</p>
                <p className="mt-2 font-mono text-[11px] text-mute">
                  {u.nodes.length} nodes · {u.jobs.length} jobs ·{" "}
                  {new Date(u.updatedAt).toLocaleString()}
                </p>
              </div>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  className="rounded-full p-2 text-mute hover:text-rose"
                  aria-label={`Delete ${u.name}`}
                  onClick={() => deleteUniverse(u.id)}
                >
                  <Trash2 size={16} />
                </button>
                <Link
                  href={`/studio/${u.id}`}
                  className="inline-flex items-center gap-1.5 rounded-full bg-lime px-4 py-2 text-sm font-semibold text-black"
                >
                  Open <ArrowUpRight size={14} />
                </Link>
              </div>
            </div>
          ))}
        </div>
      </main>
    </div>
  );
}
