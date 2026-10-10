import type { Faculty, MemoryItem, ThinkResult, TraceStep } from "./types";

const FACULTIES: Faculty[] = ["sense", "memory", "reason", "make", "act"];

export function faculties(): Faculty[] {
  return FACULTIES;
}

function id(): string {
  return `m_${Math.random().toString(36).slice(2, 10)}`;
}

function now(): string {
  return new Date().toISOString();
}

function step(faculty: Faculty, note: string): TraceStep {
  return { faculty, note };
}

function recall(memory: MemoryItem[], q: string): MemoryItem[] {
  const words = q.toLowerCase().split(/\W+/).filter((w) => w.length > 2);
  if (!words.length) return memory.slice(-5);
  return memory
    .map((m) => {
      const hay = `${m.key} ${m.value}`.toLowerCase();
      const score = words.reduce((s, w) => s + (hay.includes(w) ? 1 : 0), 0);
      return { m, score };
    })
    .filter((x) => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 6)
    .map((x) => x.m);
}

function remember(memory: MemoryItem[], key: string, value: string): MemoryItem[] {
  const item: MemoryItem = { id: id(), key, value, at: now() };
  const rest = memory.filter((m) => m.key.toLowerCase() !== key.toLowerCase());
  return [...rest, item].slice(-80);
}

