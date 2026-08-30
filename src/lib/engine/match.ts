import type { Capability, MatchScore, NetworkNode } from "../types";
import { tokenizeForMatch } from "./understand";

function tokenSet(node: NetworkNode): Set<string> {
  const bits = [
    node.name,
    node.purpose,
    node.domain,
    node.kind,
    ...node.capabilities.flatMap((c) => [c.name, c.contract, ...c.tokens]),
  ];
  return new Set(tokenizeForMatch(bits.join(" ")));
}

function overlap(a: Set<string>, b: Set<string>): string[] {
  return [...a].filter((t) => b.has(t) && t.length > 2);
}

function complements(a: Capability, b: Capability): boolean {
  if (a.direction === b.direction) return false;
  const at = new Set(a.tokens.map((t) => t.toLowerCase()));
  const bt = new Set(b.tokens.map((t) => t.toLowerCase()));
  const shared = [...at].filter((t) => bt.has(t));
  if (shared.length >= 1) return true;
  const aContract = a.contract.toLowerCase();
  const bName = b.name.toLowerCase();
  return aContract.includes(bName.split(" ")[0] ?? "___never");
}

export function scoreMatch(query: NetworkNode, candidate: NetworkNode): MatchScore {
  const reasons: string[] = [];
  let score = 0;
  const complementary: MatchScore["complementary"] = [];

  if (query.id === candidate.id) {
    return { node: candidate, score: 0, reasons: ["Same node"], complementary };
  }

  if (query.domain === candidate.domain) {
    score += 18;
    reasons.push(`Same domain: ${query.domain}`);
  }

  const shared = overlap(tokenSet(query), tokenSet(candidate));
  score += Math.min(24, shared.length * 3);
  if (shared.length) reasons.push(`Meaning overlap: ${shared.slice(0, 5).join(", ")}`);

  for (const ours of query.capabilities) {
    for (const theirs of candidate.capabilities) {
      if (complements(ours, theirs)) {
        score += 28;
        complementary.push({ ours, theirs });
        reasons.push(
          `${ours.direction === "needs" ? "Needs" : "Provides"} “${ours.name}” ↔ ${theirs.direction} “${theirs.name}”`,
        );
      }
    }
  }

  if (query.kind !== candidate.kind) {
    score += 6;
    reasons.push("Different kinds — a likely bridge, not a duplicate.");
  }

  const trustGap = Math.abs(query.trust.score - candidate.trust.score);
  if (trustGap < 25) {
    score += 4;
  }

  return {
    node: candidate,
    score: Math.min(100, score),
    reasons,
    complementary,
  };
}

export function rankMatches(query: NetworkNode, nodes: NetworkNode[], limit = 6): MatchScore[] {
  return nodes
    .map((n) => scoreMatch(query, n))
    .filter((m) => m.score >= 12)
    .sort((a, b) => b.score - a.score)
    .slice(0, limit);
}

export function findPath(
  source: NetworkNode,
  target: NetworkNode,
  nodes: NetworkNode[],
): string[] | null {
  if (source.id === target.id) return [source.id];
  const byId = new Map(nodes.map((n) => [n.id, n]));
  const scored = nodes
    .filter((n) => n.id !== source.id && n.id !== target.id)
    .map((mid) => {
      const a = scoreMatch(source, mid).score;
      const b = scoreMatch(mid, target).score;
      return { mid, score: a + b, a, b };
    })
    .filter((x) => x.a >= 16 && x.b >= 16)
    .sort((x, y) => y.score - x.score);

  const direct = scoreMatch(source, target);
  if (direct.score >= 20 || direct.complementary.length > 0) {
    return [source.id, target.id];
  }
  const hop = scored[0];
  if (hop && byId.has(hop.mid.id)) {
    return [source.id, hop.mid.id, target.id];
  }
  if (direct.score >= 10) return [source.id, target.id];
  return null;
}
