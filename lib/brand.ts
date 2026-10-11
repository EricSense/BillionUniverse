/** Colors sampled from the BillionUniverse lockup. */
export const BRAND = {
  name: "BillionUniverse",
  core: "#1B56C9",
  ringInner: "#2F74E0",
  ringMid: "#4A96EE",
  ringOuter: "#6BB7F6",
  ink: "#2A2A2A",
  mute: "#6B7280",
  paper: "#FFFFFF",
  mist: "#F4F8FC",
  line: "#E6EEF7",
} as const;

export const COLORS = [
  { name: "Core", hex: BRAND.core },
  { name: "Inner ring", hex: BRAND.ringInner },
  { name: "Mid ring", hex: BRAND.ringMid },
  { name: "Outer ring", hex: BRAND.ringOuter },
  { name: "Ink", hex: BRAND.ink },
  { name: "Paper", hex: BRAND.paper },
] as const;

export const LAYERS = [
  {
    n: "01",
    name: "Core",
    line: "One origin. A single point of identity.",
  },
  {
    n: "02",
    name: "Orbit",
    line: "The first ring. Bound to the core, never a separate mark.",
  },
  {
    n: "03",
    name: "Field",
    line: "Wider rings. The same system, held at a larger radius.",
  },
  {
    n: "04",
    name: "Universe",
    line: "Scale. Enough orbits that a billion share one identity.",
  },
] as const;

export const NAV = [
  { href: "/", label: "Home" },
  { href: "/system", label: "System" },
  { href: "/scale", label: "Scale" },
] as const;
