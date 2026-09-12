"use client";

import { useState } from "react";
import { PIPELINE_STAGES, runPipeline } from "@/lib/pipeline";

export function PipelineView() {
  const [seed, setSeed] = useState(1);
  const [result, setResult] = useState(() => runPipeline(1, "warehouse"));
  const u = result.universe;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">24-hour pipeline</p>
      <h1 className="serif mt-2 max-w-3xl text-4xl md:text-5xl">
        Walk the floor. Wake up to a universe.
      </h1>
      <p className="mt-4 max-w-2xl text-mist">
        Real field data hits the same stages. This lab runs a synthetic warehouse walkthrough through
        that code path — ingest observations, cluster instances, infer aisles, stamp physics, QA.
      </p>

      <ol className="mt-12 grid gap-4 md:grid-cols-2">
        {PIPELINE_STAGES.map((s, i) => (
          <li key={s.id} className="border border-line bg-ink p-5">
            <p className="mono text-[11px] text-scan">
              {String(i + 1).padStart(2, "0")} · {s.hours} h
            </p>
            <h2 className="serif mt-1 text-2xl">{s.name}</h2>
            <p className="mt-2 text-sm text-mist">{s.detail}</p>
          </li>
        ))}
      </ol>

      <div className="mt-14 border border-line bg-panel p-5">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <h2 className="serif text-3xl">Run it</h2>
            <p className="mt-1 text-sm text-mist">
              Seed selects a warehouse. Output is a valid UB-01 bundle from simulated LiDAR + camera
              observations — the same function the CLI uses.
            </p>
          </div>
          <div className="flex items-center gap-2">
            <label className="mono text-[12px] text-mist">
              seed
              <input
                type="number"
                min={1}
                max={20}
                value={seed}
                onChange={(e) => setSeed(Number(e.target.value) || 1)}
                className="ml-2 w-20 border border-line bg-void px-2 py-1 text-paper"
              />
            </label>
            <button
              type="button"
              onClick={() => setResult(runPipeline(seed, "warehouse"))}
              className="bg-scan px-3 py-1.5 text-sm text-void"
            >
              Process
            </button>
          </div>
        </div>
        <dl className="mt-6 grid gap-3 sm:grid-cols-4 text-sm">
          <Cell k="universe" v={u.universe_id} />
          <Cell k="site" v={u.site.name} />
          <Cell k="objects" v={String(u.stats.object_count)} />
          <Cell k="qa" v={`${u.qa.status} · valid ${result.validation.ok ? "yes" : "no"}`} />
        </dl>
        <p className="mt-4 text-[13px] text-mist">
          Classes:{" "}
          {Object.entries(u.stats.classes)
            .map(([k, n]) => `${k} ${n}`)
            .join(" · ")}
        </p>
        {result.validation.issues.length ? (
          <ul className="mt-3 text-[13px] text-copper">
            {result.validation.issues.map((i) => (
              <li key={i.code + i.message}>
                {i.level}: {i.message}
              </li>
            ))}
          </ul>
        ) : (
          <p className="mt-3 text-[13px] text-signal">No validation issues.</p>
        )}
      </div>
    </div>
  );
}

function Cell({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-line px-3 py-2">
      <dt className="mono text-[10px] tracking-widest text-mist uppercase">{k}</dt>
      <dd className="mt-1">{v}</dd>
    </div>
  );
}
