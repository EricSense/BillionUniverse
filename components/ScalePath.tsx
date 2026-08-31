import { formatPeople } from "@/lib/format";
import { scalePosition } from "@/lib/scale";
import { SCALE_STEPS } from "@/lib/catalog";

const LABELS: Record<number, string> = {
  1000: "1k",
  10_000: "10k",
  100_000: "100k",
  1_000_000: "1M",
  10_000_000: "10M",
  100_000_000: "100M",
  1_000_000_000: "1B",
};

export function ScalePath({
  people,
  tone = "light",
  compact = false,
}: {
  people: number;
  tone?: "light" | "dark";
  compact?: boolean;
}) {
  const pos = scalePosition(Math.max(people, 1)) * 100;
  const dark = tone === "dark";
  const track = dark ? "bg-white/10" : "bg-ink/10";
  const fill = dark ? "bg-hq-text" : "bg-accent";
  const tick = dark ? "text-hq-mist" : "text-mist";
  const now = dark ? "text-hq-text" : "text-ink";

  return (
    <div className="w-full">
      {!compact && (
        <div className="mb-2 flex items-baseline justify-between">
          <p className={`text-xs uppercase tracking-[0.16em] ${tick}`}>Path to a billion</p>
          <p className={`font-mono text-sm tabular ${now}`}>{formatPeople(people)} people</p>
        </div>
      )}
      <div className={`relative h-1.5 w-full rounded-full ${track}`}>
        <div
          className={`absolute inset-y-0 left-0 rounded-full ${fill}`}
          style={{ width: `${Math.max(pos, people > 0 ? 1.2 : 0)}%` }}
        />
        <div
          className={`absolute top-1/2 h-3 w-3 -translate-x-1/2 -translate-y-1/2 rounded-full ${fill} ${
            dark ? "ring-4 ring-hq" : "ring-4 ring-paper"
          }`}
          style={{ left: `${Math.max(pos, people > 0 ? 1.2 : 0)}%` }}
        />
      </div>
      <div className="relative mt-2 h-4">
        {SCALE_STEPS.map((step) => (
          <span
            key={step}
            className={`absolute -translate-x-1/2 font-mono text-[10px] uppercase tracking-wide ${
              people >= step ? now : tick
            }`}
            style={{ left: `${scalePosition(step) * 100}%` }}
          >
            {LABELS[step]}
          </span>
        ))}
      </div>
    </div>
  );
}
