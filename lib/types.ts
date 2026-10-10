export type Faculty = "sense" | "memory" | "reason" | "make" | "act";

export type TraceStep = {
  faculty: Faculty;
  note: string;
};

export type MemoryItem = {
  id: string;
  key: string;
  value: string;
  at: string;
};

export type ChatTurn = {
  role: "user" | "billion";
  text: string;
  trace?: TraceStep[];
};

export type ThinkResult = {
  reply: string;
  trace: TraceStep[];
  memory: MemoryItem[];
};
