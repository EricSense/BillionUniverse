import { describe, expect, it } from "vitest";
import { DREAM, ENGINES } from "../lib/dream";

describe("the dream", () => {
  it("is not an engine on the existing stack", () => {
    expect(ENGINES).toContain("chips");
    expect(ENGINES).toContain("superintelligence");
    expect(ENGINES.join(" ")).not.toMatch(/billion universe/i);
  });

  it("names lives, not users, and includes the machine", () => {
    const text = DREAM.body.join(" ");
    expect(text).toMatch(/billion lives/);
    expect(text).toMatch(/not a product/);
    expect(text.toLowerCase()).toMatch(/machine/);
  });
});
