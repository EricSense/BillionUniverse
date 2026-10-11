import { useId } from "react";
import { BRAND } from "@/lib/brand";

/** Concentric orbital mark from the BillionUniverse lockup. */
export function Mark({ className = "h-12 w-12" }: { className?: string }) {
  const gid = `bu-outer-${useId().replace(/:/g, "")}`;
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <defs>
        <linearGradient id={gid} x1="50" y1="100" x2="50" y2="0" gradientUnits="userSpaceOnUse">
          <stop offset="0%" stopColor={BRAND.core} />
          <stop offset="55%" stopColor={BRAND.ringMid} />
          <stop offset="100%" stopColor={BRAND.ringOuter} />
        </linearGradient>
      </defs>
      <circle cx="50" cy="50" r="9.2" fill={BRAND.core} />
      <circle
        cx="50"
        cy="50"
        r="18.5"
        fill="none"
        stroke={BRAND.ringInner}
        strokeWidth="3.1"
        strokeLinecap="round"
        strokeDasharray="94 22"
        transform="rotate(-42 50 50)"
      />
      <circle
        cx="50"
        cy="50"
        r="28.5"
        fill="none"
        stroke={BRAND.ringMid}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray="142 37"
        transform="rotate(-28 50 50)"
      />
      <circle
        cx="50"
        cy="50"
        r="39"
        fill="none"
        stroke={`url(#${gid})`}
        strokeWidth="5.2"
        strokeLinecap="round"
        strokeDasharray="88 32 86 39"
        transform="rotate(-18 50 50)"
      />
    </svg>
  );
}

export function Wordmark({
  className = "text-[22px] tracking-tight text-ink",
}: {
  className?: string;
}) {
  return <span className={`font-sans font-medium ${className}`}>BillionUniverse</span>;
}

export function Lockup({
  markClass = "h-11 w-11",
  textClass = "text-[22px] tracking-tight text-ink",
}: {
  markClass?: string;
  textClass?: string;
}) {
  return (
    <span className="inline-flex items-center gap-[0.85em]">
      <Mark className={markClass} />
      <Wordmark className={textClass} />
    </span>
  );
}
