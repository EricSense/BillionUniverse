import { Chrome } from "@/components/Chrome";
import { Field } from "@/components/Field";
import { Lockup } from "@/components/Mark";
import { COMPANY, LAYERS } from "@/lib/brand";

export default function Home() {
  return (
    <Chrome>
      <section className="relative overflow-hidden">
        <Field className="absolute left-1/2 top-1/2 h-[min(90vw,44rem)] w-[min(90vw,44rem)] -translate-x-1/2 -translate-y-1/2 opacity-70" />
        <div className="relative mx-auto flex min-h-[calc(100svh-4.25rem)] max-w-6xl flex-col items-center justify-center px-6 py-24">
          <Lockup
            markClass="h-[4.6rem] w-[4.6rem] sm:h-[5.6rem] sm:w-[5.6rem]"
            textClass="text-[2.05rem] sm:text-[3.15rem] tracking-[-0.03em] text-ink"
          />
          <p className="mt-10 font-display text-sm tracking-[0.28em] text-mute uppercase">
            {COMPANY.tag}
          </p>
        </div>
      </section>

      <section className="border-t border-line">
        <div className="mx-auto grid max-w-6xl gap-12 px-6 py-20 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)]">
          <div>
            <p className="text-[11px] tracking-[0.22em] text-ring uppercase">Product</p>
            <h2 className="mt-3 font-display text-3xl tracking-tight text-ink sm:text-4xl">
              {COMPANY.make}
            </h2>
          </div>
          <p className="max-w-xl text-[17px] leading-relaxed text-mute">{COMPANY.product}</p>
        </div>
      </section>

      <section className="border-t border-line bg-mist/60">
        <div className="mx-auto grid max-w-6xl gap-px bg-line sm:grid-cols-2 lg:grid-cols-4">
          {LAYERS.map((layer) => (
            <article key={layer.n} className="bg-paper px-8 py-12">
              <p className="text-[11px] tracking-[0.22em] text-ring uppercase">{layer.n}</p>
              <h2 className="mt-3 font-display text-xl text-ink">{layer.name}</h2>
              <p className="mt-4 max-w-[16rem] text-[15px] leading-relaxed text-mute">{layer.line}</p>
            </article>
          ))}
        </div>
      </section>
    </Chrome>
  );
}
