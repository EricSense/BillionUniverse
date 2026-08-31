export function formatPeople(value: number): string {
  if (value <= 0) return "0";
  if (value >= 1_000_000_000) {
    const b = value / 1_000_000_000;
    return `${b >= 10 ? b.toFixed(0) : b.toFixed(2).replace(/0+$/, "").replace(/\.$/, "")}B`;
  }
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `${k >= 10 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return value.toLocaleString("en-US");
}

export function formatPeopleLong(value: number): string {
  return value.toLocaleString("en-US");
}

export function formatMoney(value: number): string {
  if (value <= 0) return "$0";
  if (value >= 1_000_000_000) return `$${(value / 1_000_000_000).toFixed(1)}B`;
  if (value >= 1_000_000) {
    const m = value / 1_000_000;
    return `$${m >= 10 ? m.toFixed(0) : m.toFixed(1)}M`;
  }
  if (value >= 1_000) {
    const k = value / 1_000;
    return `$${k >= 10 ? k.toFixed(0) : k.toFixed(1)}k`;
  }
  return `$${value.toLocaleString("en-US")}`;
}

export function formatPct(value: number, digits = 2): string {
  if (!Number.isFinite(value) || value <= 0) return "0%";
  if (value < 0.01) return `${value.toFixed(3)}%`;
  if (value < 1) return `${value.toFixed(2)}%`;
  return `${value.toFixed(digits)}%`;
}

export function sectorLabel(sector: string): string {
  switch (sector) {
    case "finance":
      return "Finance";
    case "health":
      return "Health";
    case "climate":
      return "Climate";
    case "education":
      return "Education";
    case "commerce":
      return "Commerce";
    case "work":
      return "Work";
    case "identity":
      return "Identity";
    default:
      return "Other";
  }
}

export function stageLabel(stage: string): string {
  switch (stage) {
    case "pre-product":
      return "Pre-product";
    case "early":
      return "Early";
    case "growth":
      return "Growth";
    case "scale":
      return "Scale";
    default:
      return stage;
  }
}

export function marketStatusLabel(status: string): string {
  switch (status) {
    case "research":
      return "Research";
    case "entering":
      return "Entering";
    case "live":
      return "Live";
    case "scaled":
      return "Scaled";
    default:
      return status;
  }
}

export const BILLION = 1_000_000_000;

export function coveragePct(reached: number, addressable: number): number {
  if (addressable <= 0) return 0;
  return (reached / addressable) * 100;
}

export function ofBillion(reached: number): number {
  return (reached / BILLION) * 100;
}
