import { plotFromName } from "./hash";

export const PERSON_KEY = "bu.person.v1";

export type Person = {
  name: string;
  city: string;
  making: string;
  x: number;
  y: number;
  claimedAt: string;
};

export function makePerson(input: { name: string; city: string; making: string }): Person {
  const name = input.name.trim();
  const city = input.city.trim();
  const making = input.making.trim();
  if (!name) throw new Error("A universe needs a name to stand in.");
  const plot = plotFromName(name);
  return {
    name,
    city: city || "unplaced",
    making: making || "still arriving",
    x: plot.x,
    y: plot.y,
    claimedAt: new Date().toISOString(),
  };
}

export function readPerson(): Person | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(PERSON_KEY);
    if (!raw) return null;
    const p = JSON.parse(raw) as Person;
    if (!p.name || typeof p.x !== "number") return null;
    return p;
  } catch {
    return null;
  }
}

export function writePerson(person: Person): void {
  window.localStorage.setItem(PERSON_KEY, JSON.stringify(person));
}

export function clearPerson(): void {
  window.localStorage.removeItem(PERSON_KEY);
}

export function coordLabel(x: number, y: number): string {
  const lat = (90 - y * 180).toFixed(1);
  const lng = (x * 360 - 180).toFixed(1);
  const ns = Number(lat) >= 0 ? "N" : "S";
  const ew = Number(lng) >= 0 ? "E" : "W";
  return `${Math.abs(Number(lat)).toFixed(1)}°${ns} ${Math.abs(Number(lng)).toFixed(1)}°${ew}`;
}
