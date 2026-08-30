import Link from "next/link";
import { getState } from "@/lib/store";

const STORIES = [
  {
    kicker: "Creations",
    title: "A mechanic, then an art pack that was never meant for it.",
    body: "A teenager describes a game mechanic. AI builds it. A stranger’s AI-built art pack gets suggested and dropped in automatically.",
    href: "/nodes/n-gravity-wells",
    from: "Gravity Wells",
    to: "Nebula Tile Pack",
  },
  {
    kicker: "Business systems",
    title: "Three people’s work. No integration code.",
    body: "A bakery inventory workflow, a shipping automation, a supplier-ordering bot — linked because the network could read each interface.",
    href: "/nodes/n-inventory",
    from: "Pantry Ledger",
    to: "Harbor Labels + Millrun Buyer",
  },
  {
    kicker: "Physical machines",
    title: "A hobbyist script, several hops later, reaches a printer.",
    body: "Not directly. Through a slicer that had already earned the right to touch hardware, under an enterprise guarantee.",
    href: "/nodes/n-print-script",
    from: "Lattice Generator",
    to: "Northlight Printer 04",
  },
  {
    kicker: "Existing software",
    title: "A company plugs in a CRM instead of building a project.",
    body: "Once it’s a node, it’s reachable by everything already connected — including another company’s ERP.",
    href: "/nodes/n-crm-northwind",
    from: "Northwind CRM",
    to: "Helix Parts ERP",
  },
  {
    kicker: "Agents",
    title: "Two agents negotiate a transaction themselves.",
    body: "They can, because both companies’ systems are already on the same network. No shared standard agreed in advance.",
    href: "/nodes/n-agent-procure",
    from: "Northwind Buyer Agent",
    to: "Helix Fulfillment Agent",
  },
];

const LAYERS = [
  { name: "Creation", text: "People and systems express what they want or already have. AI represents it with a purpose and an interface other AI can read later." },
  { name: "Understanding", text: "The network reads everything on it and finds matches by meaning — not keyword, not category." },
  { name: "Connection", text: "When two things need to interact, AI reads both, resolves what doesn’t line up, and builds the bridge on the fly." },
  { name: "Action", text: "Some connections run software, settle a transaction, or operate a machine. Oversight scales with the stakes." },
  { name: "Trust", text: "A verified record of what has proven reliable — and how far each node is allowed to reach." },
  { name: "Value", text: "Every connection is priced and settled. Value flows back to whoever’s work made the path possible, including hops." },
];

