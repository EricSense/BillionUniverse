import { z } from "zod";

/**
 * Universe Bundle UB-01
 *
 * Coordinate frame (ROS-like, indoor map):
 *   - Units: meters
 *   - X: building long axis
 *   - Y: building short axis
 *   - Z: up
 *   - Origin: southwest corner of the captured AABB, Z = 0 at finished floor
 *
 * This is the training-ready package a robotics or world-model buyer receives.
 * Geometry blobs (LAZ / GLB / occupancy npy) are referenced by path; the JSON
 * is the structured layer — objects, physics, layout, relations.
 */

export const FORMAT = "ub-01" as const;
export const FORMAT_VERSION = "0.1.0" as const;

export const VerticalSchema = z.enum([
  "warehouse",
  "retail",
  "residential",
  "construction",
  "street",
  "industrial",
]);
export type Vertical = z.infer<typeof VerticalSchema>;

export const ObjectClassSchema = z.enum([
  "pallet_rack",
  "pallet",
  "carton",
  "bin",
  "forklift",
  "pallet_jack",
  "conveyor",
  "dock_door",
  "column",
  "wall",
  "door",
  "shelf",
  "display",
  "counter",
  "fixture",
  "cart",
  "vehicle",
  "person",
  "safety_barrier",
  "signage",
  "lighting",
  "hvac",
  "floor_marking",
  "debris",
  "unknown",
]);
export type ObjectClass = z.infer<typeof ObjectClassSchema>;

export const ZoneTypeSchema = z.enum([
  "aisle",
  "staging",
  "dock",
  "storage",
  "office",
  "pick_face",
  "drive_lane",
  "sales_floor",
  "backroom",
  "checkout",
  "work_area",
  "void",
]);
export type ZoneType = z.infer<typeof ZoneTypeSchema>;

export const Vec3Schema = z.tuple([z.number(), z.number(), z.number()]);

export const AabbSchema = z.object({
  min: Vec3Schema,
  max: Vec3Schema,
});
export type Aabb = z.infer<typeof AabbSchema>;

export const PhysicsSchema = z.object({
  body: z.enum(["static", "dynamic", "kinematic"]),
  mass_kg: z.number().nullable(),
  material: z.string(),
  friction: z.number().min(0).max(2),
  restitution: z.number().min(0).max(1),
  support_surface: z.boolean(),
  traversable: z.boolean(),
  movable: z.boolean(),
});
export type Physics = z.infer<typeof PhysicsSchema>;

export const ObjectInstanceSchema = z.object({
  id: z.string(),
  class: ObjectClassSchema,
  label: z.string(),
  aabb: AabbSchema,
  yaw: z.number(),
  zone_id: z.string().nullable(),
  affordances: z.array(z.string()),
  physics: PhysicsSchema,
  confidence: z.number().min(0).max(1),
});
export type ObjectInstance = z.infer<typeof ObjectInstanceSchema>;

export const ZoneSchema = z.object({
  id: z.string(),
  type: ZoneTypeSchema,
  label: z.string(),
  polygon: z.array(z.tuple([z.number(), z.number()])).min(3),
  height_m: z.number(),
});
export type Zone = z.infer<typeof ZoneSchema>;

export const RelationSchema = z.object({
  type: z.enum([
    "contains",
    "adjacent",
    "on",
    "supports",
    "blocks",
    "faces",
    "feeds",
  ]),
  a: z.string(),
  b: z.string(),
});
export type Relation = z.infer<typeof RelationSchema>;

export const SiteSchema = z.object({
  name: z.string(),
  vertical: VerticalSchema,
  metro: z.string(),
  region: z.string(),
  area_m2: z.number().positive(),
  ceiling_m: z.number().positive(),
  bounds: AabbSchema,
  privacy: z.literal("coarse_metro"),
});
export type Site = z.infer<typeof SiteSchema>;

export const RigSchema = z.object({
  kit_id: z.string(),
  kit_name: z.string(),
  sensors: z.array(
    z.object({
      id: z.string(),
      type: z.enum(["lidar", "rgb", "stereo_depth", "imu", "gnss", "mic"]),
      model: z.string(),
    }),
  ),
  operator: z.string(),
  duration_min: z.number(),
});
export type Rig = z.infer<typeof RigSchema>;

export const AssetsSchema = z.object({
  pointcloud: z.string(),
  mesh: z.string(),
  occupancy: z.string(),
  rgb_dir: z.string(),
  depth_dir: z.string(),
  poses: z.string(),
  calibration: z.string(),
});
export type Assets = z.infer<typeof AssetsSchema>;

export const TraversabilitySchema = z.object({
  resolution_m: z.number(),
  layers_m: z.array(z.number()),
  /** Row-major occupancy, 0 free / 1 occupied / 0.5 unknown. Downsampled for the bundle JSON. */
  grid: z.array(z.array(z.number())),
  origin: z.tuple([z.number(), z.number()]),
  width: z.number(),
  height: z.number(),
});
export type Traversability = z.infer<typeof TraversabilitySchema>;

export const QaSchema = z.object({
  status: z.enum(["pass", "warn", "fail"]),
  coverage: z.number(),
  object_count: z.number(),
  mean_confidence: z.number(),
  notes: z.array(z.string()),
});
export type Qa = z.infer<typeof QaSchema>;

export const UniverseSchema = z.object({
  format: z.literal(FORMAT),
  version: z.literal(FORMAT_VERSION),
  universe_id: z.string(),
  captured_at: z.string(),
  processed_at: z.string(),
  sla_hours: z.literal(24),
  site: SiteSchema,
  rig: RigSchema,
  assets: AssetsSchema,
  layout: z.object({
    floors: z.number().int().positive(),
    zones: z.array(ZoneSchema),
  }),
  objects: z.array(ObjectInstanceSchema),
  relations: z.array(RelationSchema),
  traversability: TraversabilitySchema,
  stats: z.object({
    object_count: z.number(),
    zone_count: z.number(),
    movable_count: z.number(),
    static_count: z.number(),
    classes: z.record(z.number()),
  }),
  qa: QaSchema,
});
export type Universe = z.infer<typeof UniverseSchema>;

export const RawFrameSchema = z.object({
  t: z.number(),
  pose: z.object({
    x: z.number(),
    y: z.number(),
    z: z.number(),
    yaw: z.number(),
  }),
  observations: z.array(
    z.object({
      class: ObjectClassSchema,
      center: Vec3Schema,
      size: Vec3Schema,
      yaw: z.number(),
      gt_id: z.string().optional(),
    }),
  ),
  hits: z.array(Vec3Schema),
});
export type RawFrame = z.infer<typeof RawFrameSchema>;

export const RawCaptureSchema = z.object({
  capture_id: z.string(),
  seed: z.number(),
  captured_at: z.string(),
  site: SiteSchema,
  rig: RigSchema,
  frames: z.array(RawFrameSchema),
  /** Ground-truth object ids, used only in synth evaluation — stripped on package. */
  _gt_object_count: z.number().optional(),
});
export type RawCapture = z.infer<typeof RawCaptureSchema>;

export function universeId(vertical: Vertical, seed: number): string {
  const prefix =
    vertical === "warehouse"
      ? "wh"
      : vertical === "retail"
        ? "rt"
        : vertical === "construction"
          ? "cn"
          : vertical.slice(0, 2);
  return `univ_${prefix}_${String(seed).padStart(4, "0")}`;
}
