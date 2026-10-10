export function Mark({ className = "h-6 w-6" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" fill="#050506" />
      <rect x="8" y="20" width="16" height="4" fill="#ecece8" />
      <rect x="14" y="8" width="4" height="12" fill="#ff4d2e" />
    </svg>
  );
}
