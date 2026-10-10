export type District = {
  slug: string;
  name: string;
  kind: string;
  x: number;
  y: number;
  line: string;
  body: string;
};

export const DISTRICTS: District[] = [
  {
    slug: "commons",
    name: "The Commons",
    kind: "square",
    x: 0.48,
    y: 0.42,
    line: "Where lives overlap without becoming a feed.",
    body: "A square is not a timeline. You stand next to people. You can leave. Nothing here is ranked. The Commons is the proof that a billion people share a world the way a city shares a plaza — by occupying it, not by scrolling it.",
  },
  {
    slug: "library",
    name: "The Library",
    kind: "record",
    x: 0.62,
    y: 0.28,
    line: "What this universe is, written down.",
    body: "The internet gave us pages. Apps gave us tools. Feeds gave us attention. None of them gave us a world. Billion Universe is that world: one continuous place a person can inhabit, at the scale of everyone alive.",
  },
  {
    slug: "workshop",
    name: "The Workshop",
    kind: "labor",
    x: 0.32,
    y: 0.55,
    line: "The first ninety days, on the bench.",
    body: "A universe that cannot be entered is a slide. This workshop exists to make the world stand up: claim rooms, walk districts, keep a plot that does not vanish when the tab closes.",
  },
  {
    slug: "harbor",
    name: "The Harbor",
    kind: "arrival",
    x: 0.72,
    y: 0.58,
    line: "People coming in from the old internet.",
    body: "Every universe has an edge. The Harbor is ours. You arrive with a name, a city, and one sentence of what you are making. That is enough to light a room.",
  },
];

export function getDistrict(slug: string): District | undefined {
  return DISTRICTS.find((d) => d.slug === slug);
}

export type Neighbor = {
  name: string;
  city: string;
  making: string;
  x: number;
  y: number;
};

/** Seeded inhabitants — not a social graph. Lights on the atlas. */
export const NEIGHBORS: Neighbor[] = [
  { name: "Amina Diallo", city: "Dakar", making: "clinic records that work without a signal", x: 0.41, y: 0.48 },
  { name: "Kenji Mori", city: "Sapporo", making: "a workshop that fits in a pocket", x: 0.78, y: 0.31 },
  { name: "Noor Rahman", city: "Lahore", making: "a school that opens at dawn, online", x: 0.64, y: 0.4 },
  { name: "Mateo Cruz", city: "Medellín", making: "a street market with a ledger", x: 0.29, y: 0.52 },
  { name: "Sora Vang", city: "Minneapolis", making: "a library for a language with no keyboard", x: 0.26, y: 0.34 },
  { name: "Ilya Petrov", city: "Tbilisi", making: "power that lasts a winter blackout", x: 0.55, y: 0.3 },
  { name: "Chioma Okafor", city: "Enugu", making: "a studio that ships cloth, not content", x: 0.46, y: 0.5 },
  { name: "Elena Rossi", city: "Bologna", making: "a kitchen that feeds a block", x: 0.51, y: 0.33 },
  { name: "Ravi Menon", city: "Kochi", making: "boats, then the software for boats", x: 0.66, y: 0.49 },
  { name: "Hanae Benali", city: "Tunis", making: "archives that outlive the government", x: 0.5, y: 0.38 },
  { name: "Jonas Berg", city: "Tromsø", making: "a room that stays warm at −30", x: 0.52, y: 0.16 },
  { name: "Lila Okada", city: "Osaka", making: "quiet games for crowded trains", x: 0.8, y: 0.36 },
];

export const PLAN = [
  {
    when: "Days 1–30",
    title: "The universe has a door",
    body: "Ship the client: arrive, claim a plot, keep a room. Four districts you can walk. If a stranger can enter from a phone and still have a place when they come back, the world exists.",
  },
  {
    when: "Days 31–60",
    title: "A thousand rooms",
    body: "One thousand claimed plots. The atlas should feel occupied, not empty. Host the Harbor as a weekly arrival — people say what they are making, then go light their rooms.",
  },
  {
    when: "Days 61–90",
    title: "The first territory",
    body: "An organization — a school, a market, a shop — occupies a district instead of launching an app. That is the test. If they would rather have a place than a URL, we are building the right thing.",
  },
];
