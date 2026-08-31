import { describe, expect, it } from "vitest";
import {
  hashName,
  parsePerson,
  personEquals,
  sigilPoints,
  describePerson,
} from "./person";

describe("parsePerson", () => {
  it("accepts a complete person", () => {
    const person = parsePerson({
      name: " Amina ",
      pace: "spacious",
      gravity: "create",
      climate: "dusk",
      grain: "warm",
      arrivedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(person).toMatchObject({
      name: "Amina",
      pace: "spacious",
      gravity: "create",
      climate: "dusk",
      grain: "warm",
    });
  });

  it("rejects incomplete or invalid shapes", () => {
    expect(parsePerson(null)).toBeNull();
    expect(parsePerson({ name: "Amina" })).toBeNull();
    expect(
      parsePerson({
        name: "",
        pace: "spacious",
        gravity: "create",
        climate: "dusk",
        grain: "warm",
      }),
    ).toBeNull();
    expect(
      parsePerson({
        name: "Amina",
        pace: "fast",
        gravity: "create",
        climate: "dusk",
        grain: "warm",
      }),
    ).toBeNull();
  });
});

describe("sigil and hash", () => {
  it("is stable for a name and different across names", () => {
    expect(hashName("Amina")).toBe(hashName("amina"));
    expect(hashName("Amina")).not.toBe(hashName("Kenji"));
    expect(sigilPoints("Amina")).toHaveLength(8);
    expect(sigilPoints("Amina")).toEqual(sigilPoints("Amina"));
  });
});

describe("describePerson", () => {
  it("renders a human summary", () => {
    const line = describePerson({
      name: "Kenji",
      pace: "dense",
      gravity: "direct",
      climate: "night",
      grain: "sharp",
      arrivedAt: "2026-01-01T00:00:00.000Z",
    });
    expect(line).toContain("Kenji");
    expect(line).toContain("night");
    expect(line).toContain("everything in reach");
  });
});

describe("personEquals", () => {
  it("compares identity fields and ignores nothing essential", () => {
    const a = parsePerson({
      name: "Noor",
      pace: "balanced",
      gravity: "learn",
      climate: "dawn",
      grain: "soft",
      arrivedAt: "a",
    });
    const b = parsePerson({
      name: "Noor",
      pace: "balanced",
      gravity: "learn",
      climate: "dawn",
      grain: "soft",
      arrivedAt: "b",
    });
    expect(personEquals(a, b)).toBe(true);
    expect(personEquals(a, a ? { ...a, climate: "night" } : null)).toBe(false);
  });
});
