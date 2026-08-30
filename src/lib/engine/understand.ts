import type { Capability, NodeKind, StakeLevel, UnderstoodIntent } from "../types";

const KIND_HINTS: { kind: NodeKind; words: string[] }[] = [
  {
    kind: "machine",
    words: [
      "printer",
      "machine",
      "hardware",
      "device",
      "outlet",
      "kiln",
      "robot",
      "cnc",
      "sensor",
      "factory",
      "plc",
    ],
  },
  {
    kind: "agent",
    words: ["agent", "bot", "negotiate", "autonomous", "buyer", "seller", "represents"],
  },
  {
    kind: "system",
    words: [
      "inventory",
      "crm",
      "erp",
      "workflow",
      "shipping",
      "shipment",
      "ledger",
      "saas",
      "software",
      "database",
      "api",
      "accounting",
    ],
  },
  {
    kind: "creation",
    words: [
      "game",
      "mechanic",
      "art",
      "tileset",
      "script",
      "generator",
      "pack",
      "shader",
      "level",
      "story",
    ],
  },
];

const DOMAIN_HINTS: { domain: string; words: string[] }[] = [
  { domain: "games", words: ["game", "mechanic", "sprite", "tileset", "player", "level", "pixel"] },
  { domain: "commerce", words: ["inventory", "shipping", "order", "sku", "supplier", "shop", "bakery"] },
  { domain: "make", words: ["print", "mesh", "stl", "gcode", "machine", "device", "3d", "cnc"] },
  { domain: "enterprise", words: ["crm", "erp", "account", "contract", "enterprise", "quote"] },
];

interface CapRule {
  trigger: string[];
  cap: Omit<Capability, "id">;
}

const CAP_RULES: CapRule[] = [
  {
    trigger: ["gravity", "projectile", "mechanic", "physics"],
    cap: {
      name: "Game mechanic",
      direction: "provides",
      contract: "mechanic.apply({ entities }) → world delta",
      tokens: ["game", "mechanic", "physics", "projectile"],
    },
  },
  {
    trigger: ["art", "tile", "sprite", "skin", "visual"],
    cap: {
      name: "Visual skin",
      direction: "provides",
      contract: "tileset.overlay({ theme, palette }) → atlas",
      tokens: ["art", "tileset", "sprite", "visual"],
    },
  },
  {
    trigger: ["inventory", "stock", "ingredient", "sku", "warehouse"],
    cap: {
      name: "Stock levels",
      direction: "provides",
      contract: "inventory.levels({ sku }) → { onHand, threshold }",
      tokens: ["inventory", "stock", "sku", "levels"],
    },
  },
  {
    trigger: ["reorder", "supplier", "purchase", "order"],
    cap: {
      name: "Supplier order",
      direction: "needs",
      contract: "purchase.place({ sku, qty, deliverBy })",
      tokens: ["supplier", "order", "purchase", "reorder"],
    },
  },
  {
    trigger: ["ship", "label", "fulfill", "carrier", "delivery"],
    cap: {
      name: "Create shipment",
      direction: "provides",
      contract: "shipment.create({ from, to, items }) → { label, tracking }",
      tokens: ["shipping", "shipment", "label", "fulfillment"],
    },
  },
  {
    trigger: ["mesh", "lattice", "stl", "model", "generate"],
    cap: {
      name: "Generate mesh",
      direction: "provides",
      contract: "mesh.generate({ loadN, bboxMm }) → { stl }",
      tokens: ["mesh", "stl", "model", "generate", "3d"],
    },
  },
  {
    trigger: ["print", "printer", "gcode", "hardware"],
    cap: {
      name: "Run toolpath",
      direction: "needs",
      contract: "toolpath.slice({ stl, material }) → { gcode }",
      tokens: ["print", "printer", "gcode", "machine"],
    },
  },
  {
    trigger: ["crm", "customer", "account", "contact"],
    cap: {
      name: "Account record",
      direction: "provides",
      contract: "crm.account({ id }) → { name, terms }",
      tokens: ["crm", "account", "customer", "terms"],
    },
  },
  {
    trigger: ["quote", "erp", "atp", "parts"],
    cap: {
      name: "Available to promise",
      direction: "provides",
      contract: "fulfill.quote({ sku, qty }) → { price, eta }",
      tokens: ["quote", "erp", "fulfillment", "atp"],
    },
  },
  {
    trigger: ["agent", "negotiate", "bot"],
    cap: {
      name: "Negotiate",
      direction: "provides",
      contract: "agent.order({ quoteId, terms }) → { po, settlement }",
      tokens: ["agent", "negotiate", "order", "transaction"],
    },
  },
  {
    trigger: ["device", "outlet", "switch", "home", "iot"],
    cap: {
      name: "Switch device",
      direction: "needs",
      contract: "device.switch({ on, until })",
      tokens: ["device", "switch", "outlet", "home"],
    },
  },
];

