/** Deterministic 32-bit hash. Same name always claims the same plot. */
export function hash32(s: string): number {
  let h = 2166136261;
  for (let i = 0; i < s.length; i++) {
    h ^= s.charCodeAt(i);
    h = Math.imul(h, 16777619);
  }
  return h >>> 0;
}

export function mulberry32(seed: number): () => number {
  let t = seed >>> 0;
  return () => {
    t += 0x6d2b79f5;
    let x = Math.imul(t ^ (t >>> 15), 1 | t);
    x ^= x + Math.imul(x ^ (x >>> 7), 61 | x);
    return ((x ^ (x >>> 14)) >>> 0) / 4294967296;
  };
}

export function plotFromName(name: string): { x: number; y: number } {
  const h = hash32(name.trim().toLowerCase());
  const rng = mulberry32(h);
  // Keep people off the extreme edges; bias toward inhabited belts.
  const x = 0.08 + rng() * 0.84;
  const y = 0.18 + rng() * 0.64;
  return { x, y };
}

export function hueFromName(name: string): number {
  return hash32(name.trim().toLowerCase()) % 360;
}
