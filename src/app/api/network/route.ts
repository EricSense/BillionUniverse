import { NextResponse } from "next/server";
import { getState, resetState } from "@/lib/store";

export const runtime = "nodejs";

export async function GET() {
  return NextResponse.json(getState());
}

export async function DELETE() {
  return NextResponse.json(resetState());
}
