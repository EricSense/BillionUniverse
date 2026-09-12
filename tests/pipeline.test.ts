import { describe, expect, it } from "vitest";
import { UniverseSchema } from "../lib/schema";
import { runPipeline, synthesize, simulateCapture, processCapture, validateUniverse } from "../lib/pipeline";
import { physicsFor } from "../lib/physics";
import { kitTotal, WALKER_V0, ninetyDayTotal } from "../lib/kit";

describe("universe bundle schema", () => {
  it("accepts a processed warehouse", () => {
    const { universe } = runPipeline(1, "warehouse");
    const parsed = UniverseSchema.parse(universe);
    expect(parsed.format).toBe("ub-01");
    expect(parsed.sla_hours).toBe(24);
    expect(parsed.site.privacy).toBe("coarse_metro");
  });
});

describe("capture → process pipeline", () => {
  it("is deterministic for a seed", () => {
    const a = runPipeline(4, "warehouse").universe;
    const b = runPipeline(4, "warehouse").universe;
    expect(a.stats.object_count).toBe(b.stats.object_count);
    expect(a.universe_id).toBe("univ_wh_0004");
    expect(a.objects[0]?.aabb).toEqual(b.objects[0]?.aabb);
  });

  it("recovers racks, pallets, and aisle zones from a walkthrough", () => {
    const { universe, validation } = runPipeline(1, "warehouse");
    expect(validation.ok).toBe(true);
    expect(universe.stats.classes.pallet_rack).toBeGreaterThan(8);
    expect(universe.layout.zones.some((z) => z.type === "aisle")).toBe(true);
    expect(universe.objects.every((o) => o.physics.material)).toBe(true);
    expect(universe.qa.status).not.toBe("fail");
  });

  it("marks pallets movable and racks static", () => {
    expect(physicsFor("pallet").movable).toBe(true);
    expect(physicsFor("pallet_rack").movable).toBe(false);
    expect(physicsFor("pallet_rack").body).toBe("static");
    const { universe } = runPipeline(2, "warehouse");
    const rack = universe.objects.find((o) => o.class === "pallet_rack");
    const pal = universe.objects.find((o) => o.class === "pallet");
    expect(rack?.physics.movable).toBe(false);
    expect(pal?.physics.movable).toBe(true);
  });

  it("validates retail and construction seeds", () => {
    const retail = runPipeline(7);
    expect(retail.universe.site.vertical).toBe("retail");
    expect(validateUniverse(retail.universe).ok).toBe(true);
    const site = synthesize(15);
    expect(site.site.vertical).toBe("construction");
    const raw = simulateCapture(site);
    const u = processCapture(raw);
    expect(u.universe_id).toBe("univ_cn_0015");
    expect(u.objects.some((o) => o.class === "debris" || o.class === "column")).toBe(true);
  });

  it("fails validation when object list is empty", () => {
    const { universe } = runPipeline(1, "warehouse");
    const broken = { ...universe, objects: [], stats: { ...universe.stats, object_count: 0 } };
    const v = validateUniverse(broken);
    expect(v.ok).toBe(false);
    expect(v.issues.some((i) => i.code === "objects" || i.code === "racks")).toBe(true);
  });
});

describe("kit economics", () => {
  it("keeps the prove-it kit under $5k", () => {
    expect(kitTotal(WALKER_V0)).toBeLessThan(5000);
    expect(kitTotal(WALKER_V0)).toBeGreaterThan(3000);
  });

  it("keeps the first 90 days capital-light vs chips", () => {
    expect(ninetyDayTotal()).toBeLessThan(25000);
  });
});
