import type { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  const body = (await request.json().catch(() => null)) as { email?: string } | null;
  const email = body?.email?.trim().toLowerCase() ?? "";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return Response.json({ ok: false, error: "Invalid email" }, { status: 400 });
  }
  return Response.json({ ok: true });
}
