import { NextRequest, NextResponse } from "next/server";
import { compilePreview, previewBytes } from "@/lib/preview";
import type { Universe } from "@/lib/types";

export async function POST(req: NextRequest) {
  let body: { backendId?: string; universe?: Universe };
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON" }, { status: 400 });
  }
  if (body.backendId !== "cloud-build" || !body.universe?.nodes) {
    return NextResponse.json(
      { error: "This runner accepts cloud-build jobs with a universe graph." },
      { status: 400 },
    );
  }
  const html = compilePreview(body.universe);
  return NextResponse.json({
    html,
    bytes: previewBytes(html),
    summary: `Cloud worker compiled “${body.universe.name}” (${body.universe.nodes.length} nodes).`,
  });
}
