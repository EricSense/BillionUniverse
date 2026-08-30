export function Mark({ size = 22 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" fill="none" aria-hidden>
      <circle cx="16" cy="16" r="11" stroke="#d6ff4b" strokeWidth="1.6" />
      <circle cx="16" cy="16" r="4.2" fill="#8b7cff" />
      <circle cx="24.5" cy="8.5" r="1.6" fill="#5ce1e6" />
      <circle cx="7.8" cy="22.5" r="1.3" fill="#ff6b9d" />
    </svg>
  );
}
