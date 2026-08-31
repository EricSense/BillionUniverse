import { sigilPoints } from "@/lib/person";

export function Sigil({ name, size = 72 }: { name: string; size?: number }) {
  const points = sigilPoints(name || "universe");
  const d = points
    .map((point, index) => `${index === 0 ? "M" : "L"} ${point.x.toFixed(1)} ${point.y.toFixed(1)}`)
    .join(" ");
  return (
    <svg
      viewBox="0 0 100 100"
      width={size}
      height={size}
      aria-hidden="true"
      className="shrink-0"
    >
      <circle cx="50" cy="50" r="46" fill="none" stroke="currentColor" strokeOpacity="0.25" />
      <path d={`${d} Z`} fill="none" stroke="var(--accent)" strokeWidth="1.6" />
      {points.map((point) => (
        <circle
          key={`${point.x}-${point.y}`}
          cx={point.x}
          cy={point.y}
          r="2.2"
          fill="var(--accent-2)"
        />
      ))}
    </svg>
  );
}
