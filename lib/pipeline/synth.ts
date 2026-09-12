import { mulberry32, round, vec3, type Vec3 } from "../math";
import { AFFORDANCES, physicsFor } from "../physics";
import {
  type ObjectClass,
  type ObjectInstance,
  type Site,
  type Vertical,
  type Zone,
  universeId,
} from "../schema";

export type GroundObject = ObjectInstance & { gt: true };

export type GroundScene = {
  seed: number;
  site: Site;
  zones: Zone[];
  objects: GroundObject[];
  aisleXs: number[];
  aisleWidth: number;
};

const WAREHOUSE_NAMES = [
  ["Meridian Fulfillment", "Grove City, OH"],
  ["Harbor Path DC", "Newark, NJ"],
  ["Coldline 4", "Elk Grove, CA"],
  ["Northline Crossdock", "Joliet, IL"],
  ["Stackwell A", "Fort Worth, TX"],
  ["Redwood Parcel", "Kent, WA"],
  ["Summit Robotics Lab DC", "Hagerstown, MD"],
  ["Pinebelt Grocery DC", "Lakeland, FL"],
  ["Iron Gate 2", "Allentown, PA"],
  ["Prairie Sort", "Kansas City, MO"],
  ["Cinder Dock", "Phoenix, AZ"],
  ["Blue Rail Logistics", "Memphis, TN"],
] as const;

const RETAIL_NAMES = [
  ["Eastgate Superfloor", "Columbus, OH"],
  ["Harbor Lights Market", "Tampa, FL"],
] as const;

const CONSTRUCTION_NAMES = [
  ["Ridge Frame — Level 2", "Denver, CO"],
] as const;

function aabb(cx: number, cy: number, cz: number, sx: number, sy: number, sz: number) {
  const hx = sx / 2;
  const hy = sy / 2;
  return {
    min: vec3(cx - hx, cy - hy, cz),
    max: vec3(cx + hx, cy + hy, cz + sz),
  };
}

function obj(
  id: string,
  cls: ObjectClass,
  label: string,
  center: Vec3,
  size: Vec3,
  yaw: number,
  zone_id: string | null,
  confidence = 1,
  massScale = 1,
): GroundObject {
  return {
    id,
    class: cls,
    label,
    aabb: aabb(center[0], center[1], center[2], size[0], size[1], size[2]),
    yaw,
    zone_id,
    affordances: AFFORDANCES[cls],
    physics: physicsFor(cls, massScale),
    confidence,
    gt: true,
  };
}

function poly(x0: number, y0: number, x1: number, y1: number): [number, number][] {
  return [
    [round(x0), round(y0)],
    [round(x1), round(y0)],
    [round(x1), round(y1)],
    [round(x0), round(y1)],
  ];
}

export function synthesize(seed: number, vertical?: Vertical): GroundScene {
  const v: Vertical =
    vertical ??
    (seed % 15 === 0 ? "construction" : seed % 7 === 0 ? "retail" : "warehouse");
  if (v === "retail") return synthRetail(seed);
  if (v === "construction") return synthConstruction(seed);
  return synthWarehouse(seed);
}

