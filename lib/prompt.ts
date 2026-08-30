import { addNode } from "./dsl";
import type { NodeKind, Universe, UniverseNode } from "./types";

export type PromptOp = {
  label: string;
  apply: (universe: Universe) => Universe;
};

function named(universe: Universe, name: string): UniverseNode | undefined {
  const lower = name.toLowerCase();
  return universe.nodes.find(
    (n) => n.name.toLowerCase() === lower || n.id.toLowerCase() === lower,
  );
}

function lastOf(universe: Universe, kind: NodeKind): UniverseNode | undefined {
  return [...universe.nodes].reverse().find((n) => n.kind === kind);
}

function withNode(
  universe: Universe,
  input: Parameters<typeof addNode>[2],
): Universe {
  const next = addNode(universe.nodes, universe.edges, input);
  return { ...universe, nodes: next.nodes, edges: next.edges, updatedAt: Date.now() };
}

export function interpretPrompt(text: string, universe: Universe): {
  reply: string;
  ops: PromptOp[];
} {
  const raw = text.trim();
  const lower = raw.toLowerCase();
  const ops: PromptOp[] = [];

  const titleMatch =
    raw.match(/(?:called|named|titled)\s+["“]?([^"”]+)["”]?/i) ??
    raw.match(/landing page for (?:a |an |the )?(.+)$/i);

  if (/landing page|home page|website|marketing page/.test(lower)) {
    const title = (titleMatch?.[1] ?? "New site").replace(/\.$/, "").trim();
    ops.push({
      label: `page "${title}"`,
      apply: (u) => {
        let next = withNode(u, {
          kind: "page",
          name: title,
          x: 80,
          y: 80,
          props: { path: "/" },
        });
        const page = next.nodes[next.nodes.length - 1]!;
        next = withNode(next, {
          kind: "section",
          name: "Hero",
          parentId: page.id,
          x: 80,
          y: 220,
        });
        const hero = next.nodes[next.nodes.length - 1]!;
        next = withNode(next, {
          kind: "text",
          name: "Headline",
          parentId: hero.id,
          x: 360,
          y: 80,
          props: { value: title },
        });
        next = withNode(next, {
          kind: "text",
          name: "Subhead",
          parentId: hero.id,
          x: 360,
          y: 180,
          props: {
            as: "p",
            value: "Directed from anywhere. Executed wherever the work lives.",
          },
        });
        next = withNode(next, {
          kind: "button",
          name: "Primary CTA",
          parentId: hero.id,
          x: 360,
          y: 280,
          props: { label: "Get started", href: "#start" },
        });
        return next;
      },
    });
  }

  if (/contact form|signup|sign up|email field/.test(lower)) {
    ops.push({
      label: "contact form",
      apply: (u) => {
        const page = lastOf(u, "page");
        let next = withNode(u, {
          kind: "section",
          name: "Contact",
          parentId: page?.id,
          x: 80,
          y: 420,
        });
        const section = next.nodes[next.nodes.length - 1]!;
        next = withNode(next, {
          kind: "input",
          name: "Email",
          parentId: section.id,
          x: 360,
          y: 420,
          props: { label: "Email", placeholder: "you@domain.com" },
        });
        next = withNode(next, {
          kind: "input",
          name: "Message",
          parentId: section.id,
          x: 360,
          y: 510,
          props: { label: "Message", placeholder: "What are we building?" },
        });
        next = withNode(next, {
          kind: "button",
          name: "Send",
          parentId: section.id,
          x: 360,
          y: 600,
          props: { label: "Send", href: "#send" },
        });
        return next;
      },
    });
  }

  const printMatch = raw.match(
    /print(?: a| an)? ([^,]+?)(?: on (?:the )?(.+))?$/i,
  );
  if (/print|3d|fabricat|printer/.test(lower)) {
    const object = printMatch?.[1]?.trim() ?? "part";
    const device = printMatch?.[2]?.trim() ?? "workshop-printer";
    ops.push({
      label: `hardware print "${object}"`,
      apply: (u) =>
        withNode(u, {
          kind: "hardware",
          name: object,
          x: 640,
          y: 120,
          props: {
            device,
            operation: "print",
            object,
            material: "PLA",
          },
        }),
    });
  }

  if (/robot|arm|motion|pick/.test(lower) && !ops.some((o) => o.label.includes("hardware"))) {
    ops.push({
      label: "robotics sequence",
      apply: (u) =>
        withNode(u, {
          kind: "hardware",
          name: "Pick sequence",
          x: 640,
          y: 260,
          props: {
            device: "rig-01",
            operation: "move",
            object: "pick-and-place",
          },
        }),
    });
  }

  const addKind = lower.match(
    /\badd (?:a |an )?(page|section|text|button|input|image|data|action|hardware)\b/,
  );
  if (addKind && ops.length === 0) {
    const kind = addKind[1] as NodeKind;
    const parent =
      named(universe, "hero") ?? lastOf(universe, "section") ?? lastOf(universe, "page");
    ops.push({
      label: `${kind} node`,
      apply: (u) =>
        withNode(u, {
          kind,
          name: kind,
          parentId: kind === "page" || kind === "hardware" ? undefined : parent?.id,
          props:
            kind === "button"
              ? { label: "Continue" }
              : kind === "text"
                ? { value: "New copy" }
                : {},
        }),
    });
  }

  if (/comment|note that|leave a note/.test(lower)) {
    const body = raw.replace(/^.*?(?:comment|note that|leave a note)\s*/i, "").trim() || raw;
    ops.push({
      label: "comment",
      apply: (u) => ({
        ...u,
        comments: [
          ...u.comments,
          {
            id: `c_${Date.now().toString(36)}`,
            author: "prompt",
            color: "#8b7cff",
            body,
            createdAt: Date.now(),
            nodeId: u.nodes[0]?.id,
          },
        ],
        updatedAt: Date.now(),
      }),
    });
  }

  if (ops.length === 0) {
    ops.push({
      label: "note on canvas",
      apply: (u) =>
        withNode(u, {
          kind: "text",
          name: "Prompt note",
          x: 120,
          y: 80 + u.nodes.length * 12,
          props: { as: "p", value: raw },
        }),
    });
  }

  const reply =
    ops.length === 1
      ? `Applied “${ops[0]!.label}” to the same graph the visual and code panes share.`
      : `Applied ${ops.length} changes: ${ops.map((o) => o.label).join(", ")}. Same graph. Same jobs.`;

  return { reply, ops };
}