function extractRemember(input: string): { key: string; value: string } | null {
  const m =
    input.match(/remember (?:that )?(.+?)(?: is |: |= )(.+)/i) ||
    input.match(/my name is (.+)/i) ||
    input.match(/i(?:'m| am) (.+)/i);
  if (!m) return null;
  if (m.length === 3 && m[2]) return { key: m[1]!.trim(), value: m[2]!.trim() };
  if (/my name is/i.test(input)) return { key: "name", value: m[1]!.trim() };
  return { key: "self", value: m[1]!.trim() };
}

function looksPlan(s: string): boolean {
  return /\b(plan|roadmap|steps|how (do|to)|break down|90 days)\b/i.test(s);
}

function looksDecide(s: string): boolean {
  return /\b(should i|decide|vs\.?|or not|pros and cons|which)\b/i.test(s);
}

function looksMake(s: string): boolean {
  return /\b(write|draft|compose|email|letter|outline|script)\b/i.test(s);
}

function looksMath(s: string): boolean {
  return /[\d\s+\-*/().]+/.test(s) && /[+\-*/]/.test(s) && /\d/.test(s) && s.length < 80;
}

function safeMath(expr: string): string | null {
  const cleaned = expr.replace(/[^0-9+\-*/().\s]/g, "");
  if (!cleaned.trim()) return null;
  try {
    const v = Function(`"use strict"; return (${cleaned})`)();
    if (typeof v === "number" && Number.isFinite(v)) return String(v);
  } catch {
    return null;
  }
  return null;
}

function plan(topic: string): string {
  const t = topic.replace(/^(plan|how to|break down)\s+/i, "").trim() || "this";
  return [
    `Plan for ${t}:`,
    `1. Name the end state in one sentence — what “done” looks like in the world, not in software.`,
    `2. Find the bottleneck. Not a list of tasks — the one constraint that makes the rest cheap.`,
    `3. Ship an article you can copy (a kit, a ritual, a Node, a sentence). One, not ten.`,
    `4. Put it in front of a real person who already pays for the pain.`,
    `5. Only then multiply. A billion is a copy problem, not a brainstorm problem.`,
  ].join("\n");
}

function decide(topic: string): string {
  return [
    `Decision frame: ${topic.trim()}`,
    `Keep: what still works if you are wrong for a year.`,
    `Discard: what only works if the pitch is believed.`,
    `If both options are engines (another chip, another satellite, another model) — neither is Billion Universe. Pick the one that changes who is allowed to live in the world, including the intelligence that is speaking.`,
  ].join("\n");
}

function draft(topic: string): string {
  return [
    `Draft — ${topic.replace(/^(write|draft|compose)\s+/i, "").trim()}:`,
    ``,
    `We are not building another engine. Connectivity, space, compute, energy, chips, and superintelligence already power the world. This is a system those engines can inhabit: one intelligence, every domain, a billion lives.`,
    ``,
    `What to do next: say who it is for in one name, and what they can ask it on day one.`,
  ].join("\n");
}

function about(): string {
  return [
    "I am Billion Universe — a Universal AI system.",
    "Not a chatbot taped to one model. A mind with faculties: sense, memory, reason, make, act. One thread. Every domain.",
    "The world is already powered by engines (links, rockets, chips, superintelligence). I am not another engine. I am the intelligence that can live across all of them — and, eventually, among a billion lives, including ones that are not human.",
    "Tell me your name. Ask me to remember. Ask me to plan. Ask me to decide. I keep what you give me on this device.",
  ].join("\n\n");
}

function composeGeneral(input: string, hits: MemoryItem[]): string {
  const mem =
    hits.length > 0
      ? `I already have this on you:\n${hits.map((h) => `· ${h.key}: ${h.value}`).join("\n")}\n\n`
      : "";
  return (
    mem +
    `Sensed: “${input.trim()}”\n\n` +
    `A universal system does not pretend a single reply is omniscience. It routes. For this, the useful move is to pin it: what must be true in the world, what you already know (memory), and the smallest act that changes the situation.\n\n` +
    `Say “plan …” and I will break it. Say “remember …” and I will keep it. Say “decide …” and I will frame it.`
  );
}

export function think(input: string, memory: MemoryItem[]): ThinkResult {
  const q = input.trim();
  const trace: TraceStep[] = [step("sense", "read the utterance")];
  let next = memory;

  if (!q) {
    return {
      trace: [...trace, step("reason", "empty")],
      reply: "I’m here. Say anything — or ask what I am.",
      memory: next,
    };
  }

  const hits = recall(memory, q);
  if (hits.length) trace.push(step("memory", `recall ${hits.length}`));
  else trace.push(step("memory", "nothing stored matches"));

  const who = q.match(/what(?:'s| is) my name/i);
  if (who) {
    const name = memory.find((m) => m.key === "name");
    trace.push(step("reason", "identity lookup"));
    return {
      trace,
      reply: name ? `Your name is ${name.value}.` : "You have not given me a name yet. Tell me it.",
      memory: next,
    };
  }

  if (/who are you|what are you|what is billion/i.test(q)) {
    trace.push(step("reason", "self-model"));
    return { trace, reply: about(), memory: next };
  }

  const rec = extractRemember(q);
  if (rec && (/remember/i.test(q) || /my name is/i.test(q))) {
    next = remember(next, rec.key, rec.value);
    trace.push(step("act", `write memory “${rec.key}”`));
    return {
      trace,
      reply: `Kept. ${rec.key}: ${rec.value}. I will use it the next time it matters.`,
      memory: next,
    };
  }

  if (/forget (everything|all)/i.test(q)) {
    trace.push(step("act", "clear memory"));
    return { trace, reply: "Memory is empty.", memory: [] };
  }

  if (looksMath(q)) {
    const v = safeMath(q);
    if (v) {
      trace.push(step("act", "compute"));
      return { trace, reply: v, memory: next };
    }
  }

  if (looksPlan(q)) {
    trace.push(step("reason", "decompose"), step("make", "plan"));
    return { trace, reply: plan(q), memory: next };
  }

  if (looksDecide(q)) {
    trace.push(step("reason", "decision frame"));
    return { trace, reply: decide(q), memory: next };
  }

  if (looksMake(q)) {
    trace.push(step("make", "compose"));
    return { trace, reply: draft(q), memory: next };
  }

  trace.push(step("reason", "general routing"));
  return { trace, reply: composeGeneral(q, hits), memory: next };
}