function synthWarehouse(seed: number): GroundScene {
  const rng = mulberry32(seed + 17);
  const [name, metro] = WAREHOUSE_NAMES[(seed - 1 + WAREHOUSE_NAMES.length) % WAREHOUSE_NAMES.length]!;
  const aisleCount = 6 + (seed % 5);
  const bays = 10 + (seed % 6);
  const aisleWidth = 3.2 + (seed % 3) * 0.2;
  const rackDepth = 1.1;
  const bayLen = 2.6;
  const rackH = 6.2 + (seed % 3) * 0.4;
  const dockDepth = 14;
  const stagingW = 18;
  const length = dockDepth + bays * bayLen + 4;
  const width = stagingW + aisleCount * (aisleWidth + 2 * rackDepth) + 4;
  const ceiling = round(9.1 + (seed % 4) * 0.3);

  const site: Site = {
    name,
    vertical: "warehouse",
    metro,
    region: metro.split(", ")[1] ?? "US",
    area_m2: round(length * width),
    ceiling_m: ceiling,
    bounds: { min: vec3(0, 0, 0), max: vec3(length, width, ceiling) },
    privacy: "coarse_metro",
  };

  const zones: Zone[] = [];
  const objects: GroundObject[] = [];
  const aisleXs: number[] = [];

  zones.push({
    id: "zone_dock",
    type: "dock",
    label: "Inbound / outbound docks",
    polygon: poly(0, 2, dockDepth, width - 2),
    height_m: ceiling,
  });
  zones.push({
    id: "zone_staging",
    type: "staging",
    label: "Staging",
    polygon: poly(dockDepth, 2, dockDepth + 8, width - 2),
    height_m: 3,
  });

  let n = 0;
  const dockDoors = 4 + (seed % 3);
  for (let d = 0; d < dockDoors; d++) {
    const y = 4 + (d + 1) * ((width - 8) / (dockDoors + 1));
    objects.push(
      obj(
        `gt_dock_${d}`,
        "dock_door",
        `Dock ${String.fromCharCode(65 + d)}`,
        vec3(0.2, y, 0),
        vec3(0.4, 2.4, 3.2),
        0,
        "zone_dock",
      ),
    );
  }

  for (let i = 0; i < 6; i++) {
    const y = 3 + i * ((width - 6) / 6);
    objects.push(
      obj(
        `gt_col_d_${i}`,
        "column",
        `Column D${i + 1}`,
        vec3(dockDepth / 2, y, 0),
        vec3(0.6, 0.6, ceiling),
        0,
        "zone_dock",
      ),
    );
  }

  const racksStartX = dockDepth + 8;
  const racksStartY = 3;
  const pitch = aisleWidth + 2 * rackDepth;

  for (let a = 0; a < aisleCount; a++) {
    const aisleY = racksStartY + a * pitch + rackDepth + aisleWidth / 2;
    aisleXs.push(aisleY);
    const y0 = aisleY - aisleWidth / 2;
    const y1 = aisleY + aisleWidth / 2;
    zones.push({
      id: `zone_aisle_${a}`,
      type: "aisle",
      label: `Aisle ${String.fromCharCode(65 + a)}`,
      polygon: poly(racksStartX, y0, length - 2, y1),
      height_m: rackH,
    });

    for (const side of [-1, 1] as const) {
      const rackY = aisleY + side * (aisleWidth / 2 + rackDepth / 2);
      for (let b = 0; b < bays; b++) {
        const x = racksStartX + (b + 0.5) * bayLen;
        const id = `gt_rack_${a}_${side === -1 ? "L" : "R"}_${b}`;
        objects.push(
          obj(
            id,
            "pallet_rack",
            `Rack ${String.fromCharCode(65 + a)}${side === -1 ? "L" : "R"}-${b + 1}`,
            vec3(x, rackY, 0),
            vec3(bayLen - 0.08, rackDepth, rackH),
            0,
            `zone_aisle_${a}`,
          ),
        );
        n++;
        if (rng() > 0.28) {
          const load = 0.4 + rng() * 0.8;
          objects.push(
            obj(
              `gt_pal_${a}_${side}_${b}`,
              "pallet",
              `Pallet ${String.fromCharCode(65 + a)}-${b + 1}`,
              vec3(x, rackY, 0.12),
              vec3(1.2, 1.0, 0.14),
              0,
              `zone_aisle_${a}`,
              1,
              load,
            ),
          );
          if (rng() > 0.45) {
            objects.push(
              obj(
                `gt_box_${a}_${side}_${b}`,
                "carton",
                `Carton ${n}`,
                vec3(x, rackY, 0.28),
                vec3(0.5 + rng() * 0.4, 0.4 + rng() * 0.3, 0.4 + rng() * 0.5),
                0,
                `zone_aisle_${a}`,
                1,
                0.6 + rng(),
              ),
            );
          }
        }
      }
    }
  }

  const forkCount = 1 + (seed % 3);
  for (let f = 0; f < forkCount; f++) {
    const ay = aisleXs[Math.floor(rng() * aisleXs.length)]!;
    objects.push(
      obj(
        `gt_fork_${f}`,
        "forklift",
        `Forklift ${f + 1}`,
        vec3(racksStartX + 4 + rng() * 10, ay, 0),
        vec3(2.4, 1.2, 2.2),
        rng() > 0.5 ? 0 : Math.PI,
        "zone_staging",
      ),
    );
  }

  objects.push(
    obj(
      "gt_jack_1",
      "pallet_jack",
      "Pallet jack",
      vec3(dockDepth + 3, width / 2, 0),
      vec3(1.6, 0.7, 1.2),
      Math.PI / 2,
      "zone_staging",
    ),
  );

  if (rng() > 0.4) {
    objects.push(
      obj(
        "gt_conv_1",
        "conveyor",
        "Outbound conveyor",
        vec3(dockDepth + 2, 4, 0.4),
        vec3(8, 0.9, 1.1),
        0,
        "zone_dock",
      ),
    );
  }

  objects.push(
    obj(
      "gt_barrier_1",
      "safety_barrier",
      "Pedestrian barrier",
      vec3(dockDepth + 1, width - 3, 0),
      vec3(4, 0.15, 1.1),
      0,
      "zone_staging",
    ),
  );

  return { seed, site, zones, objects, aisleXs, aisleWidth };
}

