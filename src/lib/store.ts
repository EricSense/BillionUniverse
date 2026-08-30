import { mkdirSync, readFileSync, writeFileSync } from "fs";
import { dirname, join } from "path";
import { SEED_CONNECTIONS, SEED_NODES } from "./seed";
import type { Activity, Connection, NetworkNode, NetworkState, Settlement } from "./types";
import { nowIso, uid } from "./ids";

const DATA_PATH = join(process.cwd(), ".data", "network.json");

function seedActivity(): Activity[] {
  return [
    {
      id: "a-seed-1",
      kind: "connect",
      text: "Nebula Tile Pack dropped into Gravity Wells — no shared standard.",
      at: "2026-03-12T18:02:00.000Z",
      href: "/nodes/n-gravity-wells",
    },
    {
      id: "a-seed-2",
      kind: "connect",
      text: "Pantry Ledger linked to Harbor Labels and Millrun Buyer.",
      at: "2026-05-18T14:24:00.000Z",
      href: "/nodes/n-inventory",
    },
    {
      id: "a-seed-3",
      kind: "execute",
      text: "Lattice Generator reached Northlight Printer 04 in two hops.",
      at: "2026-07-04T10:00:00.000Z",
      href: "/nodes/n-print-script",
    },
    {
      id: "a-seed-4",
      kind: "settle",
      text: "Northwind and Helix agents settled a parts buy — 1,280 BU.",
      at: "2026-07-11T17:48:00.000Z",
      href: "/value",
    },
  ];
}

function seedSettlements(): Settlement[] {
  const agent = SEED_CONNECTIONS.find((c) => c.id === "c-agents");
  if (!agent) return [];
  return [
    {
      id: "s-agents",
      connectionId: agent.id,
      amount: agent.value.amount,
      beneficiaries: agent.value.split.map((part) => {
        const node = SEED_NODES.find((n) => n.id === part.nodeId);
        return {
          owner: node?.owner.name ?? "Unknown",
          nodeId: part.nodeId,
          amount: Math.round(agent.value.amount * part.share * 100) / 100,
          reason: "Agent-negotiated transaction",
        };
      }),
      createdAt: agent.executedAt ?? agent.createdAt,
    },
  ];
}

export function emptySeed(): NetworkState {
  return {
    nodes: SEED_NODES,
    connections: SEED_CONNECTIONS,
    settlements: seedSettlements(),
    activity: seedActivity(),
  };
}

function readState(): NetworkState {
  try {
    const raw = readFileSync(DATA_PATH, "utf8");
    const parsed = JSON.parse(raw) as NetworkState;
    if (!Array.isArray(parsed.nodes) || parsed.nodes.length === 0) return emptySeed();
    return parsed;
  } catch {
    return emptySeed();
  }
}

function writeState(state: NetworkState): void {
  mkdirSync(dirname(DATA_PATH), { recursive: true });
  writeFileSync(DATA_PATH, JSON.stringify(state, null, 2));
}

export function getState(): NetworkState {
  return readState();
}

export function resetState(): NetworkState {
  const seeded = emptySeed();
  writeState(seeded);
  return seeded;
}

export function saveState(state: NetworkState): NetworkState {
  writeState(state);
  return state;
}

export function getNode(id: string): NetworkNode | undefined {
  return getState().nodes.find((n) => n.id === id);
}

export function upsertNode(node: NetworkNode): NetworkState {
  const state = getState();
  const index = state.nodes.findIndex((n) => n.id === node.id);
  const nodes = index === -1 ? [...state.nodes, node] : state.nodes.map((n) => (n.id === node.id ? node : n));
  const activity: Activity = {
    id: uid("a"),
    kind: "create",
    text: `${node.owner.name} plugged in ${node.name}.`,
    at: nowIso(),
    href: `/nodes/${node.id}`,
  };
  return saveState({
    ...state,
    nodes,
    activity: [activity, ...state.activity].slice(0, 40),
  });
}

export function addConnection(connection: Connection): NetworkState {
  const state = getState();
  const activity: Activity = {
    id: uid("a"),
    kind: "connect",
    text:
      connection.status === "blocked"
        ? `Held ${connection.sourceId} → ${connection.targetId}: trust gate.`
        : `Bridged a ${connection.stakes} path (${connection.path.length} nodes).`,
    at: nowIso(),
    href: `/connect?from=${connection.sourceId}&to=${connection.targetId}`,
  };
  return saveState({
    ...state,
    connections: [connection, ...state.connections],
    activity: [activity, ...state.activity].slice(0, 40),
  });
}

export function replaceConnection(connection: Connection, nodes: NetworkNode[], settlements: Settlement[], extra: Activity[]): NetworkState {
  const state = getState();
  return saveState({
    nodes,
    connections: state.connections.map((c) => (c.id === connection.id ? connection : c)),
    settlements: [...settlements, ...state.settlements].slice(0, 80),
    activity: [...extra, ...state.activity].slice(0, 40),
  });
}

export function placeUserNode(existing: NetworkNode[]): { x: number; y: number } {
  const taken = existing.map((n) => n.position);
  for (let attempt = 0; attempt < 40; attempt += 1) {
    const x = 12 + ((attempt * 17) % 76);
    const y = 16 + ((attempt * 23) % 70);
    const clash = taken.some((p) => Math.hypot(p.x - x, p.y - y) < 8);
    if (!clash) return { x, y };
  }
  return { x: 50, y: 50 };
}
