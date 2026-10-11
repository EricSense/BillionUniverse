import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { Mark } from "@/components/Mark";
import { LAYERS } from "@/lib/brand";

export const metadata: Metadata = { title: "Scale" };

const STEPS = [
  { n: "1", label: "One" },
  { n: "10³", label: "A thousand" },
  { n: "10⁶", label: "A million" },
  { n: "10⁹", label: "A billion" },
] as const;

export default function ScalePage() {
  return (
    <Chrome>
      <main className="mx-auto max-w-6xl px-6 py-20">
        <p className="text-[11px] tracking-[0.22em] text-ring uppercase">Scale</p>
        <h1 className="mt-3 font-display text-4xl tracking-tight text-ink sm:text-5xl">
          Radius is the product.
        </h1>
        <p className="mt-5 max-w-xl text-lg leading-relaxed text-mute">
          The mark is a core and the rings it can hold. BillionUniverse is that geometry at
          the scale of a billion lives.
        </p>

        <ol className="mt-16 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map((step, i) => (
            <li key={step.n} className="rounded-2xl border border-line px-6 py-10">
              <Mark className="h-16 w-16" />
              <p className="mt-8 font-display text-3xl tracking-tight">{step.n}</p>
              <p className="mt-2 text-sm uppercase tracking-[0.18em] text-mute">{step.label}</p>
              <p className="mt-4 text-[15px] leading-relaxed text-mute">{LAYERS[i].line}</p>
            </li>
          ))}
        </ol>
      </main>
    </Chrome>
  );
}
