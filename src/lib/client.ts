import type { Connection, NetworkNode, NetworkState, StakeLevel } from "./types";

export async function fetchNetwork(): Promise<NetworkState> {
  const res = await fetch("/api/network", { cache: "no-store" });
  if (!res.ok) throw new Error("Network unreachable.");
  return res.json();
}

export interface UnderstandResult {
  intent: {
    name: string;
    kind: NetworkNode["kind"];
    purpose: string;
    domain: string;
    description: string;
    suggestedStakes: StakeLevel;
    capabilities: NetworkNode["capabilities"];
  };
  preview: NetworkNode;
  matches: {
    id: string;
    name: string;
    kind: NetworkNode["kind"];
    owner: string;
    score: number;
    reasons: string[];
    purpose: string;
  }[];
  error?: string;
}

export async function understandDescription(description: string): Promise<UnderstandResult> {
  const res = await fetch("/api/understand", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ description }),
  });
  return res.json();
}

export async function createNode(input: {
  description: string;
  ownerName?: string;
  payTier?: NetworkNode["owner"]["payTier"];
  ownerKind?: NetworkNode["owner"]["kind"];
}): Promise<{ node: NetworkNode; state: NetworkState; error?: string }> {
  const res = await fetch("/api/nodes", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  return res.json();
}

export async function proposeBridge(from: string, to: string, persist = true) {
  const res = await fetch("/api/connect", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ from, to, persist }),
  });
  return res.json() as Promise<{
    connection: Connection;
    gate: { allowed: boolean; reason: string; required: StakeLevel; missing: string[] };
    error?: string;
  }>;
}

export async function runConnection(connectionId: string) {
  const res = await fetch("/api/execute", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ connectionId }),
  });
  return res.json();
}
