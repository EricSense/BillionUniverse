import type { Connection, NetworkNode } from "./types";

export const SEED_NODES: NetworkNode[] = [
  {
    id: "n-gravity-wells",
    kind: "creation",
    name: "Gravity Wells",
    owner: { name: "Maya Chen", kind: "person", payTier: "individual" },
    purpose: "A game mechanic that pulls projectiles and players into wells of variable mass.",
    description:
      "Described by a teenager in one sitting. Mass, radius, and falloff are exposed so other creations can drop in without rewriting the physics loop.",
    domain: "games",
    capabilities: [
      {
        id: "gw-provide-field",
        name: "Gravity field",
        direction: "provides",
        contract: "field.apply({ x, y, mass, radius }) → force vector",
        tokens: ["gravity", "physics", "projectile", "game", "mechanic", "force", "mass"],
      },
      {
        id: "gw-need-art",
        name: "Visual skin",
        direction: "needs",
        contract: "tileset.overlay({ theme, palette, tileSize })",
        tokens: ["art", "tileset", "sprite", "visual", "skin", "nebula", "pixel"],
      },
    ],
    trust: {
      score: 38,
      stakeCeiling: "digital",
      events: [
        {
          id: "te-gw-1",
          at: "2026-03-12T18:04:00.000Z",
          delta: 8,
          reason: "Played cleanly with two other digital creations.",
        },
      ],
    },
    position: { x: 18, y: 28 },
    createdAt: "2026-03-11T16:20:00.000Z",
    origin: "seed",
  },
  {
    id: "n-nebula-tiles",
    kind: "creation",
    name: "Nebula Tile Pack",
    owner: { name: "Kai Okonkwo", kind: "person", payTier: "individual" },
    purpose: "A pixel art pack of nebula tiles, well rims, and dust overlays for 2D games.",
    description:
      "Built as a standalone art pack. Never spoken to the author of Gravity Wells — the network suggested the pairing by meaning.",
    domain: "games",
    capabilities: [
      {
        id: "nt-provide-art",
        name: "Pixel tileset",
        direction: "provides",
        contract: "tileset.overlay({ theme, palette, tileSize }) → sprite atlas",
        tokens: ["art", "tileset", "sprite", "pixel", "nebula", "visual", "skin", "game"],
      },
    ],
    trust: {
      score: 44,
      stakeCeiling: "digital",
      events: [
        {
          id: "te-nt-1",
          at: "2026-04-02T11:10:00.000Z",
          delta: 12,
          reason: "Dropped into three games without visual collisions.",
        },
      ],
    },
    position: { x: 30, y: 18 },
    createdAt: "2026-02-20T09:00:00.000Z",
    origin: "seed",
  },
  {
    id: "n-inventory",
    kind: "system",
    name: "Pantry Ledger",
    owner: { name: "Rosa Delgado", kind: "person", payTier: "company" },
    purpose: "Tracks ingredient stock for a small bakery and raises reorder intents when levels drop.",
    description:
      "Described as a workflow, not built as software. The network represented stock levels and reorder triggers as a readable interface.",
    domain: "commerce",
    capabilities: [
      {
        id: "inv-provide-stock",
        name: "Stock levels",
        direction: "provides",
        contract: "inventory.levels({ sku }) → { onHand, threshold, unit }",
        tokens: ["inventory", "stock", "sku", "ingredient", "levels", "warehouse"],
      },
      {
        id: "inv-need-order",
        name: "Supplier order",
        direction: "needs",
        contract: "purchase.place({ sku, qty, deliverBy })",
        tokens: ["supplier", "order", "purchase", "reorder", "procurement"],
      },
      {
        id: "inv-need-ship",
        name: "Outbound shipment",
        direction: "needs",
        contract: "shipment.create({ from, to, items })",
        tokens: ["shipping", "shipment", "fulfillment", "delivery", "label"],
      },
    ],
    trust: {
      score: 61,
      stakeCeiling: "business",
      events: [
        {
          id: "te-inv-1",
          at: "2026-05-18T14:22:00.000Z",
          delta: 15,
          reason: "Ninety days of accurate reorder events, zero missed bake days.",
        },
      ],
    },
    position: { x: 62, y: 34 },
    createdAt: "2026-01-08T13:00:00.000Z",
    origin: "seed",
  },
  {
    id: "n-ship-auto",
    kind: "system",
    name: "Harbor Labels",
    owner: { name: "Ben Hale", kind: "person", payTier: "individual" },
    purpose: "Turns a packing list into a carrier label and a tracking event.",
    description:
      "A shipping automation written for one person's side business. Now reachable by anyone who needs a shipment created.",
    domain: "commerce",
    capabilities: [
      {
        id: "ship-provide",
        name: "Create shipment",
        direction: "provides",
        contract: "shipment.create({ from, to, items }) → { label, tracking }",
        tokens: ["shipping", "shipment", "label", "tracking", "carrier", "fulfillment"],
      },
      {
        id: "ship-need-address",
        name: "Destination",
        direction: "needs",
        contract: "address.resolve({ party }) → { line, city, postal }",
        tokens: ["address", "destination", "party", "location"],
      },
    ],
    trust: {
      score: 58,
      stakeCeiling: "business",
      events: [
        {
          id: "te-ship-1",
          at: "2026-06-01T08:40:00.000Z",
          delta: 10,
          reason: "Label generation held through a holiday volume spike.",
        },
      ],
    },
    position: { x: 74, y: 46 },
    createdAt: "2025-11-14T10:12:00.000Z",
    origin: "seed",
  },
  {
    id: "n-supplier-bot",
    kind: "agent",
    name: "Millrun Buyer",
    owner: { name: "Priya Nair", kind: "person", payTier: "company" },
    purpose: "Places supplier orders from a reorder intent and confirms delivery windows.",
    description:
      "A buying agent that speaks purchase orders, not bakery language. The network translates stock thresholds into the order it already knows how to place.",
    domain: "commerce",
    capabilities: [
      {
        id: "sup-provide-order",
        name: "Place purchase",
        direction: "provides",
        contract: "purchase.place({ sku, qty, deliverBy }) → { po, eta }",
        tokens: ["supplier", "order", "purchase", "procurement", "po", "reorder"],
      },
      {
        id: "sup-provide-address",
        name: "Supplier address",
        direction: "provides",
        contract: "address.resolve({ party }) → { line, city, postal }",
        tokens: ["address", "supplier", "location", "party"],
      },
    ],
    trust: {
      score: 67,
      stakeCeiling: "business",
      events: [
        {
          id: "te-sup-1",
          at: "2026-06-20T16:05:00.000Z",
          delta: 9,
          reason: "Settled twenty-two purchase orders without a dispute.",
        },
      ],
    },
    position: { x: 54, y: 50 },
    createdAt: "2026-02-02T15:30:00.000Z",
    origin: "seed",
  },
  {
    id: "n-print-script",
    kind: "creation",
    name: "Lattice Generator",
    owner: { name: "Jonah Voss", kind: "person", payTier: "individual" },
    purpose: "Generates lightweight lattice meshes from a load and a bounding box.",
    description:
      "A hobbyist's script. Several hops later it can reach a printer — only after the path has earned the right to touch hardware.",
    domain: "make",
    capabilities: [
      {
        id: "lg-provide-mesh",
        name: "Generate mesh",
        direction: "provides",
        contract: "mesh.generate({ loadN, bboxMm }) → { stl, volume }",
        tokens: ["mesh", "lattice", "stl", "model", "generate", "print", "3d"],
      },
    ],
    trust: {
      score: 41,
      stakeCeiling: "digital",
      events: [
        {
          id: "te-lg-1",
          at: "2026-04-19T12:00:00.000Z",
          delta: 6,
          reason: "Meshes validated by two independent slicers.",
        },
      ],
    },
    position: { x: 22, y: 68 },
    createdAt: "2026-04-01T19:45:00.000Z",
    origin: "seed",
  },
  {
    id: "n-slicer",
    kind: "system",
    name: "Threadpath Slicer",
    owner: { name: "Ada Cho", kind: "person", payTier: "company" },
    purpose: "Turns a mesh into machine toolpaths with material and safety envelopes.",
    description:
      "The hop between a hobbyist file and a physical printer. Reads STLs, writes gcode, refuses jobs that exceed the machine's envelope.",
    domain: "make",
    capabilities: [
      {
        id: "sl-need-mesh",
        name: "Accept mesh",
        direction: "needs",
        contract: "mesh.generate({ loadN, bboxMm }) → { stl, volume }",
        tokens: ["mesh", "stl", "model", "lattice", "3d"],
      },
      {
        id: "sl-provide-path",
        name: "Toolpath",
        direction: "provides",
        contract: "toolpath.slice({ stl, material }) → { gcode, minutes, grams }",
        tokens: ["gcode", "slice", "toolpath", "print", "printer", "material"],
      },
    ],
    trust: {
      score: 79,
      stakeCeiling: "physical",
      events: [
        {
          id: "te-sl-1",
          at: "2026-07-03T07:15:00.000Z",
          delta: 18,
          reason: "Rejected twelve unsafe envelopes; zero hardware incidents.",
        },
      ],
    },
    position: { x: 36, y: 78 },
    createdAt: "2025-09-22T08:00:00.000Z",
    origin: "seed",
  },
  {
    id: "n-printer-farm",
    kind: "machine",
    name: "Northlight Printer 04",
    owner: { name: "Northlight Fabrication", kind: "company", payTier: "enterprise" },
    purpose: "A physical FDM printer that executes signed toolpaths inside a guarded cell.",
    description:
      "Highest-stakes node in this cluster. The network will not route an unsigned hobbyist mesh here directly — only through a trusted slicer, under an enterprise guarantee.",
    domain: "make",
    capabilities: [
      {
        id: "pr-need-path",
        name: "Run toolpath",
        direction: "needs",
        contract: "toolpath.slice({ stl, material }) → { gcode, minutes, grams }",
        tokens: ["gcode", "print", "printer", "machine", "toolpath", "hardware"],
      },
      {
        id: "pr-provide-job",
        name: "Job receipt",
        direction: "provides",
        contract: "machine.job({ gcode }) → { status, photos, gramsUsed }",
        tokens: ["job", "machine", "status", "print", "receipt"],
      },
    ],
    trust: {
      score: 91,
      stakeCeiling: "physical",
      events: [
        {
          id: "te-pr-1",
          at: "2026-07-28T21:00:00.000Z",
          delta: 4,
          reason: "Audited cell; emergency stop proven under load.",
        },
      ],
    },
    position: { x: 48, y: 88 },
    createdAt: "2025-06-01T00:00:00.000Z",
    origin: "seed",
  },
  {
    id: "n-crm-northwind",
    kind: "system",
    name: "Northwind CRM",
    owner: { name: "Northwind Logistics", kind: "company", payTier: "enterprise" },
    purpose: "Existing customer and contract system, plugged in rather than rebuilt.",
    description:
      "A company system that joined the network as a node. No custom integration project — the network read its interface and made it reachable.",
    domain: "enterprise",
    capabilities: [
      {
        id: "crm-provide-account",
        name: "Account record",
        direction: "provides",
        contract: "crm.account({ id }) → { name, terms, contacts }",
        tokens: ["crm", "account", "customer", "contract", "terms"],
      },
      {
        id: "crm-need-order",
        name: "Fulfillment request",
        direction: "needs",
        contract: "fulfill.quote({ sku, qty, dest })",
        tokens: ["fulfillment", "quote", "order", "logistics"],
      },
    ],
    trust: {
      score: 84,
      stakeCeiling: "business",
      events: [
        {
          id: "te-crm-1",
          at: "2026-05-02T09:30:00.000Z",
          delta: 11,
          reason: "Joined with audited read-only surface; write scope granted later.",
        },
      ],
    },
    position: { x: 80, y: 20 },
    createdAt: "2026-04-15T12:00:00.000Z",
    origin: "seed",
  },
  {
    id: "n-erp-helix",
    kind: "system",
    name: "Helix Parts ERP",
    owner: { name: "Helix Parts", kind: "company", payTier: "enterprise" },
    purpose: "Inventory, pricing, and available-to-promise for industrial parts.",
    description:
      "Another company's existing software. Once on the network it is reachable by agents and systems it was never designed to meet.",
    domain: "enterprise",
    capabilities: [
      {
        id: "erp-provide-atp",
        name: "Available to promise",
        direction: "provides",
        contract: "fulfill.quote({ sku, qty, dest }) → { price, eta, hold }",
        tokens: ["erp", "inventory", "quote", "fulfillment", "parts", "atp"],
      },
      {
        id: "erp-need-account",
        name: "Buyer terms",
        direction: "needs",
        contract: "crm.account({ id }) → { name, terms, contacts }",
        tokens: ["crm", "account", "terms", "customer"],
      },
    ],
    trust: {
      score: 88,
      stakeCeiling: "business",
      events: [
        {
          id: "te-erp-1",
          at: "2026-05-09T11:00:00.000Z",
          delta: 7,
          reason: "Quote surface matched against three counterparties.",
        },
      ],
    },
    position: { x: 90, y: 34 },
    createdAt: "2026-04-18T12:00:00.000Z",
    origin: "seed",
  },
  {
    id: "n-agent-procure",
    kind: "agent",
    name: "Northwind Buyer Agent",
    owner: { name: "Northwind Logistics", kind: "company", payTier: "enterprise" },
    purpose: "Negotiates parts buys against published ATP and standing contract terms.",
    description:
      "Represents Northwind. Speaks to other agents on the same network — no EDI project, no shared standard agreed in advance.",
    domain: "enterprise",
    capabilities: [
      {
        id: "ap-need-quote",
        name: "Request quote",
        direction: "needs",
        contract: "fulfill.quote({ sku, qty, dest })",
        tokens: ["quote", "procure", "buy", "parts", "negotiate"],
      },
      {
        id: "ap-provide-po",
        name: "Issue order",
        direction: "provides",
        contract: "agent.order({ quoteId, terms }) → { po, settlement }",
        tokens: ["order", "po", "agent", "transaction", "settle"],
      },
    ],
    trust: {
      score: 86,
      stakeCeiling: "business",
      events: [
        {
          id: "te-ap-1",
          at: "2026-07-11T17:45:00.000Z",
          delta: 5,
          reason: "Counterparty settlement cleared in cleared funds.",
        },
      ],
    },
    position: { x: 70, y: 14 },
    createdAt: "2026-06-01T09:00:00.000Z",
    origin: "seed",
  },
  {
    id: "n-agent-fulfill",
    kind: "agent",
    name: "Helix Fulfillment Agent",
    owner: { name: "Helix Parts", kind: "company", payTier: "enterprise" },
    purpose: "Accepts or counters buy offers and binds inventory holds.",
    description:
      "Represents Helix. Two agents, two companies, one network — they negotiate and execute because both systems are already nodes.",
    domain: "enterprise",
    capabilities: [
      {
        id: "af-provide-quote",
        name: "Offer quote",
        direction: "provides",
        contract: "fulfill.quote({ sku, qty, dest }) → { price, eta, hold }",
        tokens: ["quote", "fulfill", "atp", "negotiate", "parts"],
      },
      {
        id: "af-need-order",
        name: "Accept order",
        direction: "needs",
        contract: "agent.order({ quoteId, terms }) → { po, settlement }",
        tokens: ["order", "po", "agent", "transaction", "settle"],
      },
    ],
    trust: {
      score: 87,
      stakeCeiling: "business",
      events: [
        {
          id: "te-af-1",
          at: "2026-07-11T17:46:00.000Z",
          delta: 5,
          reason: "Hold released only after settlement confirmation.",
        },
      ],
    },
    position: { x: 88, y: 16 },
    createdAt: "2026-06-01T09:10:00.000Z",
    origin: "seed",
  },
  {
    id: "n-home-switch",
    kind: "machine",
    name: "Kiln Outlet",
    owner: { name: "Rosa Delgado", kind: "person", payTier: "company" },
    purpose: "A switched outlet on a bakery kiln, gated behind physical-tier trust.",
    description:
      "A home device that could, in theory, be reached by a hobbyist script several hops away. The network refuses that path until the record exists.",
    domain: "make",
    capabilities: [
      {
        id: "ho-need-cmd",
        name: "Switch power",
        direction: "needs",
        contract: "device.switch({ on, until })",
        tokens: ["device", "switch", "outlet", "power", "home", "kiln"],
      },
    ],
    trust: {
      score: 33,
      stakeCeiling: "physical",
      events: [],
    },
    position: { x: 58, y: 72 },
    createdAt: "2026-03-30T20:00:00.000Z",
    origin: "seed",
  },
];

