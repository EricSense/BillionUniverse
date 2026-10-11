import { describe, expect, it } from "vitest";
import { BILLION, NAME, THESIS, createLife, parseLife } from "../lib/universe";

describe("Billion Universe", () => {
  it("is one universe at billion scale", () => {
    expect(NAME).toBe("BillionUniverse");
    expect(BILLION).toBe(1_000_000_000);
    expect(THESIS.line).toBe("The universe a billion lives share.");
  });

  it("refuses to be an engine", () => {
    expect(THESIS.against.toLowerCase()).toContain("not a kit");
    expect(THESIS.body.toLowerCase()).toContain("you live here");
  });

  it("creates a named life", () => {
    const life = createLife("  Ada  ", 1_700_000_000_000);
    expect(life.name).toBe("Ada");
    expect(life.enteredAt).toBe(1_700_000_000_000);
    expect(life.id.length).toBeGreaterThan(4);
  });

  it("rejects an empty name", () => {
    expect(() => createLife("   ")).toThrow(/name/);
  });

  it("parses and rejects bad storage", () => {
    const life = createLife("Kai", 100);
    expect(parseLife(JSON.stringify(life))?.name).toBe("Kai");
    expect(parseLife("nope")).toBeNull();
    expect(parseLife(JSON.stringify({ id: "x", name: "", enteredAt: 1 }))).toBeNull();
  });
});
