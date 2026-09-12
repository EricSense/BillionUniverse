export type KitItem = {
  sku: string;
  name: string;
  role: string;
  qty: number;
  unit_usd: number;
  optional?: boolean;
};

export type Kit = {
  id: string;
  name: string;
  summary: string;
  items: KitItem[];
};

export const WALKER_V0: Kit = {
  id: "bu-walker-v0",
  name: "Walker v0 — prove-it kit",
  summary:
    "Backpack/cart rig that one technician can walk a warehouse in a single shift. Built from parts you can order this week.",
  items: [
    {
      sku: "LIDAR-MID360",
      name: "Livox Mid-360",
      role: "Wide-FOV spinning LiDAR for SLAM and dense structure",
      qty: 1,
      unit_usd: 799,
    },
    {
      sku: "STEREO-ZED2I",
      name: "Stereolabs ZED 2i",
      role: "Metric stereo RGB-D, 120° outdoor-rated",
      qty: 1,
      unit_usd: 449,
    },
    {
      sku: "RGBD-OAKD",
      name: "Luxonis OAK-D Pro W",
      role: "Side-looking RGB + onboard ISP, overlapping the LiDAR FOV",
      qty: 2,
      unit_usd: 299,
    },
    {
      sku: "IMU-CV7",
      name: "MicroStrain 3DM-CV7-AHRS",
      role: "Tactical MEMS IMU tightly coupled into SLAM",
      qty: 1,
      unit_usd: 715,
    },
    {
      sku: "COMPUTE-ORIN",
      name: "NVIDIA Jetson Orin NX 16GB + carrier",
      role: "On-rig logging, time sync, preview SLAM",
      qty: 1,
      unit_usd: 899,
    },
    {
      sku: "NVME-2TB",
      name: "2 TB NVMe SSD",
      role: "Raw capture store (~4–6 hours of warehouse walking)",
      qty: 1,
      unit_usd: 149,
    },
    {
      sku: "POWER-98",
      name: "Hot-swap 98 Wh PD packs + boost",
      role: "3–4 hours continuous at full sensors",
      qty: 3,
      unit_usd: 89,
    },
    {
      sku: "RIG-CART",
      name: "Aluminum cart + mast + vibration isolation",
      role: "Repeatable extrinsics; 1.6 m sensor height",
      qty: 1,
      unit_usd: 420,
    },
    {
      sku: "CAL-APRIL",
      name: "AprilTag / checkerboard set + floor targets",
      role: "Booms extrinsics and loop-closure in feature-poor aisles",
      qty: 1,
      unit_usd: 180,
    },
    {
      sku: "CABLE-HARNESS",
      name: "Gated sync harness, USB3, PoE injector, cases",
      role: "Time-sync LiDAR, cameras, IMU to < 1 ms",
      qty: 1,
      unit_usd: 310,
    },
  ],
};

export const WALKER_V1: Kit = {
  id: "bu-walker-v1",
  name: "Walker v1 — production kit",
  summary:
    "Same topology as v0 with a survey LiDAR, global-shutter cameras, and RTK for yards / streets. This is the kit you replicate after the first 10 sites.",
  items: [
    {
      sku: "LIDAR-OS1",
      name: "Ouster OS1-128 Rev 7",
      role: "Survey-grade spinning LiDAR, 45 m indoor returns",
      qty: 1,
      unit_usd: 12000,
    },
    {
      sku: "CAM-GS",
      name: "Global-shutter 2.3 MP USB3 (FLIR / Lucid)",
      role: "Four-camera surround, hardware trigger from LiDAR PPS",
      qty: 4,
      unit_usd: 520,
    },
    {
      sku: "STEREO-ZEDX",
      name: "Stereolabs ZED X",
      role: "GMSL stereo on Jetson, 0.3–20 m metric depth",
      qty: 1,
      unit_usd: 499,
    },
    {
      sku: "IMU-GV7",
      name: "MicroStrain 3DM-GV7-AHRS",
      role: "Higher-grade IMU, dual-antenna heading ready",
      qty: 1,
      unit_usd: 1895,
    },
    {
      sku: "GNSS-RS3",
      name: "Emlid Reach RS3",
      role: "RTK for yards, streets, construction (optional indoor)",
      qty: 1,
      unit_usd: 2199,
      optional: true,
    },
    {
      sku: "COMPUTE-AGX",
      name: "Jetson AGX Orin 32GB developer kit",
      role: "On-rig SLAM preview + 4-cam encode",
      qty: 1,
      unit_usd: 1999,
    },
    {
      sku: "NVME-4TB",
      name: "2× 4 TB NVMe",
      role: "Full-shift raw at 10 Hz LiDAR + 20 Hz cameras",
      qty: 1,
      unit_usd: 560,
    },
    {
      sku: "RIG-SURVEY",
      name: "Survey cart, calibrated mast, IP54 covers",
      role: "Repeatable 6-DoF extrinsics, field-swappable heads",
      qty: 1,
      unit_usd: 1800,
    },
    {
      sku: "CAL-FULL",
      name: "Calibration cube + 20 floor AprilTags",
      role: "Site setup in 15 minutes",
      qty: 1,
      unit_usd: 340,
    },
  ],
};

export const PROCESS_STATION: Kit = {
  id: "bu-process-station",
  name: "24-hour process station",
  summary:
    "One workstation turns a walk into a Universe Bundle overnight. No cluster required for the first 20 sites.",
  items: [
    {
      sku: "GPU-4090",
      name: "Workstation + RTX 4090 24 GB",
      role: "SLAM, reconstruction, SAM/CLIP segmentation, meshing",
      qty: 1,
      unit_usd: 3400,
    },
    {
      sku: "DISK-20TB",
      name: "20 TB NAS (raw + bundles)",
      role: "Keep raw until QA ships, then cold storage",
      qty: 1,
      unit_usd: 780,
    },
  ],
};

export function kitTotal(kit: Kit, includeOptional = true): number {
  return kit.items
    .filter((i) => includeOptional || !i.optional)
    .reduce((sum, i) => sum + i.qty * i.unit_usd, 0);
}

export function usd(n: number): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(n);
}

export const NINETY_DAY_BUDGET = [
  { label: "Walker v0 kit", usd: kitTotal(WALKER_V0) },
  { label: "Process station", usd: kitTotal(PROCESS_STATION) },
  { label: "Consumables, cases, insurance", usd: 2200 },
  { label: "Warehouse access / time", usd: 3500 },
  { label: "Travel + vehicle (10–20 sites)", usd: 4800 },
  { label: "Cloud backup / labeling assist", usd: 1200 },
] as const;

export function ninetyDayTotal(): number {
  return NINETY_DAY_BUDGET.reduce((s, r) => s + r.usd, 0);
}
