export function m2(n: number): string {
  return `${Math.round(n).toLocaleString("en-US")} m²`;
}

export function meters(n: number): string {
  return `${n.toFixed(1)} m`;
}

export function pct(n: number): string {
  return `${Math.round(n * 100)}%`;
}

export function when(iso: string): string {
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

export function classLabel(cls: string): string {
  return cls.replaceAll("_", " ");
}

export function verticalLabel(v: string): string {
  if (v === "warehouse") return "Warehouse";
  if (v === "retail") return "Retail";
  if (v === "construction") return "Construction";
  return v;
}
