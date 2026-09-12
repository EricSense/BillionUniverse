import { NextResponse } from "next/server";
import { getUniverse } from "@/lib/catalog";

export async function GET(_req: Request, ctx: { params: Promise<{ id: string }> }) {
  const { id } = await ctx.params;
  const u = getUniverse(id);
  if (!u) return NextResponse.json({ error: "not_found" }, { status: 404 });
  return NextResponse.json(u);
}
