import type { Climate, Grain, Gravity, Pace, Person } from "./person";

export const PACE_OPTIONS: { id: Pace; title: string; detail: string }[] = [
  { id: "spacious", title: "Give me room", detail: "Large type. Quiet surfaces. One thing at a time." },
  { id: "balanced", title: "Natural rhythm", detail: "An editorial pace. Enough air, enough signal." },
  { id: "dense", title: "Everything in reach", detail: "Compact, stacked, operational. No hunting." },
];

export const GRAVITY_OPTIONS: { id: Gravity; title: string; detail: string }[] = [
  { id: "create", title: "Making", detail: "Studio, drafts, unfinished work on the desk." },
  { id: "learn", title: "Understanding", detail: "Threads, questions, a library that remembers." },
  { id: "direct", title: "Deciding", detail: "Priorities, signals, the next four hours." },
  { id: "connect", title: "Gathering", detail: "People in orbit, unanswered letters, rooms." },
];

export const CLIMATE_OPTIONS: { id: Climate; title: string; detail: string }[] = [
  { id: "dawn", title: "First light", detail: "Paper, rose, the hour before the day insists." },
  { id: "day", title: "Full day", detail: "Clear, ink on page, work in open air." },
  { id: "dusk", title: "Golden hour", detail: "Copper and violet. The room turns inward." },
  { id: "night", title: "After dark", detail: "Deep field, cool stars, a private console." },
];

export const GRAIN_OPTIONS: { id: Grain; title: string; detail: string }[] = [
  { id: "warm", title: "Paper and wood", detail: "Serif voice. Rounded rooms. Analog heat." },
  { id: "sharp", title: "Instrument", detail: "Geometric. Precise. The product as a tool." },
  { id: "soft", title: "Water and cloth", detail: "Gentle corners. A quieter kind of certainty." },
];

const hourGreeting: Record<Grain, (hour: number, name: string) => string> = {
  warm: (hour, name) => {
    if (hour < 5) return `Still here, ${name}. The night is long enough.`;
    if (hour < 12) return `Good morning, ${name}. The table is yours.`;
    if (hour < 17) return `Afternoon, ${name}. Nothing here is in a hurry.`;
    if (hour < 21) return `Evening, ${name}. The light has changed for you.`;
    return `Late, ${name}. We kept the lamp on.`;
  },
  sharp: (hour, name) => {
    if (hour < 5) return `${name} · overnight window`;
    if (hour < 12) return `${name} · morning block`;
    if (hour < 17) return `${name} · day operations`;
    if (hour < 21) return `${name} · evening close`;
    return `${name} · after hours`;
  },
  soft: (hour, name) => {
    if (hour < 5) return `${name}, the world can wait.`;
    if (hour < 12) return `Hello ${name}. Begin wherever it feels kind.`;
    if (hour < 17) return `${name} — a gentle middle of the day.`;
    if (hour < 21) return `The day is softening, ${name}.`;
    return `Rest is allowed, ${name}.`;
  },
};

export function greetingFor(person: Person, date = new Date()): string {
  return hourGreeting[person.grain](date.getHours(), person.name);
}

export function gravityTitle(gravity: Gravity): string {
  switch (gravity) {
    case "create":
      return "Studio";
    case "learn":
      return "Library";
    case "direct":
      return "Bridge";
    case "connect":
      return "Hearth";
  }
}

export function thesisFor(person: Person): string {
  const climate =
    person.climate === "dawn"
      ? "first light"
      : person.climate === "day"
        ? "open day"
        : person.climate === "dusk"
          ? "golden hour"
          : "after dark";
  return `This universe exists only for ${person.name}: ${climate}, ${person.grain} grain, ${person.pace} pace, pulled toward ${gravityTitle(person.gravity).toLowerCase()}.`;
}

export type ModuleCard = {
  kicker: string;
  title: string;
  body: string;
  meta: string;
};

export function primaryModules(person: Person): ModuleCard[] {
  switch (person.gravity) {
    case "create":
      return [
        {
          kicker: "On the desk",
          title: "Unfinished, on purpose",
          body: "A mark left mid-gesture so tomorrow has somewhere to begin. Platforms hide drafts. You live in them.",
          meta: "Studio · private",
        },
        {
          kicker: "Material",
          title: person.climate === "night" ? "Ink and phosphor" : "Paper, copper, dust",
          body: "Palette drawn from your climate — not a brand kit. The room takes the temperature you asked for.",
          meta: `${person.climate} · ${person.grain}`,
        },
        {
          kicker: "Quiet instruction",
          title: "Make one true thing",
          body: "Not a feed. A single invitation. When you are done, the universe will make space for the next.",
          meta: "One at a time",
        },
      ];
    case "learn":
      return [
        {
          kicker: "Still open",
          title: "Questions you have not closed",
          body: "Understanding is a corridor, not a trophy. The library keeps the door cracked so curiosity can return.",
          meta: "Three threads",
        },
        {
          kicker: "Reading",
          title: "The sentence you underlined",
          body: "Platforms optimize for finishing. You optimize for remaining with an idea until it changes you.",
          meta: "Held in orbit",
        },
        {
          kicker: "Remember",
          title: "A note from earlier you",
          body: `${person.name} asked to be reminded that confusion is information, not failure.`,
          meta: "Personal margin",
        },
      ];
    case "direct":
      return [
        {
          kicker: "Decide today",
          title: "Three gates, no more",
          body: "Everything else is noise until these move. The bridge does not flatter you with infinite tabs.",
          meta: "Priority lock",
        },
        {
          kicker: "Signals",
          title: "What requires a human",
          body: "The rest can wait or run. You are not a notification surface. You are the judgment layer.",
          meta: "Exception only",
        },
        {
          kicker: "Horizon",
          title: "The next four hours",
          body: "A dense field: time as material. Reach, act, close. Then the climate can change.",
          meta: "Operational",
        },
      ];
    case "connect":
      return [
        {
          kicker: "In orbit",
          title: "People, not profiles",
          body: "Presence without a performance. The hearth keeps names warm and lets the rest of the network stay quiet.",
          meta: "Close circle",
        },
        {
          kicker: "Unanswered",
          title: "Letters waiting for a real reply",
          body: "Not inbox zero. A small stack of human unfinishedness you actually mean to return to.",
          meta: "Four waiting",
        },
        {
          kicker: "A room",
          title: "Somewhere to gather",
          body: `${person.name}'s universe is a table. Pull up a chair — the light is already set for company.`,
          meta: "Open",
        },
      ];
  }
}

export function secondarySignals(person: Person): { label: string; value: string }[] {
  return [
    { label: "Climate", value: person.climate },
    { label: "Grain", value: person.grain },
    { label: "Pace", value: person.pace },
    { label: "Gravity", value: person.gravity },
  ];
}
