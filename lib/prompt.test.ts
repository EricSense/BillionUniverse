import { describe, expect, it } from "vitest";
import { interpretPrompt } from "./prompt";
import { templateBlank } from "./templates";

describe("prompt", () => {
  it("builds a landing page onto the shared graph", () => {
    const blank = templateBlank("Test");
    const { ops } = interpretPrompt("Make a landing page for a studio called Northwind", blank);
    const next = ops.reduce((u, op) => op.apply(u), blank);
    expect(next.nodes.some((n) => n.kind === "page")).toBe(true);
    expect(next.nodes.some((n) => n.props.value === "Northwind")).toBe(true);
    expect(next.nodes.some((n) => n.kind === "button")).toBe(true);
  });

  it("adds a hardware print node from natural language", () => {
    const blank = templateBlank("Test");
    const { ops } = interpretPrompt("print a 40mm cube on the workshop printer", blank);
    const next = ops.reduce((u, op) => op.apply(u), blank);
    const hw = next.nodes.find((n) => n.kind === "hardware");
    expect(hw?.props.operation).toBe("print");
    expect(hw?.props.object).toMatch(/40mm cube/i);
  });
});
