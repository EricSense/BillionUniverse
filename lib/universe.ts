export const NAME = "BillionUniverse";
export const BILLION = 1_000_000_000;
export const STORAGE_KEY = "billion-universe.life";

export const THESIS = {
  line: "The universe a billion lives share.",
  against:
    "Not a kit. Not a network. Not a model. Not a mark looking for a product.",
  body: "The world is already being powered — energy, launch, chips, connectivity, intelligence. Those are engines. They make force. Billion Universe is what that force is for: this world, held as one universe, so a billion lives can actually be in it together. You don't use it. You live here.",
} as const;

export type Life = {
  id: string;
  name: string;
  enteredAt: number;
};

export function parseLife(raw: string | null): Life | null {
  if (!raw) return null;
  try {
    const value = JSON.parse(raw) as Partial<Life>;
    if (
      typeof value.id !== "string" ||
      typeof value.name !== "string" ||
      typeof value.enteredAt !== "number" ||
      !value.name.trim() ||
      !Number.isFinite(value.enteredAt)
    ) {
      return null;
    }
    return {
      id: value.id,
      name: value.name.trim().slice(0, 48),
      enteredAt: value.enteredAt,
    };
  } catch {
    return null;
  }
}

export function createLife(name: string, now = Date.now()): Life {
  const trimmed = name.trim().slice(0, 48);
  if (!trimmed) {
    throw new Error("A life needs a name.");
  }
  return {
    id:
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `life-${now}`,
    name: trimmed,
    enteredAt: now,
  };
}

export function formatEntered(enteredAt: number): string {
  return new Intl.DateTimeFormat("en", {
    year: "numeric",
    month: "short",
    day: "numeric",
  }).format(new Date(enteredAt));
}
