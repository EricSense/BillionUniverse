export type NodeStatus = "online" | "degraded" | "deploying" | "planned";

export type SiteNode = {
  id: string;
  name: string;
  region: string;
  status: NodeStatus;
  kind: "yard" | "camp" | "pad" | "port";
  lat: number;
  lng: number;
  people: number;
  link_pct: number;
  power_kw: number;
  uptime_d: number;
};

export const FLEET: SiteNode[] = [
  {
    id: "N-01",
    name: "Yard 12",
    region: "Oakland, CA",
    status: "online",
    kind: "yard",
    lat: 37.79,
    lng: -122.27,
    people: 14,
    link_pct: 99.2,
    power_kw: 18.4,
    uptime_d: 41,
  },
  {
    id: "N-02",
    name: "Ridge Camp",
    region: "Elko, NV",
    status: "online",
    kind: "camp",
    lat: 40.83,
    lng: -115.76,
    people: 9,
    link_pct: 97.1,
    power_kw: 11.2,
    uptime_d: 18,
  },
  {
    id: "N-03",
    name: "South Slip",
    region: "Houston, TX",
    status: "degraded",
    kind: "port",
    lat: 29.73,
    lng: -95.26,
    people: 22,
    link_pct: 81.4,
    power_kw: 24.0,
    uptime_d: 7,
  },
  {
    id: "N-04",
    name: "Pad B",
    region: "Boca Chica, TX",
    status: "deploying",
    kind: "pad",
    lat: 25.99,
    lng: -97.15,
    people: 3,
    link_pct: 0,
    power_kw: 4.1,
    uptime_d: 0,
  },
  {
    id: "N-05",
    name: "Ice Road 4",
    region: "Prudhoe Bay, AK",
    status: "planned",
    kind: "camp",
    lat: 70.29,
    lng: -148.71,
    people: 0,
    link_pct: 0,
    power_kw: 0,
    uptime_d: 0,
  },
  {
    id: "N-06",
    name: "East Cut",
    region: "Atacama, CL",
    status: "planned",
    kind: "camp",
    lat: -24.28,
    lng: -69.07,
    people: 0,
    link_pct: 0,
    power_kw: 0,
    uptime_d: 0,
  },
];

export const PRIMARY = FLEET[0]!;

export type RosterRow = { name: string; role: string; in: boolean };

export const ROSTER: RosterRow[] = [
  { name: "M. Chen", role: "shift lead", in: true },
  { name: "R. Okonkwo", role: "crane", in: true },
  { name: "S. Patel", role: "yard", in: true },
  { name: "A. Novak", role: "link tech", in: true },
  { name: "J. Reyes", role: "safety", in: false },
];

export const KIT = [
  { item: "Mast + weatherproof head", role: "Line-of-sight radio, GNSS, cameras", usd: 2400 },
  { item: "Starlink / LTE dual WAN", role: "The link. Fail over. Do not invent a constellation.", usd: 1800 },
  { item: "Edge compute (rugged NUC / Jetson)", role: "Roster, map, telemetry on-site if the sky dies", usd: 1200 },
  { item: "Power tap + UPS", role: "Know watts. Survive a 20-minute cut.", usd: 900 },
  { item: "Badge / BLE readers", role: "Who is actually on the dirt", usd: 650 },
  { item: "Console (this software)", role: "One screen. Not five apps.", usd: 0 },
] as const;

export function kitTotal(): number {
  return KIT.reduce((s, k) => s + k.usd, 0);
}

export function fleetCounts(nodes: SiteNode[] = FLEET) {
  return {
    total: nodes.length,
    online: nodes.filter((n) => n.status === "online").length,
    people: nodes.reduce((s, n) => s + n.people, 0),
  };
}
