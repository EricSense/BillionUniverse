import { centroid, clamp, dist2, round, vec3 } from "../math";
import { AFFORDANCES, physicsFor } from "../physics";
import {
  FORMAT,
  FORMAT_VERSION,
  universeId,
  type ObjectClass,
  type ObjectInstance,
  type RawCapture,
  type Relation,
  type Traversability,
  type Universe,
  type Zone,
} from "../schema";

type Cluster = {
  class: ObjectClass;
  centers: [number, number, number][];
  sizes: [number, number, number][];
  yaws: number[];
};

function mergeObservations(raw: RawCapture): Cluster[] {
  const clusters: Cluster[] = [];
  for (const frame of raw.frames) {
    for (const ob of frame.observations) {
      const hit = clusters.find(
        (c) => c.class === ob.class && dist2(centroid(c.centers), ob.center) < 0.85 ** 2,
      );
      if (hit) {
        hit.centers.push(ob.center);
        hit.sizes.push(ob.size);
        hit.yaws.push(ob.yaw);
      } else {
        clusters.push({
          class: ob.class,
          centers: [ob.center],
          sizes: [ob.size],
          yaws: [ob.yaw],
        });
      }
    }
  }
  return clusters.filter((c) => c.centers.length >= 2);
}

function toObject(cluster: Cluster, index: number, bounds: { min: [number, number, number]; max: [number, number, number] }): ObjectInstance {
  const c = centroid(cluster.centers);
  const size = centroid(cluster.sizes);
  const yaw = cluster.yaws[0] ?? 0;
  const votes = cluster.centers.length;
  const confidence = Math.min(0.99, 0.55 + Math.log10(votes + 1) * 0.25);
  const hx = size[0] / 2;
  const hy = size[1] / 2;
  const minX = clamp(c[0] - hx, bounds.min[0], bounds.max[0] - 0.05);
  const minY = clamp(c[1] - hy, bounds.min[1], bounds.max[1] - 0.05);
  const maxX = clamp(c[0] + hx, minX + 0.05, bounds.max[0]);
  const maxY = clamp(c[1] + hy, minY + 0.05, bounds.max[1]);
  const minZ = clamp(c[2], bounds.min[2], bounds.max[2] - 0.05);
  const maxZ = clamp(c[2] + size[2], minZ + 0.05, bounds.max[2]);
  return {
    id: `obj_${cluster.class}_${index}`,
    class: cluster.class,
    label: labelFor(cluster.class, index),
    aabb: {
      min: vec3(minX, minY, minZ),
      max: vec3(maxX, maxY, maxZ),
    },
    yaw,
    zone_id: null,
    affordances: AFFORDANCES[cluster.class],
    physics: physicsFor(cluster.class),
    confidence: round(confidence, 3),
  };
}

function labelFor(cls: ObjectClass, index: number): string {
  const names: Record<ObjectClass, string> = {
    pallet_rack: "Pallet rack",
    pallet: "Pallet",
    carton: "Carton",
    bin: "Bin",
    forklift: "Forklift",
    pallet_jack: "Pallet jack",
    conveyor: "Conveyor",
    dock_door: "Dock door",
    column: "Column",
    wall: "Wall",
    door: "Door",
    shelf: "Shelf",
    display: "Display",
    counter: "Counter",
    fixture: "Fixture",
    cart: "Cart",
    vehicle: "Vehicle",
    person: "Person",
    safety_barrier: "Safety barrier",
    signage: "Signage",
    lighting: "Lighting",
    hvac: "HVAC",
    floor_marking: "Floor marking",
    debris: "Debris",
    unknown: "Unknown",
  };
  return `${names[cls]} ${index + 1}`;
}

