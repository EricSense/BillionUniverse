import { describe, expect, it } from "vitest";
import { parseDsl, serializeDsl } from "./dsl";

const SAMPLE = `
page home name="Home" path=/ x=10 y=20
  section hero name="Hero" x=10 y=80
    text h name="Headline" value="Hello" x=40 y=80
hardware cube name="Cube" device=printer operation=print object="40mm cube" x=200 y=20
`.trim();

describe("dsl", () => {
  it("parses nested graph and hardware nodes", () => {
    const { nodes, edges } = parseDsl(SAMPLE);
    expect(nodes.map((n) => n.id)).toEqual(["home", "hero", "h", "cube"]);
    expect(nodes.find((n) => n.id === "hero")?.parentId).toBe("home");
    expect(nodes.find((n) => n.id === "cube")?.kind).toBe("hardware");
    expect(edges.some((e) => e.from === "home" && e.to === "hero")).toBe(true);
  });

  it("round-trips names and props", () => {
    const parsed = parseDsl(SAMPLE);
    const dsl = serializeDsl(parsed.nodes, parsed.edges);
    const again = parseDsl(dsl);
    expect(again.nodes).toHaveLength(parsed.nodes.length);
    expect(again.nodes.find((n) => n.id === "h")?.props.value).toBe("Hello");
    expect(again.nodes.find((n) => n.id === "cube")?.props.object).toBe("40mm cube");
  });

  it("rejects unknown kinds", () => {
    expect(() => parseDsl("widget x name=nope")).toThrow(/unknown kind/);
  });
});
