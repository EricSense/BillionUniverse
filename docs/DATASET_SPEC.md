# Universe Bundle UB-01

Training-ready package for one captured space. Source of truth: `lib/schema.ts`.

## Frame

- Meters, right-handed
- X long axis, Y short axis, Z up
- Origin: southwest corner of the captured AABB, Z = 0 at finished floor
- Yaw about Z, radians, 0 = +X

## Layout

```
universe/
  universe.json
  objects.jsonl
  relations.jsonl
  geometry/cloud.laz
  geometry/mesh.glb
  geometry/occupancy.npy
  imagery/rgb/
  imagery/depth/
  imagery/poses.jsonl
  calibration/extrinsics.yaml
  qa.json
```

Small sites embed layout, objects, relations, a downsampled occupancy grid, and QA in `universe.json`.

## Instance

`id`, `class`, `label`, `aabb`, `yaw`, `zone_id`, `affordances[]`, `physics`, `confidence`.

Physics: `body` (static | dynamic | kinematic), `mass_kg`, `material`, `friction`, `restitution`, `support_surface`, `traversable`, `movable`.

## Privacy

Catalog location is coarse metro only (`privacy: "coarse_metro"`).

## SLA

`sla_hours: 24`. QA `pass | warn | fail`. Fail does not ship.
