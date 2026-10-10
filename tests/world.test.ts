import { describe, expect, it } from "vitest";
import { plotFromName, hash32 } from "../lib/hash";
import { makePerson } from "../lib/person";
import { DISTRICTS, getDistrict } from "../lib/world";

describe("plots", () => {
  it("assigns the same plot for the same name", () => {
    const a = plotFromName("Amina Diallo");
    const b = plotFromName("Amina Diallo");
    expect(a).toEqual(b);
    expect(a.x).toBeGreaterThan(0);
    expect(a.x).toBeLessThan(1);
  });

  it("places different names on different plots", () => {
    const a = plotFromName("Amina Diallo");
    const b = plotFromName("Kenji Mori");
    expect(a).not.toEqual(b);
  });

  it("is case-insensitive", () => {
    expect(plotFromName("Noor")).toEqual(plotFromName("noor"));
    expect(hash32("x")).toBeGreaterThan(0);
  });
});

describe("claim", () => {
  it("refuses an empty name", () => {
    expect(() => makePerson({ name: "  ", city: "Dakar", making: "records" })).toThrow();
  });

  it("fills a room from a name", () => {
    const p = makePerson({ name: "Mateo Cruz", city: "Medellín", making: "a ledger" });
    expect(p.name).toBe("Mateo Cruz");
    expect(p.x).toEqual(plotFromName("Mateo Cruz").x);
  });
});

describe("districts", () => {
  it("has four walkable public places", () => {
    expect(DISTRICTS.map((d) => d.slug).sort()).toEqual(
      ["commons", "harbor", "library", "workshop"].sort(),
    );
    expect(getDistrict("library")?.name).toBe("The Library");
    expect(getDistrict("mars")).toBeUndefined();
  });
});
