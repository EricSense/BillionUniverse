import { parseDsl } from "./dsl";
import { uid } from "./id";
import type { Universe } from "./types";

const AURORA = `# Aurora Café — software surface directed from anywhere
page home name="Home" path=/ x=72 y=80
  section hero name="Hero" x=72 y=240
    text headline name="Headline" value="Aurora Café" x=340 y=80
    text sub name="Subhead" as=p value="Coffee, quietly. Order from the table or the other side of the city." x=340 y=180
    button cta name="Order" label="Order ahead" href="#order" x=340 y=280
  section menu name="Menu" x=72 y=430
    text m1 name="Menu title" value="Today" x=340 y=430
    text m2 name="Item" as=p value="Oat cortado · sesame bun · stone fruit." x=340 y=510
  section visit name="Visit" x=72 y=620
    input email name="Email" label="Email for pickup" placeholder="you@domain.com" x=340 y=620
    button send name="Save" label="Save my order" href="#saved" x=340 y=710
`;

const ORB = `# Orb One — one graph, two backends: a product page and a physical print
page pdp name="Product" path=/ x=64 y=72
  section hero name="Hero" x=64 y=240
    text h name="Headline" value="Orb One" x=330 y=72
    text s name="Subhead" as=p value="A desk object designed here, printed in the workshop. Same job envelope." x=330 y=168
    button buy name="Reserve" label="Reserve a print" href="#print" x=330 y=268
  section spec name="Spec" x=64 y=430
    text t name="Spec title" value="40mm · PLA · 18% infill" x=330 y=430
    action fire name="Submit print" fires=workshop-printer x=330 y=520
hardware cube name="Orb shell" device=workshop-printer operation=print object="40mm orb shell" material=PLA x=620 y=120
hardware finish name="Sand & seat" device=rig-01 operation=move object="finish pass" x=620 y=280
`;

function universeFromDsl(
  name: string,
  description: string,
  dsl: string,
): Universe {
  const { nodes, edges } = parseDsl(dsl);
  const now = Date.now();
  return {
    id: uid("u"),
    name,
    description,
    createdAt: now,
    updatedAt: now,
    nodes,
    edges,
    comments: [
      {
        id: uid("c"),
        author: "system",
        color: "#8b7cff",
        body: "Visual, code, and prompt all write this graph. Jobs are how it leaves the room.",
        createdAt: now,
      },
    ],
    jobs: [],
    promptHistory: [],
  };
}

export function templateAurora(): Universe {
  return universeFromDsl(
    "Aurora Café",
    "A software surface — a café page you can direct from a phone and preview anywhere.",
    AURORA,
  );
}

export function templateOrb(): Universe {
  return universeFromDsl(
    "Orb One",
    "One graph, two backends: a product page and a workshop print. Direct ≠ execute.",
    ORB,
  );
}

export function templateBlank(name = "Untitled universe"): Universe {
  const now = Date.now();
  return {
    id: uid("u"),
    name,
    description: "Empty graph. Add nodes visually, as code, or by prompt — then submit a job.",
    createdAt: now,
    updatedAt: now,
    nodes: [],
    edges: [],
    comments: [],
    jobs: [],
    promptHistory: [],
  };
}

export const STARTER_TEMPLATES = [
  {
    id: "aurora",
    name: "Aurora Café",
    kind: "software" as const,
    blurb: "A small site. Visual builder, then drop into code.",
    factory: templateAurora,
  },
  {
    id: "orb",
    name: "Orb One",
    kind: "hardware" as const,
    blurb: "Product page + printer job. The unifying insight in one graph.",
    factory: templateOrb,
  },
  {
    id: "blank",
    name: "Blank graph",
    kind: "software" as const,
    blurb: "Start from zero. Prompt, drag, or type.",
    factory: templateBlank,
  },
];
