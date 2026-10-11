import { BRAND } from "@/lib/brand";

/** Quiet concentric field behind the lockup — the mark at rest. */
export function Field({ className = "" }: { className?: string }) {
  const rings = [80, 140, 210, 290, 380];
  return (
    <svg
      viewBox="0 0 800 800"
      className={`pointer-events-none text-ring ${className}`}
      aria-hidden
    >
      <circle cx="400" cy="400" r="10" fill={BRAND.core} opacity="0.18" />
      {rings.map((r) => (
        <circle
          key={r}
          cx="400"
          cy="400"
          r={r}
          fill="none"
          stroke={BRAND.ringMid}
          strokeWidth="1.2"
          opacity="0.22"
        />
      ))}
    </svg>
  );
}
