import Link from "next/link";

export const metadata = { title: "How it works" };

const STEPS = [
  {
    name: "Creation",
    href: "/create",
    text: "People and systems express what they want or what they already have. AI represents it in a way other AI can understand later — not just a file or an app, but something with a legible purpose and interface.",
  },
  {
    name: "Understanding",
    href: "/network",
    text: "AI reads everything on the network and builds a sense of what each piece actually does, so matches are found by meaning, not by keyword or category.",
  },
  {
    name: "Connection",
    href: "/connect",
    text: "When two things need to interact, AI reads both, resolves whatever doesn’t line up, and builds the bridge between them on the fly — no shared standard required in advance.",
  },
  {
    name: "Action",
    href: "/connect",
    text: "Some connections aren’t just informational — they need to actually do something: run software, execute a transaction, operate a machine. An execution layer carries out these actions, with permissions and oversight that scale with the stakes.",
  },
  {
    name: "Trust",
    href: "/trust",
    text: "The network continuously verifies what’s reliable and what isn’t, building a record of which creations, companies, and agents have proven trustworthy enough to be connected to higher-stakes things.",
  },
  {
    name: "Value",
    href: "/value",
    text: "Every connection is priced and settled automatically, with value flowing back to whoever’s work made it possible — sometimes several hops removed from the person who benefits.",
  },
];

export default function HowPage() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="text-[11px] uppercase tracking-[0.28em] text-gold">Mechanism</p>
      <h1 className="mt-3 font-serif text-4xl text-star sm:text-5xl">One mechanism. Six layers.</h1>
      <p className="mt-5 text-star-dim">
        These aren&apos;t different products. They&apos;re the same act — AI reading two interfaces
        and connecting them — applied to gradually larger and higher-stakes things.
      </p>
      <ol className="mt-12 space-y-10">
        {STEPS.map((step, i) => (
          <li key={step.name} className="grid gap-3 sm:grid-cols-[72px_1fr]">
            <p className="font-mono text-sm text-gold">0{i + 1}</p>
            <div>
              <h2 className="font-serif text-3xl text-star">{step.name}</h2>
              <p className="mt-3 leading-relaxed text-star-dim">{step.text}</p>
              <Link href={step.href} className="mt-3 inline-block text-sm text-gold link-underline">
                Open {step.name.toLowerCase()}
              </Link>
            </div>
          </li>
        ))}
      </ol>

      <section className="mt-20 rounded-2xl border border-white/[0.08] p-6">
        <h2 className="font-serif text-2xl text-star">What has to be true</h2>
        <ul className="mt-4 space-y-3 text-sm leading-relaxed text-star-dim">
          <li>
            Joining the network has to be genuinely easier than building a custom connection —
            otherwise existing companies have no reason to plug in.
          </li>
          <li>
            The path from low-stakes to high-stakes connections has to be provably safe at small
            scale before it can plausibly extend further — this is a trust problem as much as a
            technical one.
          </li>
          <li>
            The network needs enough density that joining is obviously worth it because of
            everything already connected — which means starting with individual creators at low
            stakes, and using that foundation to make joining attractive to larger systems over time.
          </li>
        </ul>
      </section>
    </div>
  );
}