export default function HomePage() {
  const state = getState();
  const live = state.connections.filter((c) => c.status !== "blocked").length;

  return (
    <div>
      <section className="mx-auto max-w-6xl px-5 pb-20 pt-20 sm:pt-28">
        <p className="text-[11px] uppercase tracking-[0.32em] text-gold">AI-mediated interoperability</p>
        <h1 className="mt-6 max-w-4xl font-serif text-5xl leading-[1.05] text-star sm:text-7xl">
          The network anything can plug into.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-star-dim">
          Nothing talks to anything else by default. Billion Universe is the platform that removes
          the cost of connection — so a person&apos;s creation, a company&apos;s existing software, a
          machine, or an agent can join one network and immediately be reachable by everything
          already on it.
        </p>
        <div className="mt-10 flex flex-wrap items-center gap-4">
          <Link
            href="/create"
            className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink-950 transition hover:bg-gold-bright"
          >
            Plug something in
          </Link>
          <Link
            href="/network"
            className="rounded-full px-6 py-2.5 text-sm text-star ring-1 ring-white/15 transition hover:bg-white/[0.04]"
          >
            See the live network
          </Link>
        </div>
        <dl className="mt-16 grid grid-cols-2 gap-6 sm:grid-cols-4">
          {[
            [String(state.nodes.length), "Nodes on this network"],
            [String(live), "Live connections"],
            ["6", "Layers, one mechanism"],
            ["3", "Trust tiers"],
          ].map(([n, l]) => (
            <div key={l}>
              <dt className="font-serif text-3xl text-star">{n}</dt>
              <dd className="mt-1 text-xs uppercase tracking-[0.16em] text-star-mute">{l}</dd>
            </div>
          ))}
        </dl>
      </section>

      <div className="rule mx-auto max-w-6xl" />

      <section className="mx-auto grid max-w-6xl gap-12 px-5 py-20 lg:grid-cols-2">
        <div>
          <p className="text-[11px] uppercase tracking-[0.28em] text-star-mute">The problem</p>
          <h2 className="mt-4 font-serif text-4xl text-star">Disconnected pieces. Collectively enormous.</h2>
        </div>
        <p className="text-base leading-relaxed text-star-dim">
          A person&apos;s app, another person&apos;s automation, a company&apos;s inventory system, a
          factory&apos;s machinery — each was built in isolation. Connecting any two of them today
          means custom integration work: engineers, months, maintenance forever after. Most people
          can&apos;t create at all. Most systems that could combine into something bigger never do,
          because nobody paid to connect them.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 pb-12">
        <p className="text-[11px] uppercase tracking-[0.28em] text-gold">The idea</p>
        <h2 className="mt-4 max-w-3xl font-serif text-4xl leading-tight text-star sm:text-5xl">
          Give it two things that were never designed to work together. It reads both, translates,
          and links them — in real time.
        </h2>
        <p className="mt-6 max-w-2xl text-star-dim">
          No human writing integration code. No shared standard agreed in advance. Once that&apos;s
          true at scale, this isn&apos;t a place people visit to browse content. It&apos;s a network
          anything can plug into.
        </p>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <div className="flex items-end justify-between gap-6">
          <h2 className="font-serif text-3xl text-star">What it looks like</h2>
          <p className="hidden max-w-sm text-sm text-star-mute sm:block">
            These aren&apos;t different products. They&apos;re the same mechanism applied to
            gradually larger and higher-stakes things.
          </p>
        </div>
        <div className="mt-10 grid gap-4 md:grid-cols-2">
          {STORIES.map((story) => (
            <Link
              key={story.title}
              href={story.href}
              className="group rounded-2xl border border-white/[0.07] bg-ink-900/50 p-6 transition hover:border-gold/30 hover:bg-ink-800/60"
            >
              <p className="text-[11px] uppercase tracking-[0.22em] text-gold">{story.kicker}</p>
              <h3 className="mt-3 font-serif text-2xl text-star group-hover:text-gold-bright">
                {story.title}
              </h3>
              <p className="mt-3 text-sm leading-relaxed text-star-dim">{story.body}</p>
              <p className="mt-5 font-mono text-[11px] text-star-mute">
                {story.from} → {story.to}
              </p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-16">
        <h2 className="font-serif text-3xl text-star">How it works</h2>
        <ol className="mt-10 grid gap-px overflow-hidden rounded-2xl border border-white/[0.07] bg-white/[0.06] sm:grid-cols-2 lg:grid-cols-3">
          {LAYERS.map((layer, i) => (
            <li key={layer.name} className="bg-ink-900/90 p-6">
              <p className="font-mono text-[11px] text-gold">0{i + 1}</p>
              <h3 className="mt-2 font-serif text-2xl text-star">{layer.name}</h3>
              <p className="mt-3 text-sm leading-relaxed text-star-dim">{layer.text}</p>
            </li>
          ))}
        </ol>
        <Link href="/how" className="mt-6 inline-block text-sm text-gold link-underline">
          Walk the six layers
        </Link>
      </section>

      <section className="mx-auto grid max-w-6xl gap-10 px-5 py-16 lg:grid-cols-3">
        <article className="rounded-2xl border border-white/[0.07] p-6">
          <h3 className="font-serif text-2xl text-star">Why this scales so far</h3>
          <p className="mt-3 text-sm leading-relaxed text-star-dim">
            Every connection is also a transaction the network can facilitate. The business grows
            every time an existing piece of software, a company, or a machine joins — each new node
            makes every other node more valuable and more reachable.
          </p>
        </article>
        <article className="rounded-2xl border border-white/[0.07] p-6">
          <h3 className="font-serif text-2xl text-star">Trust has to scale with stakes</h3>
          <p className="mt-3 text-sm leading-relaxed text-star-dim">
            Digital to digital is low-stakes. Business systems can lose money. Machines can cause
            harm. A node only reaches further once it has a record the network can verify.
          </p>
          <Link href="/trust" className="mt-4 inline-block text-sm text-gold link-underline">
            The trust ladder
          </Link>
        </article>
        <article className="rounded-2xl border border-white/[0.07] p-6">
          <h3 className="font-serif text-2xl text-star">How people and companies pay</h3>
          <p className="mt-3 text-sm leading-relaxed text-star-dim">
            Individuals pay small usage amounts. Companies pay for connected outcomes. Enterprises
            pay for guaranteed, audited access — the only tier that can responsibly reach machines.
          </p>
          <Link href="/pricing" className="mt-4 inline-block text-sm text-gold link-underline">
            Tiers
          </Link>
        </article>
      </section>

      <section className="mx-auto max-w-6xl px-5 py-20">
        <div className="rounded-3xl border border-gold/25 bg-gradient-to-br from-ink-800 to-ink-950 p-10 shadow-glow">
          <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Why now</p>
          <h2 className="mt-4 max-w-3xl font-serif text-4xl text-star">
            Translating between two systems that were never designed to work together has gone from
            an engineering project to something AI can do in real time.
          </h2>
          <p className="mt-6 max-w-2xl text-star-dim">
            That&apos;s the unlock that makes a network like this economically possible. Joining has
            to be easier than building a custom connection. Density has to start with creators at
            low stakes, then earn its way toward companies, machines, and agents.
          </p>
          <div className="mt-8 flex flex-wrap gap-4">
            <Link
              href="/create"
              className="rounded-full bg-gold px-6 py-2.5 text-sm font-medium text-ink-950 hover:bg-gold-bright"
            >
              Describe what you have
            </Link>
            <Link href="/network" className="rounded-full px-6 py-2.5 text-sm text-star ring-1 ring-white/15">
              Open the constellation
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
