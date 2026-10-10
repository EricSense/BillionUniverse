import { describe, expect, it } from "vitest";
import { FLEET, fleetCounts, kitTotal, PRIMARY } from "../lib/nodes";
import { sample } from "../lib/telemetry";

describe("fleet", () => {
  it("starts with a live primary yard", () => {
    expect(PRIMARY.id).toBe("N-01");
    expect(PRIMARY.status).toBe("online");
    expect(fleetCounts().online).toBeGreaterThan(0);
    expect(FLEET.map((n) => n.id)).toHaveLength(6);
  });

  it("keeps Node 1 hardware under $8k", () => {
    expect(kitTotal()).toBeLessThan(8000);
    expect(kitTotal()).toBeGreaterThan(5000);
  });
});

describe("telemetry", () => {
  it("is silent on planned sites", () => {
    const planned = FLEET.find((n) => n.status === "planned")!;
    const t = sample(planned, 1_700_000_000_000);
    expect(t.link_pct).toBe(0);
    expect(t.people).toBe(0);
  });

  it("keeps an online node on the link", () => {
    const t = sample(PRIMARY, 1_700_000_000_000);
    expect(t.link_pct).toBeGreaterThan(90);
    expect(t.power_kw).toBeGreaterThan(0);
  });
});
