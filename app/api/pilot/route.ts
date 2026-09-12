import { NextResponse } from "next/server";
import { z } from "zod";

const Body = z.object({
  company: z.string().min(1).max(200),
  email: z.string().email(),
  need: z.string().min(1).max(200),
});

export async function POST(req: Request) {
  const json = await req.json().catch(() => null);
  const parsed = Body.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ ok: false, error: "invalid" }, { status: 400 });
  }
  return NextResponse.json({ ok: true, received: parsed.data.company });
}
