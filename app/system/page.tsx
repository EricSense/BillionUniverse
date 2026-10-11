import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { Lockup, Mark, Wordmark } from "@/components/Mark";
import { BRAND, COLORS } from "@/lib/brand";

export const metadata: Metadata = { title: "System" };

export default function SystemPage() {
  return (
    <Chrome>
      <main className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] tracking-[0.22em] text-ring uppercase">Brand system</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          The lockup is the company.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">
          White field. Blue orbits. One word. Nothing sits beside BillionUniverse except the
          mark that made it.
        </p>

        <section className="mt-16 grid gap-6 lg:grid-cols-3">
          <figure className="flex min-h-[16rem] items-center justify-center rounded-2xl border border-line bg-paper px-8">
            <Lockup markClass="h-14 w-14" textClass="text-[28px] tracking-tight text-ink" />
          </figure>
          <figure className="flex min-h-[16rem] items-center justify-center rounded-2xl border border-line bg-mist">
            <Mark className="h-28 w-28" />
          </figure>
          <figure className="flex min-h-[16rem] items-center justify-center rounded-2xl border border-line bg-core">
            <Wordmark className="text-[28px] tracking-tight text-paper" />
          </figure>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl">Palette</h2>
          <p className="mt-2 text-mute">Sampled from the mark. Paper stays white.</p>
          <ul className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {COLORS.map((c) => (
              <li key={c.hex} className="overflow-hidden rounded-2xl border border-line">
                <div
                  className="h-28 border-b border-line"
                  style={{ background: c.hex }}
                />
                <div className="flex items-center justify-between px-4 py-3 text-sm">
                  <span>{c.name}</span>
                  <span className="font-mono text-[12px] text-mute">{c.hex}</span>
                </div>
              </li>
            ))}
          </ul>
        </section>

        <section className="mt-20">
          <h2 className="font-display text-2xl">Wordmark</h2>
          <p className="mt-2 max-w-xl text-mute">
            Always one word. Never Billion Universe. Ink {BRAND.ink} on paper, or white on core.
          </p>
          <div className="mt-8 rounded-2xl border border-line px-8 py-14">
            <Wordmark className="text-4xl sm:text-6xl tracking-[-0.03em] text-ink" />
          </div>
        </section>
      </main>
    </Chrome>
  );
}
