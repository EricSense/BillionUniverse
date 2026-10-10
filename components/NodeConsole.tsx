"use client";

import { useEffect, useState } from "react";
import { FLEET, PRIMARY, ROSTER, type SiteNode } from "@/lib/nodes";
import { sample, type Telemetry } from "@/lib/telemetry";

export function NodeConsole() {
  const [active, setActive] = useState<SiteNode>(PRIMARY);
  const [tel, setTel] = useState<Telemetry>(() => sample(PRIMARY));

  useEffect(() => {
    setTel(sample(active));
    const id = window.setInterval(() => setTel(sample(active)), 2000);
    return () => window.clearInterval(id);
  }, [active]);

  return (
    <div className="mx-auto max-w-6xl px-5 py-10">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="mono text-[11px] tracking-[0.22em] text-heat uppercase">Console</p>
          <h1 className="mt-2 text-4xl font-medium">{active.id} · {active.name}</h1>
          <p className="mt-1 text-sm text-mist">
            {active.region} · {active.kind} · {active.status}
          </p>
        </div>
        <label className="text-[13px] text-mist">
          Site
          <select
            className="ml-2 border border-line bg-void px-2 py-1 text-paper"
            value={active.id}
            onChange={(e) => {
              const n = FLEET.find((x) => x.id === e.target.value);
              if (n) setActive(n);
            }}
          >
            {FLEET.map((n) => (
              <option key={n.id} value={n.id}>
                {n.id} {n.name}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Metric k="Link" v={`${tel.link_pct.toFixed(1)}%`} ok={tel.link_pct > 90} />
        <Metric k="Power" v={`${tel.power_kw.toFixed(1)} kW`} ok={tel.power_kw > 0} />
        <Metric k="On site" v={String(tel.people)} ok={tel.people > 0} />
        <Metric k="Wind" v={`${tel.wind_ms.toFixed(1)} m/s`} ok />
      </div>

      <div className="mt-8 grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
        <div className="border border-line bg-ink p-4">
          <p className="mono text-[10px] tracking-widest text-mist uppercase">Site schematic</p>
          <Schematic node={active} people={tel.people} />
        </div>
        <div className="border border-line bg-ink p-4">
          <p className="mono text-[10px] tracking-widest text-mist uppercase">Roster</p>
          <ul className="mt-3 space-y-2 text-sm">
            {ROSTER.map((r) => (
              <li key={r.name} className="flex justify-between border-b border-line/80 py-1">
                <span>
                  {r.name}{" "}
                  <span className="text-mist">· {r.role}</span>
                </span>
                <span className={r.in ? "text-paper" : "text-mist"}>{r.in ? "IN" : "OUT"}</span>
              </li>
            ))}
          </ul>
          <p className="mt-4 text-[12px] text-mist">
            Badge readers on the mast. If they are not in the roster, they are not on the dirt.
          </p>
        </div>
      </div>
    </div>
  );
}

function Metric({ k, v, ok }: { k: string; v: string; ok: boolean }) {
  return (
    <div className="border border-line bg-panel px-4 py-3">
      <p className="mono text-[10px] tracking-widest text-mist uppercase">{k}</p>
      <p className={`mt-1 text-2xl ${ok ? "text-paper" : "text-heat"}`}>{v}</p>
    </div>
  );
}

function Schematic({ node, people }: { node: SiteNode; people: number }) {
  return (
    <svg viewBox="0 0 400 220" className="mt-3 h-56 w-full">
      <rect width="400" height="220" fill="#0c0c0e" />
      <rect x="20" y="160" width="360" height="8" fill="#26262b" />
      <rect x="188" y="40" width="10" height="120" fill="#ecece8" />
      <rect x="186" y="28" width="14" height="14" fill="#ff4d2e" />
      {Array.from({ length: Math.min(people, 12) }).map((_, i) => (
        <circle
          key={i}
          cx={50 + (i % 6) * 28}
          cy={175}
          r="4"
          fill={node.status === "online" ? "#ecece8" : "#ff4d2e"}
        />
      ))}
      <text x="24" y="24" fill="#8b8b93" fontSize="10" fontFamily="monospace">
        MAST · {node.id} · {node.lat.toFixed(2)}, {node.lng.toFixed(2)}
      </text>
    </svg>
  );
}
