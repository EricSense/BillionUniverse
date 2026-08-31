import type { Person } from "./person";

export type Archetype = Person & {
  role: string;
  line: string;
};

export const ARCHETYPES: Archetype[] = [
  {
    name: "Amina",
    role: "Maker",
    line: "A dusk studio with paper-warm edges. Few things, held closely.",
    pace: "spacious",
    gravity: "create",
    climate: "dusk",
    grain: "warm",
    arrivedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    name: "Kenji",
    role: "Operator",
    line: "A night bridge. Signals stacked. Decisions in reach.",
    pace: "dense",
    gravity: "direct",
    climate: "night",
    grain: "sharp",
    arrivedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    name: "Noor",
    role: "Researcher",
    line: "First light, soft edges. Questions left open on purpose.",
    pace: "balanced",
    gravity: "learn",
    climate: "dawn",
    grain: "soft",
    arrivedAt: "2026-01-01T00:00:00.000Z",
  },
  {
    name: "Mateo",
    role: "Host",
    line: "Full day, people in orbit. The room is for gathering.",
    pace: "balanced",
    gravity: "connect",
    climate: "day",
    grain: "warm",
    arrivedAt: "2026-01-01T00:00:00.000Z",
  },
];
