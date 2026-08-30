"use client";

import { useSyncExternalStore } from "react";
import { IDENTITY_COLORS, type CollabMessage, type Identity, type PresenceUser, type Universe } from "./types";
import { pick, uid } from "./id";
import { templateAurora, templateOrb } from "./templates";

const STORAGE_KEY = "billion-universe:v1";
const CHANNEL = "billion-universe";

type PersistShape = {
  identity: Identity;
  universes: Universe[];
};

type Store = {
  identity: Identity;
  universes: Universe[];
  presence: PresenceUser[];
};

const listeners = new Set<() => void>();
let channel: BroadcastChannel | null = null;
let primed = false;

function guessDevice(): string {
  if (typeof navigator === "undefined") return "browser";
  const ua = navigator.userAgent;
  if (/Mobi|Android/i.test(ua)) return "phone";
  if (/Tablet|iPad/i.test(ua)) return "tablet";
  return "laptop";
}

function randomName(): string {
  const a = ["Orion", "Lyra", "Vega", "Nova", "Io", "Kepler", "Atlas", "Rhea", "Nyx", "Sol"];
  const b = ["4", "7", "9", "12", "21", "3"];
  return `${pick(a)}-${pick(b)}`;
}

function defaultIdentity(): Identity {
  return {
    id: uid("you"),
    name: randomName(),
    color: pick(IDENTITY_COLORS),
    device: guessDevice(),
  };
}

function load(): PersistShape {
  if (typeof window === "undefined") {
    return { identity: defaultIdentity(), universes: [] };
  }
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    if (!raw) {
      const identity = defaultIdentity();
      const universes = [templateOrb(), templateAurora()];
      const data = { identity, universes };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
      return data;
    }
    const parsed = JSON.parse(raw) as PersistShape;
    if (!parsed.identity || !Array.isArray(parsed.universes)) throw new Error("bad");
    parsed.identity.device = guessDevice();
    return parsed;
  } catch {
    const identity = defaultIdentity();
    const universes = [templateOrb(), templateAurora()];
    return { identity, universes };
  }
}

let state: Store = {
  identity: defaultIdentity(),
  universes: [],
  presence: [],
};

function persist() {
  if (typeof window === "undefined") return;
  const data: PersistShape = { identity: state.identity, universes: state.universes };
  localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
}

function emit() {
  for (const l of listeners) l();
}

function broadcast(msg: CollabMessage) {
  channel?.postMessage(msg);
}

export function getStore(): Store {
  return state;
}

export function useClientReady() {
  return useSyncExternalStore(
    () => () => {},
    () => true,
    () => false,
  );
}

export function useStore() {
  const ready = useClientReady();
  if (ready) primeStore();
  return useSyncExternalStore(subscribe, getStore, getStore);
}

export function subscribe(fn: () => void): () => void {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function primeStore() {
  if (primed || typeof window === "undefined") return;
  primed = true;
  const loaded = load();
  state = {
    identity: loaded.identity,
    universes: loaded.universes,
    presence: [
      {
        ...loaded.identity,
        lastSeen: Date.now(),
      },
    ],
  };
  channel = new BroadcastChannel(CHANNEL);
  channel.onmessage = (event: MessageEvent<CollabMessage>) => {
    const msg = event.data;
    if (!msg) return;
    if (msg.type === "hello" || msg.type === "presence") {
      if (msg.user.id === state.identity.id) return;
      const others = state.presence.filter((p) => p.id !== msg.user.id && p.id !== state.identity.id);
      state = {
        ...state,
        presence: [
          { ...state.identity, lastSeen: Date.now() },
          ...others,
          { ...msg.user, lastSeen: Date.now() },
        ],
      };
      emit();
      if (msg.type === "hello") {
        broadcast({
          type: "presence",
          user: { ...state.identity, lastSeen: Date.now() },
        });
      }
    } else if (msg.type === "bye") {
      state = { ...state, presence: state.presence.filter((p) => p.id !== msg.userId) };
      emit();
    } else if (msg.type === "universe.upsert") {
      upsertUniverse(msg.universe, false);
    } else if (msg.type === "universe.delete") {
      deleteUniverse(msg.id, false);
    }
  };
  broadcast({ type: "hello", user: { ...state.identity, lastSeen: Date.now() } });
  window.addEventListener("beforeunload", () => {
    broadcast({ type: "bye", userId: state.identity.id });
  });
}

export function setIdentity(patch: Partial<Identity>) {
  state = { ...state, identity: { ...state.identity, ...patch } };
  persist();
  broadcast({ type: "presence", user: { ...state.identity, lastSeen: Date.now() } });
  emit();
}

export function upsertUniverse(universe: Universe, relay = true) {
  const others = state.universes.filter((u) => u.id !== universe.id);
  state = { ...state, universes: [universe, ...others].sort((a, b) => b.updatedAt - a.updatedAt) };
  persist();
  if (relay) broadcast({ type: "universe.upsert", universe });
  emit();
}

export function deleteUniverse(id: string, relay = true) {
  state = { ...state, universes: state.universes.filter((u) => u.id !== id) };
  persist();
  if (relay) broadcast({ type: "universe.delete", id });
  emit();
}

export function getUniverse(id: string): Universe | undefined {
  return state.universes.find((u) => u.id === id);
}

export function publishPresence(patch: Partial<PresenceUser>) {
  const user: PresenceUser = {
    ...state.identity,
    lastSeen: Date.now(),
    ...patch,
  };
  state = {
    ...state,
    presence: [
      user,
      ...state.presence.filter((p) => p.id !== user.id),
    ],
  };
  broadcast({ type: "presence", user });
  emit();
}

export function importUniverse(raw: string): Universe {
  const parsed = JSON.parse(raw) as Universe;
  if (!parsed?.id || !Array.isArray(parsed.nodes)) {
    throw new Error("Not a Billion Universe snapshot");
  }
  const universe: Universe = {
    ...parsed,
    id: uid("u"),
    updatedAt: Date.now(),
    jobs: parsed.jobs ?? [],
    comments: parsed.comments ?? [],
    promptHistory: parsed.promptHistory ?? [],
  };
  upsertUniverse(universe);
  return universe;
}
