export const PACES = ["spacious", "balanced", "dense"] as const;
export const GRAVITIES = ["create", "learn", "direct", "connect"] as const;
export const CLIMATES = ["dawn", "day", "dusk", "night"] as const;
export const GRAINS = ["warm", "sharp", "soft"] as const;

export type Pace = (typeof PACES)[number];
export type Gravity = (typeof GRAVITIES)[number];
export type Climate = (typeof CLIMATES)[number];
export type Grain = (typeof GRAINS)[number];

export type Person = {
  name: string;
  pace: Pace;
  gravity: Gravity;
  climate: Climate;
  grain: Grain;
  arrivedAt: string;
};

export const STORAGE_KEY = "billion-universe.person.v1";

export const DEFAULT_PERSON: Person = {
  name: "",
  pace: "spacious",
  climate: "dusk",
  grain: "warm",
  gravity: "create",
  arrivedAt: "",
};

export function isPace(value: unknown): value is Pace {
  return typeof value === "string" && (PACES as readonly string[]).includes(value);
}

export function isGravity(value: unknown): value is Gravity {
  return typeof value === "string" && (GRAVITIES as readonly string[]).includes(value);
}

export function isClimate(value: unknown): value is Climate {
  return typeof value === "string" && (CLIMATES as readonly string[]).includes(value);
}

export function isGrain(value: unknown): value is Grain {
  return typeof value === "string" && (GRAINS as readonly string[]).includes(value);
}

export function parsePerson(value: unknown): Person | null {
  if (!value || typeof value !== "object") return null;
  const record = value as Record<string, unknown>;
  const name = typeof record.name === "string" ? record.name.trim().slice(0, 40) : "";
  if (!name) return null;
  if (!isPace(record.pace)) return null;
  if (!isGravity(record.gravity)) return null;
  if (!isClimate(record.climate)) return null;
  if (!isGrain(record.grain)) return null;
  const arrivedAt =
    typeof record.arrivedAt === "string" && record.arrivedAt
      ? record.arrivedAt
      : new Date().toISOString();
  return {
    name,
    pace: record.pace,
    gravity: record.gravity,
    climate: record.climate,
    grain: record.grain,
    arrivedAt,
  };
}

export function readStoredPerson(): Person | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    return parsePerson(JSON.parse(raw));
  } catch {
    return null;
  }
}

export function writeStoredPerson(person: Person | null) {
  if (typeof window === "undefined") return;
  if (!person) {
    window.localStorage.removeItem(STORAGE_KEY);
    return;
  }
  window.localStorage.setItem(STORAGE_KEY, JSON.stringify(person));
}

export function applyPersonToDocument(person: Person | null) {
  if (typeof document === "undefined") return;
  const root = document.documentElement;
  if (!person) {
    root.removeAttribute("data-pace");
    root.removeAttribute("data-gravity");
    root.removeAttribute("data-climate");
    root.removeAttribute("data-grain");
    root.removeAttribute("data-named");
    return;
  }
  root.dataset.pace = person.pace;
  root.dataset.gravity = person.gravity;
  root.dataset.climate = person.climate;
  root.dataset.grain = person.grain;
  root.dataset.named = "true";
}

export function hashName(name: string): number {
  let hash = 2166136261;
  const input = name.trim().toLowerCase() || "universe";
  for (let i = 0; i < input.length; i += 1) {
    hash ^= input.charCodeAt(i);
    hash = Math.imul(hash, 16777619);
  }
  return hash >>> 0;
}

export type SigilPoint = { x: number; y: number };

export function sigilPoints(name: string, count = 8): SigilPoint[] {
  const hash = hashName(name);
  const points: SigilPoint[] = [];
  for (let i = 0; i < count; i += 1) {
    const slice = (hash >> (i * 3)) & 31;
    const angle = (i / count) * Math.PI * 2 - Math.PI / 2;
    const radius = 0.38 + (slice / 31) * 0.5;
    points.push({
      x: 50 + Math.cos(angle) * radius * 42,
      y: 50 + Math.sin(angle) * radius * 42,
    });
  }
  return points;
}

export function describePerson(person: Person): string {
  const pace =
    person.pace === "spacious"
      ? "room to think"
      : person.pace === "dense"
        ? "everything in reach"
        : "a natural rhythm";
  const gravity =
    person.gravity === "create"
      ? "making"
      : person.gravity === "learn"
        ? "understanding"
        : person.gravity === "direct"
          ? "deciding"
          : "being with others";
  return `${person.name} · ${person.climate} ${person.grain} · ${pace} · ${gravity}`;
}

export function personEquals(a: Person | null, b: Person | null): boolean {
  if (a === b) return true;
  if (!a || !b) return false;
  return (
    a.name === b.name &&
    a.pace === b.pace &&
    a.gravity === b.gravity &&
    a.climate === b.climate &&
    a.grain === b.grain
  );
}
