import { describe, expect, it } from "vitest";
import { BRAND, COLORS, LAYERS, NAV } from "../lib/brand";

describe("BillionUniverse brand", () => {
  it("is one word", () => {
    expect(BRAND.name).toBe("BillionUniverse");
    expect(BRAND.name.includes(" ")).toBe(false);
  });

  it("uses the lockup palette", () => {
    expect(BRAND.paper).toBe("#FFFFFF");
    expect(BRAND.core).toBe("#1B56C9");
    expect(BRAND.ringInner).toBe("#2F74E0");
    expect(BRAND.ringMid).toBe("#4A96EE");
    expect(BRAND.ringOuter).toBe("#6BB7F6");
    expect(BRAND.ink).toBe("#2A2A2A");
  });

  it("exposes sampled colors for the system page", () => {
    expect(COLORS.map((c) => c.hex)).toContain(BRAND.core);
    expect(COLORS.map((c) => c.name)).toContain("Paper");
  });

  it("reads the mark as four layers", () => {
    expect(LAYERS.map((layer) => layer.name)).toEqual(["Core", "Orbit", "Field", "Universe"]);
  });

  it("navigates the brand, not a product", () => {
    expect(NAV.map((item) => item.href)).toEqual(["/", "/system", "/scale"]);
  });
});
