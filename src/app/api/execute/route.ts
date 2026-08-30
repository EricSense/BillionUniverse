import { NextResponse } from "next/server";
import { getState, replaceConnection } from "@/lib/store";
import { executeConnection } from "@/lib/engine/execute";

export const runtime = "nodejs";

export async function POST(request: Request) {
  const body = (await request.json()) as { connectionId?: string };
  const state = getState();
  const connection = state.connections.find((c) => c.id === body.connectionId);
  if (!connection) {
    return NextResponse.json({ error: "No such connection." }, { status: 404 });
  }
  const result = executeConnection(connection, state.nodes);
  const next = replaceConnection(
    result.connection,
    result.nodes,
    result.settlement ? [result.settlement] : [],
    result.activity,
  );
  return NextResponse.json({ ...result, state: next });
}
