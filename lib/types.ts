export type NodeKind =
  | "page"
  | "section"
  | "text"
  | "button"
  | "input"
  | "image"
  | "data"
  | "action"
  | "hardware";

export type EdgeKind = "contains" | "triggers" | "feeds";

export type UniverseNode = {
  id: string;
  kind: NodeKind;
  name: string;
  x: number;
  y: number;
  parentId?: string;
  props: Record<string, string>;
};

export type UniverseEdge = {
  id: string;
  from: string;
  to: string;
  kind: EdgeKind;
};

export type Comment = {
  id: string;
  nodeId?: string;
  author: string;
  color: string;
  body: string;
  createdAt: number;
};

export type JobStatus = "queued" | "running" | "succeeded" | "failed" | "canceled";

export type JobLog = {
  t: number;
  level: "info" | "warn" | "error" | "ok";
  message: string;
};

export type BackendKind = "software" | "hardware";

export type BackendId =
  | "live-preview"
  | "cloud-build"
  | "workshop-printer"
  | "robotics-rig"
  | "lab-instrument";

export type Job = {
  id: string;
  backendId: BackendId;
  title: string;
  status: JobStatus;
  submittedAt: number;
  startedAt?: number;
  finishedAt?: number;
  directedFrom: string;
  logs: JobLog[];
  result?: {
    html?: string;
    bytes?: number;
    summary?: string;
    telemetry?: Record<string, number | string>;
  };
};

export type PromptTurn = {
  id: string;
  role: "user" | "system";
  text: string;
  t: number;
};

export type Universe = {
  id: string;
  name: string;
  description: string;
  createdAt: number;
  updatedAt: number;
  nodes: UniverseNode[];
  edges: UniverseEdge[];
  comments: Comment[];
  jobs: Job[];
  promptHistory: PromptTurn[];
};

export type Identity = {
  id: string;
  name: string;
  color: string;
  device: string;
};

export type PresenceUser = Identity & {
  universeId?: string;
  cursor?: { x: number; y: number };
  mode?: StudioMode;
  lastSeen: number;
};

export type StudioMode = "visual" | "code" | "prompt";

export type CollabMessage =
  | { type: "hello"; user: PresenceUser }
  | { type: "bye"; userId: string }
  | { type: "presence"; user: PresenceUser }
  | { type: "universe.upsert"; universe: Universe }
  | { type: "universe.delete"; id: string };

export const BACKENDS: {
  id: BackendId;
  kind: BackendKind;
  label: string;
  blurb: string;
  where: string;
}[] = [
  {
    id: "live-preview",
    kind: "software",
    label: "Live preview",
    blurb: "Compile the graph into a sandboxed preview. Runs next to you.",
    where: "this browser",
  },
  {
    id: "cloud-build",
    kind: "software",
    label: "Cloud build",
    blurb: "Submit the same graph to a remote compute job. You direct; the cloud executes.",
    where: "cloud",
  },
  {
    id: "workshop-printer",
    kind: "hardware",
    blurb: "Route a print job to a remote fabricator. Status streams back here.",
    label: "Workshop printer",
    where: "hardware",
  },
  {
    id: "robotics-rig",
    kind: "hardware",
    label: "Robotics rig",
    blurb: "A motion sequence for a remote arm. Same job envelope as a software build.",
    where: "hardware",
  },
  {
    id: "lab-instrument",
    kind: "hardware",
    label: "Lab instrument",
    blurb: "Queue a protocol on a remote instrument. Direct from anywhere.",
    where: "hardware",
  },
];

export const NODE_META: Record<
  NodeKind,
  { label: string; hint: string; accent: string }
> = {
  page: { label: "Page", hint: "A surface people land on", accent: "#8b7cff" },
  section: { label: "Section", hint: "A region inside a page", accent: "#5ce1e6" },
  text: { label: "Text", hint: "Headline, body, or label", accent: "#f4f1ea" },
  button: { label: "Button", hint: "A thing people press", accent: "#d6ff4b" },
  input: { label: "Input", hint: "Collect a value", accent: "#ffb020" },
  image: { label: "Image", hint: "A visual frame", accent: "#ff6b9d" },
  data: { label: "Data", hint: "A source the graph can read", accent: "#7dffb3" },
  action: { label: "Action", hint: "Something that fires a job", accent: "#ff8a5b" },
  hardware: { label: "Hardware", hint: "A physical execution target", accent: "#c9a8ff" },
};

export const IDENTITY_COLORS = [
  "#d6ff4b",
  "#8b7cff",
  "#5ce1e6",
  "#ff6b9d",
  "#ffb020",
  "#7dffb3",
];
