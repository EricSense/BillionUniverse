"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import type { Connection, NetworkNode, NodeKind, StakeLevel } from "@/lib/types";
import { KindMark } from "./marks";

const KIND_FILL: Record<NodeKind, string> = {
  creation: "#8a9bb5",
  system: "#c9a36a",
  machine: "#c45c4a",
  agent: "#7eb8b3",
};

const STAKE_STROKE: Record<StakeLevel, string> = {
  digital: "rgba(138, 155, 181, 0.55)",
  business: "rgba(201, 163, 106, 0.7)",
  physical: "rgba(196, 92, 74, 0.75)",
};

interface Props {
  nodes: NetworkNode[];
  connections: Connection[];
  highlight?: string[];
  selectedId?: string;
}

export function NetworkGraph({ nodes, connections, highlight, selectedId }: Props) {
  const [hover, setHover] = useState<string | null>(null);
  const [filter, setFilter] = useState<NodeKind | "all">("all");

  const visible = useMemo(
    () => (filter === "all" ? nodes : nodes.filter((n) => n.kind === filter)),
    [nodes, filter],
  );
  const visibleIds = useMemo(() => new Set(visible.map((n) => n.id)), [visible]);
  const edges = connections.filter((c) => c.path.every((id) => visibleIds.has(id)) && c.status !== "blocked");

  const active = hover ?? selectedId;

  return (
    <div>
      <div className="mb-4 flex flex-wrap items-center gap-2 text-[11px] uppercase tracking-[0.16em] text-star-dim">
        {(["all", "creation", "system", "machine", "agent"] as const).map((k) => (
          <button
            key={k}
            type="button"
            onClick={() => setFilter(k)}
            className={`rounded-full px-3 py-1 ring-1 transition ${
              filter === k ? "bg-white/[0.08] text-star ring-white/20" : "ring-white/10 hover:text-star"
            }`}
          >
            {k}
          </button>
        ))}
        <span className="ml-auto font-mono normal-case tracking-normal text-star-mute">
          {visible.length} nodes · {edges.length} live paths
        </span>
      </div>
      <div className="relative overflow-hidden rounded-2xl border border-white/[0.08] bg-ink-900/70">
        <svg viewBox="0 0 100 100" className="h-[520px] w-full" role="img" aria-label="Network constellation">
          {edges.map((c) => {
            const pts = c.path
              .map((id) => nodes.find((n) => n.id === id))
              .filter((n): n is NetworkNode => Boolean(n));
            const lit = active ? c.path.includes(active) : Boolean(highlight?.some((id) => c.path.includes(id)));
            return pts.slice(0, -1).map((from, i) => {
              const to = pts[i + 1];
              if (!to) return null;
              return (
                <line
                  key={`${c.id}-${from.id}-${to.id}`}
                  x1={from.position.x}
                  y1={from.position.y}
                  x2={to.position.x}
                  y2={to.position.y}
                  stroke={STAKE_STROKE[c.stakes]}
                  strokeWidth={lit ? 0.55 : 0.22}
                  strokeOpacity={lit ? 0.95 : 0.45}
                />
              );
            });
          })}
          {visible.map((node) => {
            const lit = active === node.id || highlight?.includes(node.id);
            return (
              <Link key={node.id} href={`/nodes/${node.id}`}>
                <g
                  onMouseEnter={() => setHover(node.id)}
                  onMouseLeave={() => setHover(null)}
                  className="cursor-pointer"
                >
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={lit ? 2.3 : 1.55}
                    fill={KIND_FILL[node.kind]}
                    opacity={lit ? 1 : 0.85}
                  />
                  <circle
                    cx={node.position.x}
                    cy={node.position.y}
                    r={lit ? 4.2 : 3.1}
                    fill="none"
                    stroke={KIND_FILL[node.kind]}
                    strokeOpacity={lit ? 0.45 : 0.18}
                    strokeWidth={0.2}
                  />
                  <text
                    x={node.position.x}
                    y={node.position.y + 5.4}
                    textAnchor="middle"
                    fill="#e8e4dc"
                    fontSize="2.1"
                    opacity={0.85}
                  >
                    {node.name}
                  </text>
                </g>
              </Link>
            );
          })}
        </svg>
        {hover ? (
          <HoverCard node={nodes.find((n) => n.id === hover)} />
        ) : (
          <p className="pointer-events-none absolute bottom-4 left-5 text-xs text-star-mute">
            Hover a node. Click to open its interface.
          </p>
        )}
      </div>
    </div>
  );
}

function HoverCard({ node }: { node?: NetworkNode }) {
  if (!node) return null;
  return (
    <div className="absolute bottom-4 left-5 max-w-sm rounded-xl border border-white/10 bg-ink-950/90 p-4 backdrop-blur">
      <div className="flex items-center gap-2">
        <KindMark kind={node.kind} />
        <span className="font-mono text-[10px] text-star-mute">{node.domain}</span>
      </div>
      <p className="mt-2 font-serif text-lg text-star">{node.name}</p>
      <p className="mt-1 text-sm leading-relaxed text-star-dim">{node.purpose}</p>
      <p className="mt-2 text-xs text-star-mute">
        {node.owner.name} · trust {node.trust.score} · {node.trust.stakeCeiling} ceiling
      </p>
    </div>
  );
}
