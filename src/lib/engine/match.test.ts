import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SEED_NODES } from "../seed";
import { findPath, rankMatches, scoreMatch } from "./match";

function node(id: string) {
  const found = SEED_NODES.find((n) => n.id === id);
  assert.ok(found);
  return found;
}

describe("match", () => {
  it("pairs the game mechanic with the art pack", () => {
    const match = scoreMatch(node("n-gravity-wells"), node("n-nebula-tiles"));
    assert.ok(match.score >= 30);
    assert.ok(match.complementary.length >= 1);
  });

  it("ranks shipping and the supplier bot for inventory", () => {
    const ranked = rankMatches(node("n-inventory"), SEED_NODES);
    const ids = ranked.map((m) => m.node.id);
    assert.ok(ids.includes("n-ship-auto"));
    assert.ok(ids.includes("n-supplier-bot"));
  });

  it("finds a hop from the lattice to the printer", () => {
    const path = findPath(node("n-print-script"), node("n-printer-farm"), SEED_NODES);
    assert.ok(path);
    assert.ok(path.includes("n-slicer") || path.length === 2);
  });
});