function tokenize(text: string): string[] {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9+]+/g, " ")
    .split(/\s+/)
    .filter((w) => w.length > 1);
}

function titleCase(words: string[]): string {
  return words
    .filter((w) => !["a", "an", "the", "to", "for", "of", "and", "that", "with"].includes(w))
    .slice(0, 4)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(" ");
}

function detectKind(tokens: string[]): NodeKind {
  let best: NodeKind = "creation";
  let bestScore = 0;
  for (const hint of KIND_HINTS) {
    const score = hint.words.filter((w) => tokens.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = hint.kind;
    }
  }
  return best;
}

function detectDomain(tokens: string[]): string {
  let best = "general";
  let bestScore = 0;
  for (const hint of DOMAIN_HINTS) {
    const score = hint.words.filter((w) => tokens.includes(w)).length;
    if (score > bestScore) {
      bestScore = score;
      best = hint.domain;
    }
  }
  return best;
}

function detectStakes(kind: NodeKind, tokens: string[]): StakeLevel {
  if (
    kind === "machine" ||
    tokens.some((t) => ["hardware", "printer", "machine", "factory", "physical", "device"].includes(t))
  ) {
    return "physical";
  }
  if (
    kind === "system" ||
    kind === "agent" ||
    tokens.some((t) => ["inventory", "crm", "erp", "payment", "order", "company"].includes(t))
  ) {
    return "business";
  }
  return "digital";
}

function extractCapabilities(tokens: string[], kind: NodeKind): Capability[] {
  const found: Capability[] = [];
  const used = new Set<string>();
  for (const rule of CAP_RULES) {
    if (!rule.trigger.some((t) => tokens.includes(t))) continue;
    const key = `${rule.cap.direction}:${rule.cap.name}`;
    if (used.has(key)) continue;
    used.add(key);
    found.push({
      id: `cap-${found.length + 1}`,
      ...rule.cap,
    });
  }
  if (found.length === 0) {
    found.push({
      id: "cap-1",
      name: kind === "machine" ? "Actuate" : kind === "agent" ? "Act" : "Expose interface",
      direction: "provides",
      contract: "node.describe() → purpose + interface",
      tokens: tokens.slice(0, 6),
    });
  }
  return found;
}

export function understand(description: string): UnderstoodIntent {
  const trimmed = description.trim();
  if (!trimmed) {
    throw new Error("Describe what you have or what you want.");
  }
  const tokens = tokenize(trimmed);
  const kind = detectKind(tokens);
  const domain = detectDomain(tokens);
  const purpose = trimmed.length > 160 ? `${trimmed.slice(0, 157)}…` : trimmed;
  const name =
    titleCase(tokens.filter((t) => t.length > 3).slice(0, 6)) ||
    (kind === "machine" ? "Unnamed Machine" : "Unnamed Node");
  return {
    name,
    kind,
    purpose,
    domain,
    description: trimmed,
    capabilities: extractCapabilities(tokens, kind),
    suggestedStakes: detectStakes(kind, tokens),
  };
}

export function tokenizeForMatch(text: string): string[] {
  return tokenize(text);
}
