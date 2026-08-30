import type { NodeKind, StakeLevel } from "@/lib/types";

const KIND_COLOR: Record<NodeKind, string> = {
  creation: "bg-slate/20 text-slate ring-slate/30",
  system: "bg-gold/15 text-gold ring-gold/30",
  machine: "bg-rust/15 text-rust ring-rust/30",
  agent: "bg-aqua/15 text-aqua ring-aqua/30",
};

const STAKE_COLOR: Record<StakeLevel, string> = {
  digital: "text-slate",
  business: "text-gold",
  physical: "text-rust",
};

export function KindMark({ kind }: { kind: NodeKind }) {
  return (
    <span
      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] uppercase tracking-[0.16em] ring-1 ${KIND_COLOR[kind]}`}
    >
      {kind}
    </span>
  );
}

export function StakeMark({ stakes }: { stakes: StakeLevel }) {
  return (
    <span className={`font-mono text-[11px] uppercase tracking-[0.18em] ${STAKE_COLOR[stakes]}`}>
      {stakes}
    </span>
  );
}

export function StatusDot({ status }: { status: string }) {
  const color =
    status === "blocked"
      ? "bg-rust"
      : status === "executed"
        ? "bg-aqua"
        : status === "live"
          ? "bg-gold"
          : "bg-star-dim";
  return <span className={`inline-block h-1.5 w-1.5 rounded-full ${color}`} />;
}
