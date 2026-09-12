import { runPipeline } from "./pipeline";
import type { Universe } from "./schema";

/** First-90-days library: 12 warehouses, 2 retail floors, 1 construction deck. */
export const CATALOG_SEEDS: { seed: number; note: string }[] = [
  { seed: 1, note: "Grove City DC — first walk, full racking" },
  { seed: 2, note: "Newark crossdock — short aisles, many doors" },
  { seed: 3, note: "Elk Grove cold chain — higher racks" },
  { seed: 4, note: "Joliet — wide drive lanes" },
  { seed: 5, note: "Fort Worth — mixed pallet density" },
  { seed: 6, note: "Kent parcel — conveyor present" },
  { seed: 8, note: "Hagerstown robotics lab DC" },
  { seed: 9, note: "Lakeland grocery DC" },
  { seed: 10, note: "Allentown iron-gate 2" },
  { seed: 11, note: "Kansas City sort" },
  { seed: 12, note: "Phoenix cinder dock" },
  { seed: 13, note: "Memphis blue rail" },
  { seed: 7, note: "Columbus superfloor — retail gondolas" },
  { seed: 14, note: "Tampa market — front-end + aisles" },
  { seed: 15, note: "Denver frame, level 2 — construction" },
];

let cache: Universe[] | null = null;

export function catalog(): Universe[] {
  if (cache) return cache;
  cache = CATALOG_SEEDS.map((row) => runPipeline(row.seed).universe);
  return cache;
}

export function getUniverse(id: string): Universe | undefined {
  return catalog().find((u) => u.universe_id === id);
}

export function featured(): Universe {
  return catalog()[0]!;
}

export function byVertical() {
  const all = catalog();
  return {
    warehouse: all.filter((u) => u.site.vertical === "warehouse"),
    retail: all.filter((u) => u.site.vertical === "retail"),
    construction: all.filter((u) => u.site.vertical === "construction"),
  };
}
