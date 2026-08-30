import Link from "next/link";
import { ArrowRight, Boxes, Cloud, Cpu, Radio, Unplug, Users } from "lucide-react";
import { Mark } from "@/components/Mark";
import { JobDiagram } from "@/components/landing/JobDiagram";

const layers = [
  {
    n: "01",
    title: "Access",
    icon: Radio,
    copy: "Browser-based. No install. Session state — code, files, project config — lives in the cloud, not on a device. A phone in a coffee shop and a laptop at a desk are the same experience.",
  },
  {
    n: "02",
    title: "Build",
    icon: Boxes,
    copy: "A spectrum, not a binary. Drag-and-drop and prompts for anyone. Drop into code when you hit the ceiling. Same underlying graph either way — not two products bolted together.",
  },
  {
    n: "03",
    title: "Collaboration",
    icon: Users,
    copy: "Multiplayer by default. Presence, comments, shared previews. Baked into the architecture, not retrofitted onto a single-player file.",
  },
  {
    n: "04",
    title: "Execution",
    icon: Cpu,
    copy: "Submit a job. Stream status back. Cloud compute for software. A 3D printer, a robotics rig, a lab instrument for physical work. Same pattern.",
  },
];

export default function HomePage() {
  return (
    <div className="stars relative flex flex-1 flex-col">
      <header className="mx-auto flex w-full max-w-6xl items-center justify-between px-5 py-5">
        <Link href="/" className="flex items-center gap-2.5">
          <Mark />
          <span className="text-sm tracking-wide">Billion Universe</span>
        </Link>
        <nav className="flex items-center gap-2 text-sm">
          <Link href="/#insight" className="hidden px-3 py-1.5 text-mute sm:inline">
            Insight
          </Link>
          <Link
            href="/studio"
            className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3.5 py-1.5 font-medium text-black"
          >
            Enter studio <ArrowRight size={14} />
          </Link>
        </nav>
      </header>

      <main className="mx-auto w-full max-w-6xl flex-1 px-5 pb-24">
        <section className="grid items-center gap-12 py-10 lg:grid-cols-[1.15fr_0.85fr] lg:py-20">
          <div>
            <p className="text-[11px] uppercase tracking-[0.28em] text-lime">One platform · four layers</p>
            <h1 className="font-serif mt-4 text-[clamp(3rem,8vw,6.4rem)] leading-[0.92] tracking-[-0.04em]">
              Build from
              <br />
              anywhere.
            </h1>
            <p className="mt-6 max-w-xl text-lg leading-8 text-mute">
              Anyone can build anything, from any device, alone or together. The interface you
              direct with and the place the work runs are decoupled — so software (and eventually
              hardware) stops caring what device you’re on, how technical you are, or who else is
              in the room.
            </p>
            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href="/studio"
                className="inline-flex items-center gap-2 rounded-full bg-lime px-5 py-2.5 text-sm font-semibold text-black"
              >
                Open the studio
                <ArrowRight size={16} />
              </Link>
              <Link
                href="/#layers"
                className="inline-flex items-center gap-2 rounded-full border border-white/12 px-5 py-2.5 text-sm text-text"
              >
                Read the layers
              </Link>
            </div>
          </div>
          <JobDiagram />
        </section>

        <section id="layers" className="scroll-mt-8 py-10">
          <p className="text-[11px] uppercase tracking-[0.22em] text-mute">Layers, not products</p>
          <h2 className="font-serif mt-3 max-w-2xl text-4xl leading-tight tracking-[-0.03em] sm:text-5xl">
            Ambitious, but it hangs together as a single concept.
          </h2>
          <div className="mt-10 grid gap-4 md:grid-cols-2">
            {layers.map((layer) => (
              <article key={layer.n} className="panel rounded-3xl p-6">
                <div className="flex items-center justify-between">
                  <span className="font-mono text-xs text-lime">{layer.n}</span>
                  <layer.icon size={18} className="text-violet" />
                </div>
                <h3 className="mt-4 text-xl">{layer.title}</h3>
                <p className="mt-2 text-sm leading-6 text-mute">{layer.copy}</p>
              </article>
            ))}
          </div>
        </section>

        <section id="insight" className="panel mt-8 rounded-[2rem] p-7 sm:p-10">
          <div className="flex items-center gap-2 text-cyan">
            <Unplug size={18} />
            <p className="text-[11px] uppercase tracking-[0.22em]">The insight worth keeping</p>
          </div>
          <h2 className="font-serif mt-4 max-w-3xl text-3xl leading-tight tracking-[-0.03em] sm:text-5xl">
            Separate where the work is directed from where the work executes.
          </h2>
          <p className="mt-5 max-w-3xl text-base leading-7 text-mute">
            Most “build from anywhere” platforms conflate four different problems: remote access,
            no-code abstraction, real-time collaboration, and physical execution. They don’t have
            to be conflated. Once a project is a <em className="text-text">job you submit</em> — not
            a file you edit on a specific machine — “browser on a phone,” “visual builder,” “raw
            code,” and “a 3D printer in another room” are all just different front ends and
            different execution backends pointed at the same underlying job system.
          </p>
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {[
              {
                k: "Direct",
                v: "Visual, code, or prompt. Phone or desk. Alone or with presence in the graph.",
              },
              {
                k: "Represent",
                v: "One graph. No-code and code are views, not products. Comments live on nodes.",
              },
              {
                k: "Execute",
                v: "Software preview, cloud build, printer, rig, instrument. Same envelope.",
              },
            ].map((item) => (
              <div key={item.k} className="rounded-2xl border border-white/8 bg-black/20 p-4">
                <p className="font-mono text-xs text-lime">{item.k}</p>
                <p className="mt-2 text-sm leading-6 text-mute">{item.v}</p>
              </div>
            ))}
          </div>
          <p className="mt-8 flex items-start gap-2 text-sm text-mute">
            <Cloud size={16} className="mt-0.5 shrink-0 text-violet" />
            Hardware is a genuinely different product than the software builder. Architecturally it
            is the same job. That is why it belongs here as a backend, not a bolt-on.
          </p>
        </section>

        <section className="mt-16 text-center">
          <p className="font-serif text-3xl tracking-[-0.03em] sm:text-4xl">
            Direct from anywhere. Execute anywhere else.
          </p>
          <Link
            href="/studio"
            className="mt-6 inline-flex items-center gap-2 rounded-full bg-lime px-6 py-3 text-sm font-semibold text-black"
          >
            Enter Billion Universe
            <ArrowRight size={16} />
          </Link>
        </section>
      </main>

      <footer className="mx-auto w-full max-w-6xl px-5 py-8 text-xs text-mute">
        Billion Universe · a job system with many front ends and many backends
      </footer>
    </div>
  );
}
