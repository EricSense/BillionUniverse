import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { understand } from "./understand";

describe("understand", () => {
  it("reads a game mechanic as a digital creation", () => {
    const intent = understand("A game mechanic with gravity wells that pull projectiles");
    assert.equal(intent.kind, "creation");
    assert.equal(intent.domain, "games");
    assert.equal(intent.suggestedStakes, "digital");
    assert.ok(intent.capabilities.length >= 1);
  });

  it("reads inventory as a business system", () => {
    const intent = understand("An inventory workflow that tracks ingredient stock and reorders from a supplier");
    assert.equal(intent.kind, "system");
    assert.equal(intent.domain, "commerce");
    assert.equal(intent.suggestedStakes, "business");
  });

  it("reads a printer as a physical machine", () => {
    const intent = understand("A factory 3d printer that runs gcode on hardware");
    assert.equal(intent.kind, "machine");
    assert.equal(intent.suggestedStakes, "physical");
  });

  it("rejects an empty description", () => {
    assert.throws(() => understand("   "), /Describe/);
  });
});