function occupancy(raw: RawCapture): Traversability {
  const maxX = raw.site.bounds.max[0];
  const maxY = raw.site.bounds.max[1];
  const resolution = 0.5;
  const width = Math.max(8, Math.ceil(maxX / resolution));
  const height = Math.max(8, Math.ceil(maxY / resolution));
  const grid = Array.from({ length: height }, () => Array.from({ length: width }, () => 0.15));

  for (const frame of raw.frames) {
    const cx = Math.floor(frame.pose.x / resolution);
    const cy = Math.floor(frame.pose.y / resolution);
    for (let dy = -1; dy <= 1; dy++) {
      for (let dx = -1; dx <= 1; dx++) {
        const x = cx + dx;
        const y = cy + dy;
        if (y >= 0 && y < height && x >= 0 && x < width) {
          grid[y]![x] = 0;
        }
      }
    }
    for (const hit of frame.hits) {
      const x = Math.floor(hit[0] / resolution);
      const y = Math.floor(hit[1] / resolution);
      if (y >= 0 && y < height && x >= 0 && x < width) {
        grid[y]![x] = 1;
      }
    }
  }

  return {
    resolution_m: resolution,
    layers_m: [0.15, 1.2, 2.0],
    grid,
    origin: [0, 0],
    width,
    height,
  };
}

function inferZones(raw: RawCapture, objects: ObjectInstance[]): Zone[] {
  const zones: Zone[] = [];
  const racks = objects.filter((o) => o.class === "pallet_rack" || o.class === "shelf");
  if (racks.length >= 4) {
    const ys = racks.map((r) => (r.aabb.min[1] + r.aabb.max[1]) / 2).sort((a, b) => a - b);
    const groups: number[][] = [];
    for (const y of ys) {
      const g = groups.find((gg) => Math.abs(gg[0]! - y) < 1.4);
      if (g) g.push(y);
      else groups.push([y]);
    }
    groups.forEach((g, i) => {
      const y = g.reduce((s, v) => s + v, 0) / g.length;
      const xs = racks.map((r) => r.aabb.min[0]);
      const xe = racks.map((r) => r.aabb.max[0]);
      const x0 = Math.min(...xs);
      const x1 = Math.max(...xe);
      zones.push({
        id: `zone_aisle_${i}`,
        type: "aisle",
        label: `Aisle ${String.fromCharCode(65 + i)}`,
        polygon: [
          [round(x0), round(y - 1.4)],
          [round(x1), round(y - 1.4)],
          [round(x1), round(y + 1.4)],
          [round(x0), round(y + 1.4)],
        ],
        height_m: 6,
      });
    });
  }

  zones.push({
    id: "zone_dock",
    type: raw.site.vertical === "warehouse" ? "dock" : "work_area",
    label: raw.site.vertical === "warehouse" ? "Dock / inbound" : "Primary floor",
    polygon: [
      [0, 1],
      [Math.min(14, raw.site.bounds.max[0]), 1],
      [Math.min(14, raw.site.bounds.max[0]), raw.site.bounds.max[1] - 1],
      [0, raw.site.bounds.max[1] - 1],
    ],
    height_m: raw.site.ceiling_m,
  });

  if (raw.site.vertical === "retail") {
    zones.push({
      id: "zone_sales",
      type: "sales_floor",
      label: "Sales floor",
      polygon: [
        [6, 1],
        [raw.site.bounds.max[0] - 1, 1],
        [raw.site.bounds.max[0] - 1, raw.site.bounds.max[1] - 1],
        [6, raw.site.bounds.max[1] - 1],
      ],
      height_m: raw.site.ceiling_m,
    });
  }

  return zones;
}

function assignZones(objects: ObjectInstance[], zones: Zone[]): ObjectInstance[] {
  return objects.map((o) => {
    const cx = (o.aabb.min[0] + o.aabb.max[0]) / 2;
    const cy = (o.aabb.min[1] + o.aabb.max[1]) / 2;
    const zone = zones.find((z) => {
      const xs = z.polygon.map((p) => p[0]);
      const ys = z.polygon.map((p) => p[1]);
      const minX = Math.min(...xs);
      const maxX = Math.max(...xs);
      const minY = Math.min(...ys);
      const maxY = Math.max(...ys);
      return cx >= minX && cx <= maxX && cy >= minY && cy <= maxY;
    });
    return { ...o, zone_id: zone?.id ?? null };
  });
}