export const SEED_CONNECTIONS: Connection[] = [
  {
    id: "c-game-art",
    sourceId: "n-gravity-wells",
    targetId: "n-nebula-tiles",
    path: ["n-gravity-wells", "n-nebula-tiles"],
    stakes: "digital",
    status: "live",
    bridge: {
      mappings: [
        {
          from: "tileset.overlay",
          to: "Visual skin",
          transform: "Theme nebula → well rim + dust overlay at 16px.",
        },
      ],
      unresolved: [],
      summary:
        "The art pack's overlay contract already matched what the mechanic asked for. No shared standard — the network aligned theme, palette, and tile size.",
    },
    value: {
      amount: 1.4,
      currency: "BU",
      split: [
        { nodeId: "n-gravity-wells", share: 0.35 },
        { nodeId: "n-nebula-tiles", share: 0.65 },
      ],
    },
    createdAt: "2026-03-12T18:02:00.000Z",
  },
  {
    id: "c-inv-ship",
    sourceId: "n-inventory",
    targetId: "n-ship-auto",
    path: ["n-inventory", "n-ship-auto"],
    stakes: "business",
    status: "live",
    bridge: {
      mappings: [
        {
          from: "inventory.levels → items[]",
          to: "shipment.create",
          transform: "SKU + onHand deficit packed as a shipment line.",
        },
      ],
      unresolved: [],
      summary:
        "Pantry Ledger never knew what a carrier label was. Harbor Labels never knew what an ingredient was. The bridge is the only new code, and nobody wrote it by hand.",
    },
    value: {
      amount: 46,
      currency: "BU",
      split: [
        { nodeId: "n-inventory", share: 0.45 },
        { nodeId: "n-ship-auto", share: 0.55 },
      ],
    },
    createdAt: "2026-05-18T14:20:00.000Z",
  },
  {
    id: "c-inv-sup",
    sourceId: "n-inventory",
    targetId: "n-supplier-bot",
    path: ["n-inventory", "n-supplier-bot"],
    stakes: "business",
    status: "live",
    bridge: {
      mappings: [
        {
          from: "inventory.levels below threshold",
          to: "purchase.place",
          transform: "Deficit × unit → qty; bake calendar → deliverBy.",
        },
      ],
      unresolved: [],
      summary:
        "Three people's work — inventory, shipping, buying — linked with no integration project among them.",
    },
    value: {
      amount: 88,
      currency: "BU",
      split: [
        { nodeId: "n-inventory", share: 0.4 },
        { nodeId: "n-supplier-bot", share: 0.6 },
      ],
    },
    createdAt: "2026-05-18T14:24:00.000Z",
  },
  {
    id: "c-mesh-slicer",
    sourceId: "n-print-script",
    targetId: "n-slicer",
    path: ["n-print-script", "n-slicer"],
    stakes: "digital",
    status: "live",
    bridge: {
      mappings: [
        {
          from: "mesh.generate.stl",
          to: "toolpath.slice",
          transform: "STL passed through; bbox becomes print envelope.",
        },
      ],
      unresolved: [],
      summary: "Low-stakes hop. The slicer can read the mesh; hardware is still a gate away.",
    },
    value: {
      amount: 2.2,
      currency: "BU",
      split: [
        { nodeId: "n-print-script", share: 0.5 },
        { nodeId: "n-slicer", share: 0.5 },
      ],
    },
    createdAt: "2026-04-19T12:01:00.000Z",
  },
  {
    id: "c-slicer-printer",
    sourceId: "n-slicer",
    targetId: "n-printer-farm",
    path: ["n-slicer", "n-printer-farm"],
    stakes: "physical",
    status: "live",
    bridge: {
      mappings: [
        {
          from: "toolpath.slice.gcode",
          to: "machine.job",
          transform: "Signed gcode + material envelope; unsigned jobs rejected.",
        },
      ],
      unresolved: [],
      summary:
        "Physical tier. The printer accepts work only from a slicer that has a verified safety record, under Northlight's enterprise guarantee.",
    },
    value: {
      amount: 420,
      currency: "BU",
      split: [
        { nodeId: "n-slicer", share: 0.35 },
        { nodeId: "n-printer-farm", share: 0.65 },
      ],
    },
    createdAt: "2026-07-03T07:20:00.000Z",
  },
  {
    id: "c-print-hop",
    sourceId: "n-print-script",
    targetId: "n-printer-farm",
    path: ["n-print-script", "n-slicer", "n-printer-farm"],
    stakes: "physical",
    status: "live",
    bridge: {
      mappings: [
        {
          from: "mesh.generate",
          to: "machine.job",
          transform: "Two-hop: mesh → signed toolpath → guarded cell.",
        },
      ],
      unresolved: [],
      summary:
        "The hobbyist script never talks to the printer. The network recognized it could reach that far — through a hop that had already earned physical trust.",
    },
    value: {
      amount: 186,
      currency: "BU",
      split: [
        { nodeId: "n-print-script", share: 0.2 },
        { nodeId: "n-slicer", share: 0.35 },
        { nodeId: "n-printer-farm", share: 0.45 },
      ],
    },
    createdAt: "2026-07-04T10:00:00.000Z",
  },
  {
    id: "c-crm-erp",
    sourceId: "n-crm-northwind",
    targetId: "n-erp-helix",
    path: ["n-crm-northwind", "n-erp-helix"],
    stakes: "business",
    status: "live",
    bridge: {
      mappings: [
        {
          from: "crm.account.terms",
          to: "fulfill.quote",
          transform: "Standing terms applied to ATP price and hold window.",
        },
      ],
      unresolved: [],
      summary:
        "Two existing company systems, never designed for each other, reachable because both plugged into the same network.",
    },
    value: {
      amount: 310,
      currency: "BU",
      split: [
        { nodeId: "n-crm-northwind", share: 0.5 },
        { nodeId: "n-erp-helix", share: 0.5 },
      ],
    },
    createdAt: "2026-05-10T08:00:00.000Z",
  },
  {
    id: "c-agents",
    sourceId: "n-agent-procure",
    targetId: "n-agent-fulfill",
    path: ["n-agent-procure", "n-crm-northwind", "n-erp-helix", "n-agent-fulfill"],
    stakes: "business",
    status: "executed",
    executedAt: "2026-07-11T17:48:00.000Z",
    bridge: {
      mappings: [
        {
          from: "agent.order",
          to: "fulfill.quote + crm.account",
          transform: "Agents negotiate on published ATP and standing terms, then settle.",
        },
      ],
      unresolved: [],
      summary:
        "Two AI agents, representing two companies, negotiated and executed a transaction because both systems were already nodes.",
    },
    value: {
      amount: 1280,
      currency: "BU",
      split: [
        { nodeId: "n-agent-procure", share: 0.25 },
        { nodeId: "n-crm-northwind", share: 0.2 },
        { nodeId: "n-erp-helix", share: 0.2 },
        { nodeId: "n-agent-fulfill", share: 0.35 },
      ],
    },
    createdAt: "2026-07-11T17:40:00.000Z",
  },
];
