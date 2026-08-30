import Link from "next/link";

export const metadata = { title: "Pricing" };

const TIERS = [
  {
    name: "Individual",
    price: "Usage",
    pay: "Small, usage-based amounts for low-stakes connections. The value is in speed and convenience, not risk.",
    includes: [
      "Create and plug in digital work",
      "Meaning-based matches",
      "Digital-tier bridges",
      "Value share when your node is on a path",
    ],
  },
  {
    name: "Company",
    price: "Outcomes",
    pay: "Pay for connected outcomes — “connect my system to theirs” — without managing the pieces underneath. The network stands behind the connection if something goes wrong.",
    includes: [
      "Plug in existing software as a node",
      "Business-tier bridges",
      "Outcome pricing, not seat pricing",
      "Counterparty standing when a path fails",
    ],
  },
  {
    name: "Enterprise",
    price: "Guarantee",
    pay: "Guaranteed, audited, high-trust access. The only tier able to responsibly reach into physical machines and critical infrastructure.",
    includes: [
      "Audited join of existing systems",
      "Physical-tier reach",
      "Signed execution and incident standing",
      "Agent-to-agent settlement under policy",
    ],
  },
];

export default function PricingPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Pricing</p>
      <h1 className="mt-3 max-w-3xl font-serif text-4xl text-star sm:text-5xl">
        Priced by what the connection is worth, and how much trust it required.
      </h1>
      <p className="mt-5 max-w-2xl text-star-dim">
        Because every connection is also a potential transaction, the network doesn&apos;t sell
        seats. It sells reach. The more of the economy&apos;s existing systems join, the larger the
        base of transactions it can facilitate.
      </p>

      <div className="mt-12 grid gap-4 lg:grid-cols-3">
        {TIERS.map((tier) => (
          <article
            key={tier.name}
            className={`rounded-2xl border p-6 ${
              tier.name === "Enterprise" ? "border-gold/40 bg-ink-800/50 shadow-glow" : "border-white/[0.08] bg-ink-900/40"
            }`}
          >
            <p className="text-[11px] uppercase tracking-[0.2em] text-gold">{tier.name}</p>
            <p className="mt-3 font-serif text-3xl text-star">{tier.price}</p>
            <p className="mt-4 text-sm leading-relaxed text-star-dim">{tier.pay}</p>
            <ul className="mt-6 space-y-2 text-sm text-star">
              {tier.includes.map((item) => (
                <li key={item} className="flex gap-2">
                  <span className="text-gold">–</span>
                  {item}
                </li>
              ))}
            </ul>
          </article>
        ))}
      </div>

      <p className="mt-12 max-w-2xl text-sm text-star-dim">
        Units on this network are BU — the settlement currency for a facilitated path. Digital
        connections settle in fractions. Business and physical paths settle in amounts that reflect
        the outcome, not the API call.
      </p>
      <Link
        href="/create"
        className="mt-8 inline-block rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink-950"
      >
        Start on the individual tier
      </Link>
    </div>
  );
}
