import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { emptySeed } from "./store";

describe("seed", () => {
  it("loads the five vision stories as a connected network", () => {
    const state = emptySeed();
    assert.ok(state.nodes.length >= 12);
    assert.ok(state.connections.some((c) => c.id === "c-game-art"));
    assert.ok(state.connections.some((c) => c.id === "c-inv-sup"));
    assert.ok(state.connections.some((c) => c.id === "c-print-hop"));
    assert.ok(state.connections.some((c) => c.id === "c-agents"));
    assert.ok(state.settlements.length >= 1);
  });
});
