import type { NetworkNode, PayTier, StakeLevel } from "../types";
import { STAKE_RANK } from "../types";

export function ceilingFromScore(score: number): StakeLevel {
  if (score >= 75) return "physical";
  if (score >= 40) return "business";
  return "digital";
}

export function canReachStake(node: NetworkNode, stakes: StakeLevel): boolean {
  return STAKE_RANK[node.trust.stakeCeiling] >= STAKE_RANK[stakes];
}

export function inferConnectionStakes(a: NetworkNode, b: NetworkNode): StakeLevel {
  const kinds = [a.kind, b.kind];
  if (kinds.includes("machine")) return "physical";
  if (kinds.includes("system") || kinds.includes("agent") || a.owner.kind === "company" || b.owner.kind === "company") {
    return "business";
  }
  return "digital";
}

export interface TrustGate {
  allowed: boolean;
  reason: string;
  required: StakeLevel;
  missing: string[];
}

function hasEnterprise(a: NetworkNode, b: NetworkNode): boolean {
  return a.owner.payTier === "enterprise" || b.owner.payTier === "enterprise";
}

export function evaluateGate(source: NetworkNode, target: NetworkNode, stakes: StakeLevel): TrustGate {
  const missing: string[] = [];

  if (stakes === "physical") {
    if (!hasEnterprise(source, target)) {
      missing.push("An enterprise guarantee must stand behind any path that reaches a machine.");
    }
    for (const node of [source, target]) {
      if (node.kind === "machine" && node.trust.score < 75) {
        missing.push(`${node.name} has not proven a physical-tier record yet (${node.trust.score}/75).`);
      }
      if (node.kind !== "machine" && node.trust.score < 55) {
        missing.push(`${node.name} needs a stronger record before it can reach hardware (${node.trust.score}/55).`);
      }
    }
  }

  if (stakes === "business") {
    for (const node of [source, target]) {
      const companyLike: PayTier[] = ["company", "enterprise"];
      if (node.trust.score < 40 && !companyLike.includes(node.owner.payTier)) {
        missing.push(`${node.name} is below the business trust floor (${node.trust.score}/40).`);
      }
    }
  }

  if (!canReachStake(source, stakes) && stakes !== "digital") {
    missing.push(
      `${source.name} is capped at ${source.trust.stakeCeiling} connections until its record grows.`,
    );
  }
  if (!canReachStake(target, stakes) && stakes !== "digital" && target.kind === "machine") {
    missing.push(`${target.name} only accepts connections at or below ${target.trust.stakeCeiling}.`);
  }

  const allowed = missing.length === 0;
  return {
    allowed,
    reason: allowed
      ? `Trust holds for a ${stakes} connection.`
      : "The network will not make this connection yet.",
    required: stakes,
    missing,
  };
}

export function applyTrustDelta(node: NetworkNode, delta: number, reason: string): NetworkNode {
  const score = Math.max(0, Math.min(100, node.trust.score + delta));
  return {
    ...node,
    trust: {
      score,
      stakeCeiling: ceilingFromScore(score),
      events: [
        {
          id: `te-${Date.now().toString(36)}`,
          at: new Date().toISOString(),
          delta,
          reason,
        },
        ...node.trust.events,
      ].slice(0, 12),
    },
  };
}