function synthRetail(seed: number): GroundScene {
  const rng = mulberry32(seed + 91);
  const [name, metro] = RETAIL_NAMES[(seed - 1 + RETAIL_NAMES.length) % RETAIL_NAMES.length]!;
  const length = 42;
  const width = 28;
  const ceiling = 4.2;
  const site: Site = {
    name,
    vertical: "retail",
    metro,
    region: metro.split(", ")[1] ?? "US",
    area_m2: round(length * width),
    ceiling_m: ceiling,
    bounds: { min: vec3(0, 0, 0), max: vec3(length, width, ceiling) },
    privacy: "coarse_metro",
  };
  const zones: Zone[] = [
    {
      id: "zone_sales",
      type: "sales_floor",
      label: "Sales floor",
      polygon: poly(6, 1, length - 2, width - 1),
      height_m: ceiling,
    },
    {
      id: "zone_front",
      type: "checkout",
      label: "Front end",
      polygon: poly(0, 1, 6, width - 1),
      height_m: 3,
    },
  ];
  const objects: GroundObject[] = [];
  const aisleXs: number[] = [];
  for (let i = 0; i < 5; i++) {
    const y = 4 + i * 4.4;
    aisleXs.push(y + 1.1);
    zones.push({
      id: `zone_aisle_${i}`,
      type: "aisle",
      label: `Gondola aisle ${i + 1}`,
      polygon: poly(8, y + 0.9, length - 4, y + 2.4),
      height_m: 2.1,
    });
    for (let b = 0; b < 8; b++) {
      objects.push(
        obj(
          `gt_shelf_${i}_${b}`,
          "shelf",
          `Gondola ${i + 1}-${b + 1}`,
          vec3(10 + b * 3.4, y, 0),
          vec3(3.2, 0.9, 2.0),
          0,
          `zone_aisle_${i}`,
        ),
      );
      if (rng() > 0.5) {
        objects.push(
          obj(
            `gt_fix_${i}_${b}`,
            "display",
            `Endcap ${i}-${b}`,
            vec3(10 + b * 3.4, y + 0.1, 2.0),
            vec3(0.8, 0.6, 0.4),
            0,
            `zone_aisle_${i}`,
          ),
        );
      }
    }
  }
  for (let c = 0; c < 4; c++) {
    objects.push(
      obj(
        `gt_counter_${c}`,
        "counter",
        `Checkout ${c + 1}`,
        vec3(3, 5 + c * 5, 0),
        vec3(2.4, 1.1, 1.0),
        0,
        "zone_front",
      ),
    );
  }
  objects.push(
    obj(
      "gt_carts",
      "cart",
      "Cart corral",
      vec3(2, 2, 0),
      vec3(2.2, 1.6, 1.1),
      0,
      "zone_front",
    ),
  );
  return { seed, site, zones, objects, aisleXs, aisleWidth: 1.5 };
}

function synthConstruction(seed: number): GroundScene {
  const [name, metro] = CONSTRUCTION_NAMES[0];
  const length = 36;
  const width = 24;
  const ceiling = 3.2;
  const site: Site = {
    name,
    vertical: "construction",
    metro,
    region: metro.split(", ")[1] ?? "US",
    area_m2: round(length * width),
    ceiling_m: ceiling,
    bounds: { min: vec3(0, 0, 0), max: vec3(length, width, ceiling) },
    privacy: "coarse_metro",
  };
  const zones: Zone[] = [
    {
      id: "zone_work",
      type: "work_area",
      label: "Open floor",
      polygon: poly(1, 1, length - 1, width - 1),
      height_m: ceiling,
    },
  ];
  const objects: GroundObject[] = [];
  const rng = mulberry32(seed + 3);
  for (let i = 0; i < 8; i++) {
    objects.push(
      obj(
        `gt_col_${i}`,
        "column",
        `Steel column ${i + 1}`,
        vec3(4 + (i % 4) * 8, 4 + Math.floor(i / 4) * 12, 0),
        vec3(0.35, 0.35, ceiling),
        0,
        "zone_work",
      ),
    );
  }
  for (let i = 0; i < 12; i++) {
    objects.push(
      obj(
        `gt_deb_${i}`,
        "debris",
        `Material pile ${i + 1}`,
        vec3(3 + rng() * 28, 3 + rng() * 16, 0),
        vec3(1.2 + rng(), 0.8 + rng(), 0.4 + rng() * 0.8),
        rng() * Math.PI,
        "zone_work",
        1,
        0.5 + rng(),
      ),
    );
  }
  objects.push(
    obj(
      "gt_barrier_c",
      "safety_barrier",
      "Edge protection",
      vec3(length / 2, 0.4, 0),
      vec3(length - 2, 0.12, 1.1),
      0,
      "zone_work",
    ),
  );
  return { seed, site, zones, objects, aisleXs: [width / 2], aisleWidth: 4 };
}

export { universeId };

