export type NodeKind = "creation" | "system" | "machine" | "agent";
export type StakeLevel = "digital" | "business" | "physical";
export type PayTier = "individual" | "company" | "enterprise";
export type OwnerKind = "person" | "company";
export type ConnectionStatus = "proposed" | "live" | "blocked" | "executed";
export type ActivityKind = "create" | "connect" | "execute" | "trust" | "settle";
export type CapabilityDirection = "provides" | "needs";

export interface Owner {
  name: string;
  kind: OwnerKind;
  payTier: PayTier;
}

export interface Capability {
  id: string;
  name: string;
  direction: CapabilityDirection;
  contract: string;
  tokens: string[];
}

export interface TrustEvent {
  id: string;
  at: string;
  delta: number;
  reason: string;
}

export interface TrustRecord {
  score: number;
  stakeCeiling: StakeLevel;
  events: TrustEvent[];
}

export interface NetworkNode {
  id: string;
  kind: NodeKind;
  name: string;
  owner: Owner;
  purpose: string;
  description: string;
  domain: string;
  capabilities: Capability[];
  trust: TrustRecord;
  position: { x: number; y: number };
  createdAt: string;
  origin: "seed" | "user";
}

export interface Mapping {
  from: string;
  to: string;
  transform: string;
}

export interface Bridge {
  mappings: Mapping[];
  unresolved: string[];
  summary: string;
}

export interface ValueSplit {
  nodeId: string;
  share: number;
}

export interface ConnectionValue {
  amount: number;
  currency: "BU";
  split: ValueSplit[];
}

export interface Connection {
  id: string;
  sourceId: string;
  targetId: string;
  path: string[];
  stakes: StakeLevel;
  status: ConnectionStatus;
  bridge: Bridge;
  value: ConnectionValue;
  blockedReason?: string;
  createdAt: string;
  executedAt?: string;
}

export interface Beneficiary {
  owner: string;
  nodeId: string;
  amount: number;
  reason: string;
}

export interface Settlement {
  id: string;
  connectionId: string;
  amount: number;
  beneficiaries: Beneficiary[];
  createdAt: string;
}

export interface Activity {
  id: string;
  kind: ActivityKind;
  text: string;
  at: string;
  href?: string;
}

export interface NetworkState {
  nodes: NetworkNode[];
  connections: Connection[];
  settlements: Settlement[];
  activity: Activity[];
}

export interface UnderstoodIntent {
  name: string;
  kind: NodeKind;
  purpose: string;
  domain: string;
  description: string;
  capabilities: Capability[];
  suggestedStakes: StakeLevel;
}

export interface MatchScore {
  node: NetworkNode;
  score: number;
  reasons: string[];
  complementary: { ours: Capability; theirs: Capability }[];
}

export interface PathHop {
  via: NetworkNode[];
  score: number;
}

export const STAKE_RANK: Record<StakeLevel, number> = {
  digital: 0,
  business: 1,
  physical: 2,
};

export const KIND_LABEL: Record<NodeKind, string> = {
  creation: "Creation",
  system: "System",
  machine: "Machine",
  agent: "Agent",
};

export const STAKE_LABEL: Record<StakeLevel, string> = {
  digital: "Digital",
  business: "Business",
  physical: "Physical",
};

export const TIER_LABEL: Record<PayTier, string> = {
  individual: "Individual",
  company: "Company",
  enterprise: "Enterprise",
};
