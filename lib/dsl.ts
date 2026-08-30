import { uid } from "./id";
import type { EdgeKind, NodeKind, UniverseEdge, UniverseNode } from "./types";

const KINDS: NodeKind[] = [
  "page",
  "section",
  "text",
  "button",
  "input",
  "image",
  "data",
  "action",
  "hardware",
];

function isKind(value: string): value is NodeKind {
  return (KINDS as string[]).includes(value);
}

function tokenizeProps(rest: string): Record<string, string> {
  const props: Record<string, string> = {};
  const re = /(\w+)=("([^"]*)"|'([^']*)'|(\S+))/g;
  let m: RegExpExecArray | null;
  while ((m = re.exec(rest))) {
    props[m[1]!] = m[3] ?? m[4] ?? m[5] ?? "";
  }
  return props;
}

function escapeProp(value: string): string {
  if (/[\s="']/.test(value) || value.length === 0) return `"${value.replaceAll('"', '\\"')}"`;
  return value;
}

export function parseDsl(src: string): { nodes: UniverseNode[]; edges: UniverseEdge[] } {
  const nodes: UniverseNode[] = [];
  const edges: UniverseEdge[] = [];
  const stack: { indent: number; id: string }[] = [];
  const lines = src.replace(/\r\n/g, "\n").split("\n");

  lines.forEach((raw, index) => {
    if (!raw.trim() || raw.trim().startsWith("#")) return;
    const indent = raw.match(/^ */)?.[0].length ?? 0;
    if (indent % 2 !== 0) {
      throw new Error(`Line ${index + 1}: indent must be multiples of 2 spaces`);
    }
    const trimmed = raw.trim();
    const match = trimmed.match(/^([a-z]+)\s+([A-Za-z0-9_-]+)(?:\s+(.*))?$/);
    if (!match) {
      throw new Error(`Line ${index + 1}: expected "<kind> <id> key=value..."`);
    }
    const kindRaw = match[1]!;
    if (!isKind(kindRaw)) {
      throw new Error(`Line ${index + 1}: unknown kind "${kindRaw}"`);
    }
    const id = match[2]!;
    const props = tokenizeProps(match[3] ?? "");
    const name = props.name ?? id;
    const x = Number.isFinite(Number(props.x)) ? Number(props.x) : 72 + nodes.length * 28;
    const y = Number.isFinite(Number(props.y)) ? Number(props.y) : 72 + (nodes.length % 6) * 88;

    while (stack.length && stack[stack.length - 1]!.indent >= indent) stack.pop();
    const parent = stack[stack.length - 1];
    const node: UniverseNode = {
      id,
      kind: kindRaw,
      name,
      x,
      y,
      parentId: parent?.id,
      props: Object.fromEntries(
        Object.entries(props).filter(([k]) => k !== "x" && k !== "y" && k !== "name"),
      ),
    };
    nodes.push(node);
    if (parent) {
      edges.push({
        id: `${parent.id}->${id}`,
        from: parent.id,
        to: id,
        kind: "contains",
      });
    }
    stack.push({ indent, id });
  });

  return { nodes, edges };
}

export function serializeDsl(nodes: UniverseNode[], edges: UniverseEdge[]): string {
  const children = new Map<string, string[]>();
  const extraEdges: UniverseEdge[] = [];
  for (const edge of edges) {
    if (edge.kind === "contains") {
      const list = children.get(edge.from) ?? [];
      list.push(edge.to);
      children.set(edge.from, list);
    } else {
      extraEdges.push(edge);
    }
  }
  for (const node of nodes) {
    if (node.parentId) {
      const list = children.get(node.parentId) ?? [];
      if (!list.includes(node.id)) {
        list.push(node.id);
        children.set(node.parentId, list);
      }
    }
  }

  const childIds = new Set([...children.values()].flat());
  const roots = nodes.filter((n) => !childIds.has(n.id));
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const seen = new Set<string>();
  const out: string[] = [
    "# Billion Universe graph — same project the visual builder and the prompt pane write.",
    "# kind id name=... key=value",
    "",
  ];

  function emit(id: string, depth: number) {
    if (seen.has(id)) return;
    const node = byId.get(id);
    if (!node) return;
    seen.add(id);
    const props: string[] = [
      `name=${escapeProp(node.name)}`,
      `x=${Math.round(node.x)}`,
      `y=${Math.round(node.y)}`,
    ];
    for (const [k, v] of Object.entries(node.props)) {
      props.push(`${k}=${escapeProp(v)}`);
    }
    out.push(`${"  ".repeat(depth)}${node.kind} ${node.id} ${props.join(" ")}`);
    for (const child of children.get(id) ?? []) emit(child, depth + 1);
  }

  for (const root of roots) emit(root.id, 0);
  for (const node of nodes) emit(node.id, 0);

  if (extraEdges.length) {
    out.push("", "# edges");
    for (const edge of extraEdges) {
      out.push(`# ${edge.kind} ${edge.from} -> ${edge.to}`);
    }
  }

  return out.join("\n") + "\n";
}

export function addNode(
  nodes: UniverseNode[],
  edges: UniverseEdge[],
  input: {
    kind: NodeKind;
    name?: string;
    parentId?: string;
    x?: number;
    y?: number;
    props?: Record<string, string>;
  },
): { nodes: UniverseNode[]; edges: UniverseEdge[]; node: UniverseNode } {
  const node: UniverseNode = {
    id: uid(input.kind.slice(0, 2)),
    kind: input.kind,
    name: input.name ?? input.kind,
    x: input.x ?? 120 + nodes.length * 16,
    y: input.y ?? 100 + (nodes.length % 5) * 72,
    parentId: input.parentId,
    props: input.props ?? {},
  };
  const nextNodes = [...nodes, node];
  const nextEdges = [...edges];
  if (input.parentId) {
    nextEdges.push({
      id: uid("e"),
      from: input.parentId,
      to: node.id,
      kind: "contains" satisfies EdgeKind,
    });
  }
  return { nodes: nextNodes, edges: nextEdges, node };
}
