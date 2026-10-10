import Link from "next/link";
import { MISSION } from "@/lib/copy";
import { FLEET, fleetCounts } from "@/lib/nodes";

export function Landing() {
  const c = fleetCounts();
  return (
    <div>
      <section className="border-b border-line">
        <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
          <p className="mono text-[11px] tracking-[0.22em] text-heat uppercase">Infrastructure</p>
          <h1 className="mt-4 max-w-4xl text-4xl leading-[1.08] font-medium tracking-tight md:text-6xl">
            {MISSION.line}
          </h1>
          <p className="mt-6 max-w-2xl text-mist">{MISSION.analogue}</p>
          <div className="mt-10 flex flex-wrap gap-3">
            <Link href="/node" className="bg-heat px-4 py-2 text-sm text-white">
              Open the first Node
            </Link>
            <Link href="/stack" className="border border-line px-4 py-2 text-sm hover:border-paper">
              The kit
            </Link>
          </div>
        </div>
      </section>

      <section className="border-b border-line">
        <div className="mx-auto grid max-w-6xl gap-10 px-5 py-14 md:grid-cols-3">
          <Block k="What it does" body={MISSION.does} />
          <Block k="What it solves" body={MISSION.solves} />
          <div>
            <p className="mono text-[11px] tracking-[0.22em] text-heat uppercase">What it makes possible</p>
            <ul className="mt-4 space-y-4 text-sm text-mist">
              {MISSION.possible.map((p) => (
                <li key={p.title}>
                  <span className="text-paper">{p.title}.</span> {p.body}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      <section>
        <div className="mx-auto grid max-w-6xl gap-6 px-5 py-14 md:grid-cols-4">
          <Stat k="Nodes in the fleet" v={String(c.total)} />
          <Stat k="Online" v={String(c.online)} />
          <Stat k="People on dirt" v={String(c.people)} />
          <Stat k="End state" v="1B sites" />
        </div>
        <div className="mx-auto max-w-6xl px-5 pb-16">
          <p className="mono text-[11px] text-mist">
            {FLEET.filter((n) => n.status === "online")
              .map((n) => n.id)
              .join(" · ")}{" "}
            live · the rest is how a constellation starts
          </p>
        </div>
      </section>
    </div>
  );
}

function Block({ k, body }: { k: string; body: string }) {
  return (
    <div>
      <p className="mono text-[11px] tracking-[0.22em] text-heat uppercase">{k}</p>
      <p className="mt-4 text-sm leading-relaxed text-mist">{body}</p>
    </div>
  );
}

function Stat({ k, v }: { k: string; v: string }) {
  return (
    <div className="border border-line bg-ink px-4 py-3">
      <p className="mono text-[10px] tracking-widest text-mist uppercase">{k}</p>
      <p className="mt-1 text-2xl">{v}</p>
    </div>
  );
}
