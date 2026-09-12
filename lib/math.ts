/** Deterministic PRNG — same seed always yields the same universe. */
export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function pick<T>(rng: () => number, items: readonly T[]): T {
  return items[Math.floor(rng() * items.length)]!;
}

export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t;
}

export function clamp(v: number, lo: number, hi: number): number {
  return Math.min(hi, Math.max(lo, v));
}

export function round(v: number, digits = 3): number {
  const p = 10 ** digits;
  return Math.round(v * p) / p;
}

export type Vec3 = [number, number, number];

export function vec3(x: number, y: number, z: number): Vec3 {
  return [round(x), round(y), round(z)];
}

export function add(a: Vec3, b: Vec3): Vec3 {
  return vec3(a[0] + b[0], a[1] + b[1], a[2] + b[2]);
}

export function sub(a: Vec3, b: Vec3): Vec3 {
  return vec3(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
}

export function dist2(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  return dx * dx + dy * dy;
}

export function dist3(a: Vec3, b: Vec3): number {
  const dx = a[0] - b[0];
  const dy = a[1] - b[1];
  const dz = a[2] - b[2];
  return Math.sqrt(dx * dx + dy * dy + dz * dz);
}

export function centroid(points: Vec3[]): Vec3 {
  const n = points.length || 1;
  let x = 0;
  let y = 0;
  let z = 0;
  for (const p of points) {
    x += p[0];
    y += p[1];
    z += p[2];
  }
  return vec3(x / n, y / n, z / n);
}

export function hashString(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}
