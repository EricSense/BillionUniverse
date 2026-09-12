import Link from "next/link";
import { catalog } from "@/lib/catalog";
import { m2, verticalLabel } from "@/lib/format";
import { Floorplan } from "@/components/universe/Floorplan";

export function CatalogView() {
  const all = catalog();
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">Library</p>
      <h1 className="serif mt-2 text-4xl md:text-5xl">Every captured space is one universe.</h1>
      <p className="mt-4 max-w-2xl text-mist">
        First 90 days: warehouses first, then a retail floor and a construction deck. Each card is a
        real UB-01 bundle produced by the capture → process pipeline — not a mock.
      </p>
      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {all.map((u) => (
          <Link
            key={u.universe_id}
            href={`/u/${u.universe_id}`}
            className="group border border-line bg-ink hover:border-scan"
          >
            <div className="h-40 overflow-hidden border-b border-line">
              <Floorplan universe={u} />
            </div>
            <div className="p-4">
              <p className="mono text-[10px] tracking-widest text-mist uppercase">
                {u.universe_id} · {verticalLabel(u.site.vertical)}
              </p>
              <h2 className="serif mt-1 text-2xl group-hover:text-scan">{u.site.name}</h2>
              <p className="mt-1 text-[13px] text-mist">
                {u.site.metro} · {m2(u.site.area_m2)} · {u.stats.object_count} objects
              </p>
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
