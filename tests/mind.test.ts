import { describe, expect, it } from "vitest";
import { think } from "../lib/mind";

describe("universal mind", () => {
  it("knows what it is", () => {
    const r = think("What are you?", []);
    expect(r.reply.toLowerCase()).toMatch(/universal ai/);
    expect(r.trace.some((t) => t.faculty === "reason")).toBe(true);
  });

  it("keeps a name and recalls it", () => {
    const a = think("My name is Ada", []);
    expect(a.memory.some((m) => m.key === "name" && m.value === "Ada")).toBe(true);
    const b = think("What is my name?", a.memory);
    expect(b.reply).toMatch(/Ada/);
  });

  it("plans instead of chatting", () => {
    const r = think("Plan a universe for a billion lives", []);
    expect(r.reply).toMatch(/^Plan /);
    expect(r.reply).toMatch(/1\./);
  });

  it("computes", () => {
    expect(think("12 * 8", []).reply).toBe("96");
  });

  it("forgets", () => {
    const a = think("My name is Ada", []);
    const b = think("forget everything", a.memory);
    expect(b.memory).toEqual([]);
  });
});
