import { NextResponse } from "next/server";
import { understand } from "@/lib/engine/understand";
import { rankMatches } from "@/lib/engine/match";
import { getState, placeUserNode } from "@/lib/store";
import { ceilingFromScore } from "@/lib/engine/trust";
import type { NetworkNode } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { description?: string };
  try {
    const intent = understand(body.description ?? "");
    const state = getState();
    const preview: NetworkNode = {
      id: "preview",
      kind: intent.kind,
      name: intent.name,
      owner: { name: "You", kind: "person", payTier: "individual" },
      purpose: intent.purpose,
      description: intent.description,
      domain: intent.domain,
      capabilities: intent.capabilities,
      trust: { score: 22, stakeCeiling: ceilingFromScore(22), events: [] },
      position: placeUserNode(state.nodes),
      createdAt: new Date().toISOString(),
      origin: "user",
    };
    const matches = rankMatches(preview, state.nodes, 5);
    return NextResponse.json({
      intent,
      preview,
      matches: matches.map((m) => ({
        id: m.node.id,
        name: m.node.name,
        kind: m.node.kind,
        owner: m.node.owner.name,
        score: m.score,
        reasons: m.reasons,
        purpose: m.node.purpose,
      })),
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not read that.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
