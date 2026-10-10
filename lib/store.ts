import type { ChatTurn, MemoryItem } from "./types";

const K_MEM = "bu.memory.v1";
const K_CHAT = "bu.chat.v1";

export function loadMemory(): MemoryItem[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(K_MEM) || "[]") as MemoryItem[];
  } catch {
    return [];
  }
}

export function saveMemory(m: MemoryItem[]): void {
  window.localStorage.setItem(K_MEM, JSON.stringify(m));
}

export function loadChat(): ChatTurn[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(window.localStorage.getItem(K_CHAT) || "[]") as ChatTurn[];
  } catch {
    return [];
  }
}

export function saveChat(c: ChatTurn[]): void {
  window.localStorage.setItem(K_CHAT, JSON.stringify(c.slice(-80)));
}
