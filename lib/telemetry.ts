import type { SiteNode } from "./nodes";

export type Telemetry = {
  t: number;
  link_pct: number;
  power_kw: number;
  people: number;
  wind_ms: number;
};

/** Deterministic live-looking series from a node + clock. */
export function sample(node: SiteNode, now = Date.now()): Telemetry {
  if (node.status === "planned") {
    return { t: now, link_pct: 0, power_kw: 0, people: 0, wind_ms: 0 };
  }
  const s = Math.floor(now / 2000);
  const wobble = Math.sin(s / 3 + node.lat) * 0.8;
  const linkBase = node.status === "degraded" ? 80 : node.status === "deploying" ? 12 : node.link_pct;
  const powerBase = node.status === "deploying" ? node.power_kw : node.power_kw;
  const people =
    node.status === "deploying" ? node.people : Math.max(0, node.people + Math.round(Math.sin(s / 5) * 1.2));
  return {
    t: now,
    link_pct: Math.max(0, Math.min(100, linkBase + wobble)),
    power_kw: Math.max(0, powerBase + wobble * 0.4),
    people,
    wind_ms: Math.max(0, 3.2 + Math.sin(s / 4) * 1.4),
  };
}
