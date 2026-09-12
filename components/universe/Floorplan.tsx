import type { Universe } from "@/lib/schema";

const FILL: Record<string, string> = {
  pallet_rack: "#c45c26",
  pallet: "#c9a66b",
  carton: "#e0c090",
  shelf: "#c45c26",
  display: "#d4894a",
  counter: "#b7a48a",
  forklift: "#d6ff3f",
  pallet_jack: "#9ad64a",
  conveyor: "#6b7c94",
  dock_door: "#7ee0c8",
  column: "#8a9188",
  cart: "#7ee0c8",
  debris: "#8b6914",
  safety_barrier: "#ff6b4a",
  fixture: "#d4894a",
};

export function Floorplan({
  universe,
  className = "h-full w-full",
}: {
  universe: Universe;
  className?: string;
}) {
  const w = Math.max(1, universe.site.bounds.max[0]);
  const h = Math.max(1, universe.site.bounds.max[1]);
  const flip = (y: number) => h - y;
  return (
    <svg viewBox={`0 0 ${w} ${h}`} className={className} preserveAspectRatio="xMidYMid meet">
      <rect width={w} height={h} fill="#14160f" />
      {universe.layout.zones.map((z) => {
        const xs = z.polygon.map((p) => p[0]);
        const ys = z.polygon.map((p) => p[1]);
        const x = Math.min(...xs);
        const y = Math.min(...ys);
        const bw = Math.max(...xs) - x;
        const bh = Math.max(...ys) - y;
        return (
          <rect
            key={z.id}
            x={x}
            y={flip(y + bh)}
            width={bw}
            height={bh}
            fill={z.type === "aisle" ? "#1e2418" : "#18201c"}
            stroke="#2c3124"
            strokeWidth={0.08}
          />
        );
      })}
      {universe.objects.map((o) => {
        const x = o.aabb.min[0];
        const y = o.aabb.min[1];
        const bw = Math.max(0.12, o.aabb.max[0] - o.aabb.min[0]);
        const bh = Math.max(0.12, o.aabb.max[1] - o.aabb.min[1]);
        return (
          <rect
            key={o.id}
            x={x}
            y={flip(y + bh)}
            width={bw}
            height={bh}
            fill={FILL[o.class] ?? "#a8b09a"}
            opacity={0.9}
          />
        );
      })}
    </svg>
  );
}
