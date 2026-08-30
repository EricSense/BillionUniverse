import type { Bridge, Connection, Mapping, NetworkNode, StakeLevel } from "../types";
import { uid, nowIso } from "../ids";
import { findPath, scoreMatch } from "./match";
import { evaluateGate, inferConnectionStakes } from "./trust";
import { priceConnection, splitValue } from "./value";

function buildBridge(source: NetworkNode, target: NetworkNode, path: NetworkNode[]): Bridge {
  const match = scoreMatch(source, target);
  const mappings: Mapping[] = match.complementary.map((pair) => ({
    from: pair.ours.contract,
    to: pair.theirs.contract,
    transform: `Read “${pair.ours.name}” as “${pair.theirs.name}” — ${pair.ours.direction} meets ${pair.theirs.direction}.`,
  }));

  if (path.length > 2) {
    mappings.push({
      from: source.capabilities[0]?.contract ?? source.purpose,
      to: target.capabilities[0]?.contract ?? target.purpose,
      transform: `Via ${path
        .slice(1, -1)
        .map((n) => n.name)
        .join(" → ")}. Each hop is translated independently.`,
    });
  }

  if (mappings.length === 0) {
    mappings.push({
      from: source.purpose,
      to: target.purpose,
      transform: "Purpose-level alignment. Interfaces will be specialized on first execution.",
    });
  }

  const unresolved: string[] = [];
  const sourceNeeds = source.capabilities.filter((c) => c.direction === "needs");
  for (const need of sourceNeeds) {
    const met = path.some((n) =>
      n.capabilities.some(
        (c) => c.direction === "provides" && c.tokens.some((t) => need.tokens.includes(t)),
      ),
    );
    if (!met) unresolved.push(`Still open: ${need.name} (${need.contract})`);
  }

  const hopNote =
    path.length > 2
      ? ` The path runs ${path.map((n) => n.name).join(" → ")}.`
      : "";

  return {
    mappings,
    unresolved,
    summary: `AI read both interfaces and built a bridge between ${source.name} and ${target.name} without a shared standard.${hopNote}`,
  };
}

export function proposeConnection(source: NetworkNode, target: NetworkNode, nodes: NetworkNode[]): Connection {
  const stakes: StakeLevel = inferConnectionStakes(source, target);
  const ids = findPath(source, target, nodes) ?? [source.id, target.id];
  const pathNodes = ids
    .map((id) => nodes.find((n) => n.id === id))
    .filter((n): n is NetworkNode => Boolean(n));
  const gate = evaluateGate(source, target, stakes);
  const amount = priceConnection(source, target, ids, stakes);
  const value = splitValue(ids, amount, nodes);
  const bridge = buildBridge(source, target, pathNodes);

  return {
    id: uid("c"),
    sourceId: source.id,
    targetId: target.id,
    path: ids,
    stakes,
    status: gate.allowed ? "proposed" : "blocked",
    bridge,
    value,
    blockedReason: gate.allowed ? undefined : gate.missing.join(" "),
    createdAt: nowIso(),
  };
}

export { evaluateGate };
