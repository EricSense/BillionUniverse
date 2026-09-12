import { THESIS } from "@/lib/copy";

export function ThesisView() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">Thesis</p>
      <h1 className="serif mt-2 text-4xl md:text-5xl">{THESIS.line}</h1>
      <p className="mt-6 text-lg leading-relaxed text-mist">{THESIS.crawl}</p>

      <h2 className="serif mt-14 text-3xl">What it does</h2>
      <p className="mt-4 text-sm leading-relaxed text-mist">{THESIS.does}</p>

      <h2 className="serif mt-14 text-3xl">What it solves</h2>
      <p className="mt-4 text-sm leading-relaxed text-mist">{THESIS.solves}</p>

      <h2 className="serif mt-14 text-3xl">What it makes possible</h2>
      <ul className="mt-4 space-y-4">
        {THESIS.possible.map((p) => (
          <li key={p.title}>
            <p className="text-paper">{p.title}</p>
            <p className="mt-1 text-sm text-mist">{p.body}</p>
          </li>
        ))}
      </ul>

      <h2 className="serif mt-14 text-3xl">Why now</h2>
      <p className="mt-4 text-sm leading-relaxed text-mist">
        Labs training embodied AI are compute-rich and data-poor — the opposite problem LLMs had.
        Hyperscalers own the compute layer. Almost nobody owns physical-world data collection as an
        infrastructure business. It is capital-light compared to chips, and it is a service
        business: trucks, technicians, hardware kits, logistics.
      </p>
    </article>
  );
}
