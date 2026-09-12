"use client";

import dynamic from "next/dynamic";
import { useMemo, useState } from "react";
import Link from "next/link";
import type { Universe } from "@/lib/schema";
import { classLabel, m2, meters, pct, when } from "@/lib/format";
import { Floorplan } from "./Floorplan";
import type { ViewMode } from "./UniverseScene";

const Scene = dynamic(() => import("./UniverseScene").then((m) => m.UniverseScene), {
  ssr: false,
  loading: () => (
    <div className="flex h-full items-center justify-center text-sm text-mist">Loading twin…</div>
  ),
});

const MODES: { id: ViewMode; label: string }[] = [
  { id: "geometry", label: "Geometry" },
  { id: "segment", label: "Segmentation" },
  { id: "physics", label: "Physics" },
  { id: "traverse", label: "Traversability" },
];

export function UniverseView({ universe }: { universe: Universe }) {
  const [mode, setMode] = useState<ViewMode>("segment");
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const selected = universe.objects.find((o) => o.id === selectedId) ?? null;
  const json = useMemo(() => {
    const slim = {
      ...universe,
      traversability: {
        ...universe.traversability,
        grid: `[${universe.traversability.height}×${universe.traversability.width} occupancy]`,
      },
    };
    return JSON.stringify(slim, null, 2);
  }, [universe]);

  return (
    <div>
      <div className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-6 md:grid-cols-[1fr_280px]">
          <div>
            <p className="mono text-[11px] tracking-widest text-scan uppercase">
              {universe.universe_id} · {universe.qa.status} · {universe.sla_hours}h SLA
            </p>
            <h1 className="serif mt-2 text-4xl text-paper">{universe.site.name}</h1>
            <p className="mt-2 text-mist">
              {universe.site.metro} · {universe.site.vertical} · {m2(universe.site.area_m2)} · ceiling{" "}
              {meters(universe.site.ceiling_m)}
            </p>
            <p className="mt-1 text-[13px] text-mist">
              Captured {when(universe.captured_at)} with {universe.rig.kit_name} · processed{" "}
              {when(universe.processed_at)} · location privacy: metro only
            </p>
          </div>
          <dl className="grid grid-cols-2 gap-3 text-[13px]">
            <Stat k="Objects" v={String(universe.stats.object_count)} />
            <Stat k="Zones" v={String(universe.stats.zone_count)} />
            <Stat k="Movable" v={String(universe.stats.movable_count)} />
            <Stat k="Coverage" v={pct(universe.qa.coverage)} />
          </dl>
        </div>
      </div>

      <div className="mx-auto grid max-w-6xl gap-0 md:grid-cols-[1fr_300px]">
        <div className="relative h-[560px] border-b border-line md:border-r md:border-b-0">
          <Scene universe={universe} mode={mode} selectedId={selectedId} onSelect={setSelectedId} />
          <div className="absolute top-3 left-3 flex flex-wrap gap-1">
            {MODES.map((m) => (
              <button
                key={m.id}
                type="button"
                onClick={() => setMode(m.id)}
                className={`mono px-2 py-1 text-[11px] ${
                  mode === m.id ? "bg-scan text-void" : "bg-ink/80 text-paper"
                }`}
              >
                {m.label}
              </button>
            ))}
          </div>
        </div>
        <aside className="border-b border-line p-5 md:border-b-0">
          <p className="mono text-[11px] tracking-widest text-mist uppercase">Inspector</p>
          {selected ? (
            <div className="mt-3 space-y-2 text-[13px]">
              <h2 className="serif text-2xl">{selected.label}</h2>
              <Row k="class" v={classLabel(selected.class)} />
              <Row k="body" v={selected.physics.body} />
              <Row k="material" v={selected.physics.material} />
              <Row k="movable" v={selected.physics.movable ? "yes" : "no"} />
              <Row k="friction" v={String(selected.physics.friction)} />
              <Row k="restitution" v={String(selected.physics.restitution)} />
              <Row
                k="mass"
                v={selected.physics.mass_kg === null ? "n/a (static)" : `${selected.physics.mass_kg} kg`}
              />
              <Row k="affordances" v={selected.affordances.join(", ")} />
              <Row k="confidence" v={pct(selected.confidence)} />
              <Row k="zone" v={selected.zone_id ?? "—"} />
            </div>
          ) : (
            <p className="mt-3 text-sm text-mist">
              Click any instance in the twin. Segmentation colors classes; physics lights every movable
              body; traversability paints free space from the occupancy grid.
            </p>
          )}
          <div className="mt-6 h-36 overflow-hidden border border-line">
            <Floorplan universe={universe} />
          </div>
        </aside>
      </div>

      <div className="mx-auto max-w-6xl px-5 py-10">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="serif text-3xl">Universe Bundle</h2>
            <p className="mt-1 text-sm text-mist">
              UB-01 JSON the buyer trains on. Occupancy grid elided here; full grid ships in the file.
            </p>
          </div>
          <a
            href={`/api/universes/${universe.universe_id}`}
            className="border border-line px-3 py-1.5 text-[13px] hover:border-scan"
          >
            Download JSON
          </a>
        </div>
        <pre className="mono mt-4 max-h-80 overflow-auto border border-line bg-ink p-4 text-[11px] leading-relaxed text-mist">
          {json}
        </pre>
        <p className="mt-6 text-sm text-mist">
          <Link href="/catalog" className="text-scan">
            ← Catalog
          </Link>
        </p>
      </div>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-line bg-panel px-3 py-2">
      <dt className="mono text-[10px] tracking-widest text-mist uppercase">{k}</dt>
      <dd className="mt-1 text-lg">{v}</dd>
    </div>
  );
}

function Row({ k, v }: { k: string; v: string }) {
  return (
    <div className="flex justify-between gap-4 border-b border-line/70 py-1">
      <span className="mono text-[11px] text-mist">{k}</span>
      <span className="text-right text-paper">{v}</span>
    </div>
  );
}
