import type { ConnectionValue, NetworkNode, StakeLevel } from "../types";

const BASE: Record<StakeLevel, [number, number]> = {
  digital: [0.4, 2.8],
  business: [24, 420],
  physical: [90, 1800],
};

function hash01(s: string): number {
  let h = 0;
  for (let i = 0; i < s.length; i += 1) h = (h * 33 + s.charCodeAt(i)) >>> 0;
  return (h % 1000) / 1000;
}

export function priceConnection(source: NetworkNode, target: NetworkNode, path: string[], stakes: StakeLevel): number {
  const [lo, hi] = BASE[stakes];
  const spread = lo + (hi - lo) * hash01(`${source.id}:${target.id}:${stakes}`);
  const hopPremium = 1 + (path.length - 2) * 0.18;
  const trustPremium = 1 + ((source.trust.score + target.trust.score) / 200) * 0.25;
  return Math.round(spread * hopPremium * trustPremium * 100) / 100;
}

export function splitValue(path: string[], amount: number, nodes: NetworkNode[]): ConnectionValue {
  const present = path.map((id) => nodes.find((n) => n.id === id)).filter((n): n is NetworkNode => Boolean(n));
  if (present.length === 0) {
    return { amount, currency: "BU", split: [] };
  }
  const weights = present.map((n, i) => {
    const end = i === 0 || i === present.length - 1 ? 1.15 : 0.9;
    const trust = 0.6 + n.trust.score / 250;
    return end * trust;
  });
  const total = weights.reduce((a, b) => a + b, 0);
  const split = present.map((n, i) => ({
    nodeId: n.id,
    share: Math.round((weights[i] / total) * 1000) / 1000,
  }));
  const drift = 1 - split.reduce((a, s) => a + s.share, 0);
  if (split[0]) split[0].share = Math.round((split[0].share + drift) * 1000) / 1000;
  return { amount, currency: "BU", split };
}

export function formatBU(amount: number): string {
  if (amount >= 100) return `${Math.round(amount)} BU`;
  return `${amount.toFixed(2)} BU`;
}
