import { NextResponse } from "next/server";
import { catalog } from "@/lib/catalog";

export async function GET() {
  const items = catalog().map((u) => ({
    universe_id: u.universe_id,
    name: u.site.name,
    vertical: u.site.vertical,
    metro: u.site.metro,
    area_m2: u.site.area_m2,
    objects: u.stats.object_count,
    qa: u.qa.status,
  }));
  return NextResponse.json({ format: "ub-01", count: items.length, universes: items });
}
