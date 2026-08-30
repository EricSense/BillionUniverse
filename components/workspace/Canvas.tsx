"use client";

import { useEffect, useRef, useState, type PointerEvent } from "react";
import { NODE_META, type Universe, type UniverseNode } from "@/lib/types";

type Props = {
  universe: Universe;
  selectedId?: string;
  selfColor: string;
  cursors: { id: string; name: string; color: string; x: number; y: number }[];
  onSelect: (id?: string) => void;
  onMove: (id: string, x: number, y: number) => void;
  onCursor: (x: number, y: number) => void;
};

export function Canvas({
  universe,
  selectedId,
  selfColor,
  cursors,
  onSelect,
  onMove,
  onCursor,
}: Props) {
  const wrapRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [scale, setScale] = useState(1);
  const drag = useRef<{
    kind: "pan" | "node";
    id?: string;
    sx: number;
    sy: number;
    ox: number;
    oy: number;
  } | null>(null);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      const delta = e.deltaY > 0 ? 0.94 : 1.06;
      setScale((s) => Math.min(1.8, Math.max(0.45, s * delta)));
    };
    el.addEventListener("wheel", onWheel, { passive: false });
    return () => el.removeEventListener("wheel", onWheel);
  }, []);

  function clientToWorld(cx: number, cy: number) {
    const rect = wrapRef.current?.getBoundingClientRect();
    if (!rect) return { x: 0, y: 0 };
    return { x: (cx - rect.left - pan.x) / scale, y: (cy - rect.top - pan.y) / scale };
  }

  const nodes = universe.nodes;
  const byId = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div
      ref={wrapRef}
      className="relative h-full min-h-[420px] overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#07070f]"
      onPointerDown={(e) => {
        if ((e.target as HTMLElement).closest("[data-node]")) return;
        drag.current = { kind: "pan", sx: e.clientX, sy: e.clientY, ox: pan.x, oy: pan.y };
        onSelect(undefined);
      }}
      onPointerMove={(e) => {
        const world = clientToWorld(e.clientX, e.clientY);
        onCursor(world.x, world.y);
        const d = drag.current;
        if (!d) return;
        if (d.kind === "pan") {
          setPan({ x: d.ox + (e.clientX - d.sx), y: d.oy + (e.clientY - d.sy) });
        } else if (d.id) {
          onMove(d.id, d.ox + (e.clientX - d.sx) / scale, d.oy + (e.clientY - d.sy) / scale);
        }
      }}
      onPointerUp={() => {
        drag.current = null;
      }}
      onPointerLeave={() => {
        drag.current = null;
      }}
    >
      <div
        className="absolute inset-0 opacity-40"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,255,255,.04) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,.04) 1px, transparent 1px)",
          backgroundSize: `${28 * scale}px ${28 * scale}px`,
          backgroundPosition: `${pan.x}px ${pan.y}px`,
        }}
      />
      <div
        className="absolute left-0 top-0 origin-top-left"
        style={{ transform: `translate(${pan.x}px, ${pan.y}px) scale(${scale})` }}
      >
        <svg className="overflow-visible" width={1} height={1}>
          {universe.edges.map((edge) => {
            const a = byId.get(edge.from);
            const b = byId.get(edge.to);
            if (!a || !b) return null;
            const x1 = a.x + 108;
            const y1 = a.y + 36;
            const x2 = b.x + 8;
            const y2 = b.y + 36;
            const mid = (x1 + x2) / 2;
            return (
              <path
                key={edge.id}
                d={`M ${x1} ${y1} C ${mid} ${y1}, ${mid} ${y2}, ${x2} ${y2}`}
                fill="none"
                stroke={edge.kind === "contains" ? "rgba(139,124,255,.45)" : "rgba(214,255,75,.45)"}
                strokeWidth={1.4}
              />
            );
          })}
        </svg>
        {nodes.map((node) => (
          <NodeCard
            key={node.id}
            node={node}
            selected={node.id === selectedId}
            onPointerDown={(e) => {
              e.stopPropagation();
              onSelect(node.id);
              drag.current = {
                kind: "node",
                id: node.id,
                sx: e.clientX,
                sy: e.clientY,
                ox: node.x,
                oy: node.y,
              };
            }}
          />
        ))}
        {cursors.map((c) => (
          <div
            key={c.id}
            className="pointer-events-none absolute z-20"
            style={{ left: c.x, top: c.y }}
          >
            <svg width="14" height="18" viewBox="0 0 14 18">
              <path d="M1 1 L1 16 L5.5 12.2 L9.2 17.4 L11.4 16.2 L7.6 11 H13 Z" fill={c.color} />
            </svg>
            <span
              className="ml-3 rounded-full px-1.5 py-0.5 text-[10px] text-black"
              style={{ background: c.color }}
            >
              {c.name}
            </span>
          </div>
        ))}
      </div>
      <div className="pointer-events-none absolute bottom-3 left-3 rounded-full border border-white/10 bg-black/40 px-2 py-1 font-mono text-[10px] text-mute">
        drag canvas · wheel zoom · {Math.round(scale * 100)}%
      </div>
      <div
        className="pointer-events-none absolute right-3 top-3 h-2 w-2 rounded-full"
        style={{ background: selfColor }}
      />
    </div>
  );
}

function NodeCard({
  node,
  selected,
  onPointerDown,
}: {
  node: UniverseNode;
  selected: boolean;
  onPointerDown: (e: PointerEvent<HTMLButtonElement>) => void;
}) {
  const meta = NODE_META[node.kind];
  return (
    <button
      type="button"
      data-node={node.id}
      onPointerDown={onPointerDown}
      className={`node-card absolute w-[220px] rounded-2xl border bg-[#12121c]/95 p-3 text-left ${
        selected ? "border-lime/70" : "border-white/10"
      }`}
      style={{ left: node.x, top: node.y }}
    >
      <div className="flex items-center justify-between">
        <span className="font-mono text-[10px] uppercase tracking-wider" style={{ color: meta.accent }}>
          {node.kind}
        </span>
        <span className="h-1.5 w-1.5 rounded-full" style={{ background: meta.accent }} />
      </div>
      <p className="mt-1 truncate text-sm">{node.name}</p>
      <p className="mt-1 truncate text-[11px] text-mute">
        {node.props.value ?? node.props.label ?? node.props.object ?? node.props.path ?? meta.hint}
      </p>
    </button>
  );
}
