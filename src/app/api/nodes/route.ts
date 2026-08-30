import { NextResponse } from "next/server";
import { understand } from "@/lib/engine/understand";
import { getState, placeUserNode, upsertNode } from "@/lib/store";
import { ceilingFromScore } from "@/lib/engine/trust";
import { nowIso, uid } from "@/lib/ids";
import type { NetworkNode, Owner, PayTier } from "@/lib/types";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as {
    description?: string;
    ownerName?: string;
    payTier?: PayTier;
    ownerKind?: Owner["kind"];
  };
  try {
    const intent = understand(body.description ?? "");
    const state = getState();
    const owner: Owner = {
      name: body.ownerName?.trim() || "You",
      kind: body.ownerKind ?? "person",
      payTier: body.payTier ?? "individual",
    };
    const node: NetworkNode = {
      id: uid("n"),
      kind: intent.kind,
      name: intent.name,
      owner,
      purpose: intent.purpose,
      description: intent.description,
      domain: intent.domain,
      capabilities: intent.capabilities,
      trust: {
        score: owner.payTier === "enterprise" ? 70 : owner.payTier === "company" ? 42 : 22,
        stakeCeiling: ceilingFromScore(owner.payTier === "enterprise" ? 70 : owner.payTier === "company" ? 42 : 22),
        events: [
          {
            id: uid("te"),
            at: nowIso(),
            delta: 0,
            reason: "Joined the network. Record starts here.",
          },
        ],
      },
      position: placeUserNode(state.nodes),
      createdAt: nowIso(),
      origin: "user",
    };
    const next = upsertNode(node);
    return NextResponse.json({ node, state: next });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Could not create that node.";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
