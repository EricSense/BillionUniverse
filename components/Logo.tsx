export function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="4" fill="#0c0d0a" />
      <rect x="6" y="6" width="20" height="20" fill="none" stroke="#d6ff3f" strokeWidth="1.6" />
      <path d="M6 22 L16 10 L26 22" fill="none" stroke="#7ee0c8" strokeWidth="1.3" />
      <circle cx="16" cy="16" r="2.1" fill="#d6ff3f" />
    </svg>
  );
}
