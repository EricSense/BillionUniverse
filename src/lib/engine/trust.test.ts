import assert from "node:assert/strict";
import { describe, it } from "node:test";
import { SEED_NODES } from "../seed";
import { evaluateGate, inferConnectionStakes } from "./trust";

function node(id: string) {
  const found = SEED_NODES.find((n) => n.id === id);
  assert.ok(found);
  return found;
}

describe("trust", () => {
  it("treats two creations as digital", () => {
    assert.equal(inferConnectionStakes(node("n-gravity-wells"), node("n-nebula-tiles")), "digital");
  });

  it("allows a digital connection without an enterprise", () => {
    const gate = evaluateGate(node("n-gravity-wells"), node("n-nebula-tiles"), "digital");
    assert.equal(gate.allowed, true);
  });

  it("blocks a hobbyist from a home device at physical stakes", () => {
    const gate = evaluateGate(node("n-print-script"), node("n-home-switch"), "physical");
    assert.equal(gate.allowed, false);
    assert.ok(gate.missing.length >= 1);
  });

  it("allows the trusted slicer to reach the enterprise printer", () => {
    const gate = evaluateGate(node("n-slicer"), node("n-printer-farm"), "physical");
    assert.equal(gate.allowed, true);
  });
});
