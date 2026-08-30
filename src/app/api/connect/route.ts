import { NextResponse } from "next/server";
import { addConnection, getState } from "@/lib/store";
import { proposeConnection } from "@/lib/engine/connect";
import { evaluateGate } from "@/lib/engine/trust";
import { inferConnectionStakes } from "@/lib/engine/trust";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { from?: string; to?: string; persist?: boolean };
  const state = getState();
  const source = state.nodes.find((n) => n.id === body.from);
  const target = state.nodes.find((n) => n.id === body.to);
  if (!source || !target) {
    return NextResponse.json({ error: "Both nodes must already be on the network." }, { status: 400 });
  }
  const proposed = proposeConnection(source, target, state.nodes);
  const stakes = inferConnectionStakes(source, target);
  const gate = evaluateGate(source, target, stakes);
  if (body.persist !== false) {
    addConnection(proposed);
  }
  return NextResponse.json({ connection: proposed, gate });
}
