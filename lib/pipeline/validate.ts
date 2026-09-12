import { UniverseSchema, type Universe } from "../schema";

export type ValidationIssue = {
  level: "error" | "warn";
  code: string;
  message: string;
};

export type ValidationResult = {
  ok: boolean;
  issues: ValidationIssue[];
  universe?: Universe;
};

export function validateUniverse(data: unknown): ValidationResult {
  const parsed = UniverseSchema.safeParse(data);
  const issues: ValidationIssue[] = [];
  if (!parsed.success) {
    for (const iss of parsed.error.issues.slice(0, 12)) {
      issues.push({
        level: "error",
        code: "schema",
        message: `${iss.path.join(".")}: ${iss.message}`,
      });
    }
    return { ok: false, issues };
  }
  const u = parsed.data;
  if (u.objects.length < 8) {
    issues.push({
      level: "error",
      code: "objects",
      message: `Need ≥ 8 instances, got ${u.objects.length}`,
    });
  }
  if (u.site.vertical === "warehouse") {
    const racks = u.objects.filter((o) => o.class === "pallet_rack").length;
    const aisles = u.layout.zones.filter((z) => z.type === "aisle").length;
    if (racks < 4) {
      issues.push({
        level: "error",
        code: "racks",
        message: `Warehouse should recover racks, got ${racks}`,
      });
    }
    if (aisles < 1) {
      issues.push({
        level: "warn",
        code: "aisles",
        message: "No aisle zones inferred",
      });
    }
  }
  const missingPhysics = u.objects.filter((o) => !o.physics.material).length;
  if (missingPhysics) {
    issues.push({
      level: "error",
      code: "physics",
      message: `${missingPhysics} objects missing material`,
    });
  }
  const max = u.site.bounds.max;
  const oob = u.objects.filter(
    (o) =>
      o.aabb.min[0] < -2 ||
      o.aabb.min[1] < -2 ||
      o.aabb.max[0] > max[0] + 2 ||
      o.aabb.max[1] > max[1] + 2,
  );
  if (oob.length) {
    issues.push({
      level: "warn",
      code: "bounds",
      message: `${oob.length} objects sit outside site bounds`,
    });
  }
  if (u.qa.coverage < 0.12) {
    issues.push({
      level: "warn",
      code: "coverage",
      message: `Occupancy coverage ${u.qa.coverage} is thin`,
    });
  }
  const errors = issues.filter((i) => i.level === "error");
  return { ok: errors.length === 0, issues, universe: u };
}
