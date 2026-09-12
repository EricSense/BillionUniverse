import { dist2, round, vec3, type Vec3 } from "../math";
import type { GroundScene } from "./synth";
import type { RawCapture, RawFrame, Rig } from "../schema";
import { universeId } from "../schema";

export const DEFAULT_RIG: Rig = {
  kit_id: "bu-walker-v0",
  kit_name: "Walker v0",
  sensors: [
    { id: "lidar_0", type: "lidar", model: "Livox Mid-360" },
    { id: "stereo_0", type: "stereo_depth", model: "ZED 2i" },
    { id: "rgb_l", type: "rgb", model: "OAK-D Pro W" },
    { id: "rgb_r", type: "rgb", model: "OAK-D Pro W" },
    { id: "imu_0", type: "imu", model: "3DM-CV7-AHRS" },
  ],
  operator: "field-01",
  duration_min: 0,
};

function inFov(
  pose: { x: number; y: number; yaw: number },
  p: Vec3,
  range: number,
  fov: number,
): boolean {
  const dx = p[0] - pose.x;
  const dy = p[1] - pose.y;
  const d = Math.hypot(dx, dy);
  if (d < 0.4 || d > range) return false;
  const bearing = Math.atan2(dy, dx);
  let diff = bearing - pose.yaw;
  while (diff > Math.PI) diff -= 2 * Math.PI;
  while (diff < -Math.PI) diff += 2 * Math.PI;
  return Math.abs(diff) < fov / 2;
}

function objectCenter(min: Vec3, max: Vec3): Vec3 {
  return vec3((min[0] + max[0]) / 2, (min[1] + max[1]) / 2, min[2]);
}

function objectSize(min: Vec3, max: Vec3): Vec3 {
  return vec3(max[0] - min[0], max[1] - min[1], max[2] - min[2]);
}

/**
 * Walk a snake through aisles, emitting poses, class observations, and LiDAR hits.
 * This is the synthetic stand-in for a real Walker kit bag.
 */
export function simulateCapture(scene: GroundScene, capturedAt?: string): RawCapture {
  const frames: RawFrame[] = [];
  const { site } = scene;
  const maxX = site.bounds.max[0];
  const step = 1.6;
  let t = 0;
  const path: { x: number; y: number; yaw: number }[] = [];

  const lanes = scene.aisleXs.length ? scene.aisleXs : [site.bounds.max[1] / 2];
  lanes.forEach((y, i) => {
    const start = 2;
    const end = maxX - 2;
    if (i % 2 === 0) {
      for (let x = start; x <= end; x += step) path.push({ x, y, yaw: 0 });
    } else {
      for (let x = end; x >= start; x -= step) path.push({ x, y, yaw: Math.PI });
    }
  });

  // Cross the dock so doors are observed.
  for (let y = 4; y < site.bounds.max[1] - 4; y += 3.2) {
    path.push({ x: 4, y, yaw: Math.PI });
  }

  for (const pose of path) {
    const observations = scene.objects
      .filter((o) => {
        const c = objectCenter(o.aabb.min, o.aabb.max);
        return inFov(pose, c, 14, (110 * Math.PI) / 180);
      })
      .slice(0, 18)
      .map((o) => {
        const c = objectCenter(o.aabb.min, o.aabb.max);
        const s = objectSize(o.aabb.min, o.aabb.max);
        // Sensor noise: a few cm, occasional class drop to unknown is applied in process.
        return {
          class: o.class,
          center: vec3(c[0] + (Math.sin(t * 3 + c[1]) * 0.04), c[1] + (Math.cos(t + c[0]) * 0.04), c[2]),
          size: s,
          yaw: o.yaw,
          gt_id: o.id,
        };
      });

    const hits: Vec3[] = [];
    for (const o of scene.objects) {
      const c = objectCenter(o.aabb.min, o.aabb.max);
      if (dist2(vec3(pose.x, pose.y, 0), c) > 18 * 18) continue;
      if (!inFov(pose, c, 16, Math.PI)) continue;
      const s = objectSize(o.aabb.min, o.aabb.max);
      const samples = o.class === "pallet_rack" || o.class === "wall" ? 6 : 3;
      for (let i = 0; i < samples; i++) {
        const u = (i + 0.5) / samples;
        hits.push(
          vec3(
            o.aabb.min[0] + s[0] * u,
            o.aabb.min[1] + s[1] * (i % 2 === 0 ? 0.15 : 0.85),
            o.aabb.min[2] + Math.min(s[2] * 0.4, 1.6),
          ),
        );
      }
    }

    frames.push({
      t,
      pose: { x: round(pose.x), y: round(pose.y), z: 1.55, yaw: round(pose.yaw, 4) },
      observations,
      hits,
    });
    t += 0.4;
  }

  return {
    capture_id: `cap_${universeId(site.vertical, scene.seed)}`,
    seed: scene.seed,
    captured_at: capturedAt ?? new Date("2026-09-01T14:00:00Z").toISOString(),
    site,
    rig: {
      ...DEFAULT_RIG,
      duration_min: Math.max(12, Math.round(frames.length * 0.4 / 60) + 18),
    },
    frames,
    _gt_object_count: scene.objects.length,
  };
}
