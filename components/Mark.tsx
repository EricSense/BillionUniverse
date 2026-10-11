const CORE = "#1B56C9";
const INNER = "#2F74E0";
const MID = "#4A96EE";
const OUTER = "#6BB7F6";

export function Mark({ className = "h-12 w-12" }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} aria-hidden>
      <circle cx="50" cy="50" r="9.2" fill={CORE} />
      <circle
        cx="50"
        cy="50"
        r="18.5"
        fill="none"
        stroke={INNER}
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
        stroke={MID}
        strokeWidth="3.4"
        strokeLinecap="round"
        strokeDasharray="142 37"
        transform="rotate(-28 50 50)"
      />
      <path
        d="M28 80 A40 40 0 0 1 20 48"
        fill="none"
        stroke={CORE}
        strokeWidth="5.2"
        strokeLinecap="round"
      />
      <path
        d="M24 40 A40 40 0 0 1 80 30"
        fill="none"
        stroke={OUTER}
        strokeWidth="5.2"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function Wordmark({ className = "text-[22px] text-ink" }: { className?: string }) {
  return <span className={`font-sans font-medium tracking-tight ${className}`}>BillionUniverse</span>;
}
