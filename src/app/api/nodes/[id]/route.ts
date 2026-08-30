import { NextResponse } from "next/server";
import { getState } from "@/lib/store";
import { rankMatches } from "@/lib/engine/match";

export const runtime = "nodejs";

export async function GET(_request: Request, context: { params: Promise<{ id: string }> }) {
  const { id } = await context.params;
  const state = getState();
  const node = state.nodes.find((n) => n.id === id);
  if (!node) return NextResponse.json({ error: "Not on the network." }, { status: 404 });
  const connections = state.connections.filter((c) => c.path.includes(id));
  const matches = rankMatches(node, state.nodes, 6);
  return NextResponse.json({ node, connections, matches });
}
