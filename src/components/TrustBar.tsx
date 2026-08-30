import type { StakeLevel } from "@/lib/types";

export function TrustBar({ score, ceiling }: { score: number; ceiling: StakeLevel }) {
  const clamped = Math.max(0, Math.min(100, score));
  return (
    <div>
      <div className="mb-1 flex items-baseline justify-between text-xs text-star-dim">
        <span className="font-mono">{clamped}</span>
        <span className="uppercase tracking-[0.16em]">{ceiling} ceiling</span>
      </div>
      <div className="relative h-1.5 overflow-hidden rounded-full bg-white/[0.06]">
        <div className="absolute inset-y-0 left-[40%] w-px bg-gold/40" />
        <div className="absolute inset-y-0 left-[75%] w-px bg-rust/50" />
        <div
          className="h-full rounded-full bg-gradient-to-r from-slate via-gold to-rust"
          style={{ width: `${clamped}%` }}
        />
      </div>
      <div className="mt-1 flex justify-between font-mono text-[10px] uppercase tracking-[0.14em] text-star-mute">
        <span>Digital</span>
        <span>Business</span>
        <span>Physical</span>
      </div>
    </div>
  );
}