function relations(objects: ObjectInstance[]): Relation[] {
  const rel: Relation[] = [];
  const racks = objects.filter((o) => o.class === "pallet_rack" || o.class === "shelf");
  const pallets = objects.filter((o) => o.class === "pallet" || o.class === "carton");
  for (const p of pallets) {
    const pc = centroid([p.aabb.min, p.aabb.max]);
    let best: ObjectInstance | null = null;
    let bestD = 1.6;
    for (const r of racks) {
      const rc = centroid([r.aabb.min, r.aabb.max]);
      const d = Math.hypot(pc[0] - rc[0], pc[1] - rc[1]);
      if (d < bestD) {
        bestD = d;
        best = r;
      }
    }
    if (best) {
      rel.push({ type: "on", a: p.id, b: best.id });
      rel.push({ type: "supports", a: best.id, b: p.id });
    }
  }
  const docks = objects.filter((o) => o.class === "dock_door");
  const forks = objects.filter((o) => o.class === "forklift");
  if (docks[0] && forks[0]) rel.push({ type: "feeds", a: docks[0].id, b: forks[0].id });
  return rel;
}

function classHist(objects: ObjectInstance[]): Record<string, number> {
  const h: Record<string, number> = {};
  for (const o of objects) h[o.class] = (h[o.class] ?? 0) + 1;
  return h;
}

function qa(objects: ObjectInstance[], trav: Traversability, raw: RawCapture) {
  const notes: string[] = [];
  const cells = trav.grid.flat();
  const known = cells.filter((v) => v !== 0.15).length;
  const coverage = round(known / Math.max(1, cells.length), 3);
  const mean =
    objects.reduce((s, o) => s + o.confidence, 0) / Math.max(1, objects.length);
  if (objects.length < 8) notes.push("Low object count — recapture recommended");
  if (coverage < 0.2) notes.push("Sparse occupancy coverage");
  if (raw.site.vertical === "warehouse" && !objects.some((o) => o.class === "pallet_rack")) {
    notes.push("No racks recovered");
  }
  const status = notes.some((n) => n.startsWith("No racks"))
    ? "fail"
    : notes.length
      ? "warn"
      : "pass";
  return {
    status: status as "pass" | "warn" | "fail",
    coverage,
    object_count: objects.length,
    mean_confidence: round(mean, 3),
    notes,
  };
}

/** Turn a raw Walker capture into a Universe Bundle (UB-01). */
export function processCapture(raw: RawCapture, processedAt?: string): Universe {
  const clusters = mergeObservations(raw);
  let objects = clusters.map((c, i) => toObject(c, i, raw.site.bounds));
  const zones = inferZones(raw, objects);
  objects = assignZones(objects, zones);
  const trav = occupancy(raw);
  const rel = relations(objects);
  const captured = new Date(raw.captured_at);
  const processed = processedAt ?? new Date(captured.getTime() + 14 * 3600 * 1000).toISOString();
  const id = universeId(raw.site.vertical, raw.seed);

  return {
    format: FORMAT,
    version: FORMAT_VERSION,
    universe_id: id,
    captured_at: raw.captured_at,
    processed_at: processed,
    sla_hours: 24,
    site: raw.site,
    rig: raw.rig,
    assets: {
      pointcloud: `geometry/${id}.laz`,
      mesh: `geometry/${id}.glb`,
      occupancy: `geometry/${id}_occ.npy`,
      rgb_dir: `imagery/rgb/`,
      depth_dir: `imagery/depth/`,
      poses: `imagery/poses.jsonl`,
      calibration: `calibration/extrinsics.yaml`,
    },
    layout: { floors: 1, zones },
    objects,
    relations: rel,
    traversability: trav,
    stats: {
      object_count: objects.length,
      zone_count: zones.length,
      movable_count: objects.filter((o) => o.physics.movable).length,
      static_count: objects.filter((o) => !o.physics.movable).length,
      classes: classHist(objects),
    },
    qa: qa(objects, trav, raw),
  };
}
