import { simulateCapture } from "./capture";
import { processCapture } from "./process";
import { synthesize } from "./synth";
import { validateUniverse, type ValidationResult } from "./validate";
import type { RawCapture, Universe, Vertical } from "../schema";

export { synthesize } from "./synth";
export { simulateCapture, DEFAULT_RIG } from "./capture";
export { processCapture } from "./process";
export { validateUniverse } from "./validate";

export type PipelineResult = {
  raw: RawCapture;
  universe: Universe;
  validation: ValidationResult;
};

/** Full loop: scene → walkthrough → UB-01 bundle → QA. */
export function runPipeline(seed: number, vertical?: Vertical): PipelineResult {
  const scene = synthesize(seed, vertical);
  const raw = simulateCapture(scene);
  const universe = processCapture(raw);
  const validation = validateUniverse(universe);
  return { raw, universe, validation };
}

export const PIPELINE_STAGES = [
  {
    id: "ingest",
    name: "Ingest",
    hours: "0–1",
    detail:
      "Copy SSD, verify hashes, parse LiDAR packets, RGB, stereo, IMU into a time-aligned bag. Drop frames with sync error > 3 ms.",
  },
  {
    id: "slam",
    name: "SLAM / mapping",
    hours: "1–4",
    detail:
      "Tightly couple Mid-360 + IMU. Loop-close on AprilTags at aisle ends. Export metric trajectory and a first point cloud.",
  },
  {
    id: "reconstruct",
    name: "Reconstruct",
    hours: "4–8",
    detail:
      "Fuse LiDAR + stereo into LAZ + mesh. Build 5 cm occupancy at 0.15 / 1.2 / 2.0 m heights for robot footprints.",
  },
  {
    id: "segment",
    name: "Segment",
    hours: "8–14",
    detail:
      "Instance-segment racks, pallets, docks, people, movers. Human QA on a 4% slice. Write objects.jsonl.",
  },
  {
    id: "physics",
    name: "Physics annotate",
    hours: "14–18",
    detail:
      "Class → material / mass / friction / movable. Infer support and containment. Layout graph: aisles, docks, staging.",
  },
  {
    id: "package",
    name: "QA + package",
    hours: "18–24",
    detail:
      "Validate UB-01, strip site PII to metro, encrypt, ship. Buyer gets the bundle and a catalog card the same day.",
  },
] as const;
