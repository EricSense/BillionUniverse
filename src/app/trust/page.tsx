import Link from "next/link";
import { TrustBar } from "@/components/TrustBar";
import { getState } from "@/lib/store";

export const metadata = { title: "Trust" };
export const dynamic = "force-dynamic";

const TIERS = [
  {
    name: "Digital",
    score: "0–39",
    risk: "Worst case, something looks wrong and gets undone.",
    examples: "Two people's creations in the same domain. A tileset dropped into a mechanic.",
    href: "/nodes/n-gravity-wells",
  },
  {
    name: "Business",
    score: "40–74",
    risk: "A bad connection can mean lost money or a broken workflow.",
    examples: "Inventory to shipping. CRM to ERP. Agents settling a buy.",
    href: "/nodes/n-inventory",
  },
  {
    name: "Physical",
    score: "75–100 + enterprise",
    risk: "Wasted material, broken hardware, or physical harm.",
    examples: "A signed toolpath reaching a printer. Never a hobbyist script talking to a kiln directly.",
    href: "/nodes/n-printer-farm",
  },
];

export default function TrustPage() {
  const nodes = [...getState().nodes].sort((a, b) => b.trust.score - a.trust.score);

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Trust</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-star sm:text-5xl">
        The network has to earn its way toward higher stakes.
      </h1>
      <p className="mt-5 max-w-2xl text-star-dim">
        Not every connection carries the same risk. A creation, a company, or an agent should only
        be able to reach further — from safe digital connections toward business-critical ones
        toward physical ones — once it has built a record the network can verify.
      </p>

      <ol className="mt-12 grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier, i) => (
          <li key={tier.name} className="rounded-2xl border border-white/[0.08] bg-ink-900/50 p-6">
            <p className="font-mono text-[11px] text-gold">0{i + 1}</p>
            <h2 className="mt-2 font-serif text-3xl text-star">{tier.name}</h2>
            <p className="mt-1 font-mono text-xs text-star-mute">{tier.score}</p>
            <p className="mt-4 text-sm leading-relaxed text-star-dim">{tier.risk}</p>
            <p className="mt-3 text-sm text-star-mute">{tier.examples}</p>
            <Link href={tier.href} className="mt-5 inline-block text-sm text-gold link-underline">
              See a node at this tier
            </Link>
          </li>
        ))}
      </ol>

      <section className="mt-16">
        <h2 className="font-serif text-2xl text-star">Current record</h2>
        <p className="mt-2 max-w-xl text-sm text-star-dim">
          Score is earned by live connections that hold. Physical reach also requires an enterprise
          to stand behind the path.
        </p>
        <ul className="mt-8 space-y-5">
          {nodes.map((node) => (
            <li key={node.id} className="grid gap-4 rounded-2xl border border-white/[0.06] p-4 sm:grid-cols-[200px_1fr]">
              <div>
                <Link href={`/nodes/${node.id}`} className="font-serif text-xl text-star hover:text-gold">
                  {node.name}
                </Link>
                <p className="mt-1 text-xs text-star-mute">
                  {node.kind} · {node.owner.name}
                </p>
              </div>
              <TrustBar score={node.trust.score} ceiling={node.trust.stakeCeiling} />
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
