import { NextResponse } from "next/server";
import { think } from "@/lib/mind";
import type { MemoryItem } from "@/lib/types";

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const input = typeof body?.input === "string" ? body.input : "";
  const memory = Array.isArray(body?.memory) ? (body.memory as MemoryItem[]) : [];
  const result = think(input, memory);
  return NextResponse.json(result);
}
