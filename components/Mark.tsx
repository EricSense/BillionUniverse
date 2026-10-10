export function Mark({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" className={className} aria-hidden>
      <rect width="32" height="32" rx="16" fill="#07080c" />
      <circle cx="16" cy="16" r="11" fill="none" stroke="#e8c07a" strokeWidth="1.3" />
      <circle cx="20" cy="13" r="2.2" fill="#e8c07a" />
    </svg>
  );
}
