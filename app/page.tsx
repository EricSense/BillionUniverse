import { Life } from "@/components/Life";
import { Mark, Wordmark } from "@/components/Mark";
import { Now } from "@/components/Now";
import { BILLION, THESIS } from "@/lib/universe";

export default function Home() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col px-6 py-10">
      <header className="flex items-center justify-between gap-6">
        <span className="inline-flex items-center gap-3">
          <Mark className="h-9 w-9" />
          <Wordmark className="text-[17px] text-ink" />
        </span>
        <Now />
      </header>

      <section className="flex flex-1 flex-col justify-center py-20">
        <p className="text-[11px] tracking-[0.22em] text-ring uppercase">What it should be</p>
        <h1 className="mt-4 font-display text-4xl leading-tight tracking-tight text-ink sm:text-5xl">
          {THESIS.line}
        </h1>
        <p className="mt-6 max-w-xl text-lg leading-relaxed text-mute">{THESIS.body}</p>
        <p className="mt-6 text-sm tracking-wide text-ink">{THESIS.against}</p>
      </section>

      <Life />

      <footer className="mt-16 flex items-center justify-between border-t border-line py-8 text-[12px] tracking-[0.16em] text-mute uppercase">
        <span>BillionUniverse</span>
        <span>1 / {BILLION.toLocaleString("en")}</span>
      </footer>
    </main>
  );
}
