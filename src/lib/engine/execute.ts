import type { Activity, Connection, NetworkNode, Settlement } from "../types";
import { uid, nowIso } from "../ids";
import { applyTrustDelta } from "./trust";

export interface ExecutionResult {
  connection: Connection;
  nodes: NetworkNode[];
  settlement: Settlement | null;
  activity: Activity[];
}

export function executeConnection(
  connection: Connection,
  nodes: NetworkNode[],
): ExecutionResult {
  if (connection.status === "blocked") {
    return {
      connection,
      nodes,
      settlement: null,
      activity: [
        {
          id: uid("a"),
          kind: "connect",
          text: `Blocked: ${connection.blockedReason}`,
          at: nowIso(),
        },
      ],
    };
  }

  const source = nodes.find((n) => n.id === connection.sourceId);
  const target = nodes.find((n) => n.id === connection.targetId);
  if (!source || !target) {
    throw new Error("Connection endpoints are no longer on the network.");
  }

  const updated = nodes.map((n) => {
    if (n.id === source.id) {
      return applyTrustDelta(n, connection.stakes === "digital" ? 2 : 4, `Live connection to ${target.name}.`);
    }
    if (n.id === target.id) {
      return applyTrustDelta(n, connection.stakes === "digital" ? 2 : 4, `Reached by ${source.name}.`);
    }
    if (connection.path.includes(n.id)) {
      return applyTrustDelta(n, 1, `Hop on ${source.name} → ${target.name}.`);
    }
    return n;
  });

  const live: Connection = {
    ...connection,
    status: "executed",
    executedAt: nowIso(),
  };

  const settlement: Settlement = {
    id: uid("s"),
    connectionId: live.id,
    amount: live.value.amount,
    beneficiaries: live.value.split.map((part) => {
      const node = updated.find((n) => n.id === part.nodeId);
      return {
        owner: node?.owner.name ?? "Unknown",
        nodeId: part.nodeId,
        amount: Math.round(live.value.amount * part.share * 100) / 100,
        reason:
          part.nodeId === source.id
            ? "Origin of the request"
            : part.nodeId === target.id
              ? "Fulfilled the other side"
              : "Hop that made the path possible",
      };
    }),
    createdAt: nowIso(),
  };

  const activity: Activity[] = [
    {
      id: uid("a"),
      kind: "execute",
      text: `Executed ${source.name} → ${target.name} (${connection.stakes}).`,
      at: nowIso(),
      href: `/nodes/${source.id}`,
    },
    {
      id: uid("a"),
      kind: "settle",
      text: `Settled ${live.value.amount} BU across ${settlement.beneficiaries.length} contributors.`,
      at: nowIso(),
      href: "/value",
    },
  ];

  return { connection: live, nodes: updated, settlement, activity };
}
