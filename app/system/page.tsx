import type { Metadata } from "next";
import Link from "next/link";
import { faculties } from "@/lib/mind";

export const metadata: Metadata = { title: "Faculties · Billion Universe" };

const MEANING: Record<string, string> = {
  sense: "Take in language, files, the world. Nothing is thought until it is sensed.",
  memory: "What persists across turns — names, decisions, the plot. Stored on this device.",
  reason: "Route. Decompose. Decide. Not a single frozen model — a faculty that chooses the act.",
  make: "Compose: plans, drafts, frames. The hands of the mind.",
  act: "Write memory, compute, call a tool. Thought that touches the world.",
};

export default function Page() {
  return (
    <main className="mx-auto max-w-2xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-mind uppercase">Architecture</p>
      <h1 className="mt-2 text-4xl">A Universal AI is a system, not a model.</h1>
      <p className="mt-4 text-sm leading-relaxed text-mist">
        Engines already power the world: connectivity, space, chips, superintelligence. Billion
        Universe is the intelligence that can inhabit every domain — one thread, five faculties,
        memory that lasts. Models will change. The system is the product.
      </p>
      <ol className="mt-10 space-y-6">
        {faculties().map((f, i) => (
          <li key={f} className="border-t border-line pt-4">
            <p className="mono text-[11px] text-mind">
              {String(i + 1).padStart(2, "0")} {f}
            </p>
            <p className="mt-2 text-sm text-mist">{MEANING[f]}</p>
          </li>
        ))}
      </ol>
      <p className="mt-12 text-sm">
        <Link href="/" className="text-mind">
          ← Speak to it
        </Link>
      </p>
    </main>
  );
}
