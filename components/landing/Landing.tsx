import Link from "next/link";
import { catalog, featured } from "@/lib/catalog";
import { THESIS } from "@/lib/copy";
import { kitTotal, usd, WALKER_V0, ninetyDayTotal } from "@/lib/kit";
import { m2 } from "@/lib/format";
import { Floorplan } from "@/components/universe/Floorplan";
import { HeroTwin } from "@/components/landing/HeroTwin";

export function Landing() {
  const feature = featured();
  const preview = catalog().slice(0, 6);
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl md:grid-cols-2">
          <div className="flex flex-col justify-between px-5 py-12 md:py-16">
            <div>
              <p className="mono text-[11px] tracking-widest text-scan uppercase">
                Reality-capture network
              </p>
              <h1 className="serif mt-4 text-5xl leading-[1.05] md:text-6xl">{THESIS.line}</h1>
              <p className="mt-6 max-w-md text-mist">{THESIS.crawl}</p>
            </div>
            <div className="mt-10 flex flex-wrap gap-3">
              <Link href="/catalog" className="bg-scan px-4 py-2 text-sm text-void">
                Open the catalog
              </Link>
              <Link href="/kit" className="border border-line px-4 py-2 text-sm hover:border-scan">
                Capture kit + cost
              </Link>
            </div>
          </div>
          <div className="relative min-h-[380px] border-t border-line md:border-t-0 md:border-l">
            <HeroTwin universe={feature} />
            <div className="pointer-events-none absolute bottom-3 left-3 right-3 mono text-[11px] text-scan">
              {feature.universe_id} · {feature.site.name} · {m2(feature.site.area_m2)} · READY
            </div>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
          <Block k="What it does" body={THESIS.does} />
          <Block k="What it solves" body={THESIS.solves} />
          <div>
            <p className="mono text-[11px] tracking-widest text-scan uppercase">What it makes possible</p>
            <ul className="mt-4 space-y-3 text-sm text-mist">
              {THESIS.possible.map((p) => (
                <li key={p.title}>
                  <span className="text-paper">{p.title}.</span> {p.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-3">
          <Block k="First product" body={THESIS.firstProduct} />
          <Block k="First customer" body={THESIS.firstCustomer} />
          <Block k="First 90 days" body={THESIS.first90} />
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-14">
          <div className="flex items-end justify-between gap-4">
            <div>
              <p className="mono text-[11px] tracking-widest text-scan uppercase">Catalog</p>
              <h2 className="serif mt-2 text-4xl">Fifteen universes from the pipeline.</h2>
            </div>
            <Link href="/catalog" className="text-sm text-scan">
              View all →
            </Link>
          </div>
          <div className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
            {preview.map((u) => (
              <Link key={u.universe_id} href={`/u/${u.universe_id}`} className="border border-line hover:border-scan">
                <div className="h-28 overflow-hidden">
                  <Floorplan universe={u} />
                </div>
                <div className="border-t border-line p-3">
                  <p className="mono text-[10px] text-mist">{u.universe_id}</p>
                  <p className="serif text-xl">{u.site.name}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-8 px-5 py-14 md:grid-cols-2">
          <div>
            <p className="mono text-[11px] tracking-widest text-scan uppercase">Capital-light</p>
            <h2 className="serif mt-2 text-4xl">Rigs cost thousands, not billions.</h2>
            <p className="mt-4 text-mist">
              Walker v0 is {usd(kitTotal(WALKER_V0))}. First 90 days all-in (kit, workstation, access,
              travel) is {usd(ninetyDayTotal())}. Nvidia owns compute. Almost nobody owns physical-world
              data collection as infrastructure.
            </p>
            <Link href="/kit" className="mt-6 inline-block text-sm text-scan">
              Hardware list and BOM →
            </Link>
          </div>
          <div className="border border-line bg-ink p-6">
            <p className="mono text-[11px] text-mist">Why the name is literal</p>
            <p className="serif mt-3 text-3xl">
              Every space you capture becomes one universe in the catalog. The business scales by
              multiplying environments.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}

function Block({ k, body }: { k: string; body: string }) {
  return (
    <div>
      <p className="mono text-[11px] tracking-widest text-scan uppercase">{k}</p>
      <p className="mt-4 text-sm leading-relaxed text-mist">{body}</p>
    </div>
  );
}
