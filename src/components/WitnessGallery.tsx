"use client";

import Link from "next/link";
import { ARCHETYPES } from "@/lib/archetypes";
import { gravityTitle, thesisFor } from "@/lib/copy";
import { usePerson } from "./PersonProvider";
import { Sigil } from "./Sigil";

export function WitnessGallery() {
  const { person, inhabit } = usePerson();

  return (
    <div className="relative z-10 mx-auto max-w-6xl px-6 py-10 md:py-16">
      <p className="kicker">Proof</p>
      <h1 className="font-display mt-4 max-w-4xl text-4xl md:text-6xl">
        Same product. Different people. Different worlds.
      </h1>
      <p className="mt-5 max-w-2xl text-muted">
        Click a person and the entire surface — light, type, density, modules — becomes theirs.
        This is not a theme switcher. It is architecture following identity.
      </p>

      <div className="mt-10 grid gap-4 md:grid-cols-2">
        {ARCHETYPES.map((archetype) => {
          const active = person?.name === archetype.name;
          return (
            <button
              key={archetype.name}
              type="button"
              className="choice flex items-start gap-4"
              aria-pressed={active}
              onClick={() => inhabit(archetype, false)}
            >
              <Sigil name={archetype.name} size={64} />
              <span className="block text-left">
                <span className="font-display text-2xl">{archetype.name}</span>
                <span className="mt-1 block text-xs uppercase tracking-[0.16em] text-accent">
                  {archetype.role} · {gravityTitle(archetype.gravity)}
                </span>
                <span className="mt-3 block text-sm leading-relaxed text-muted">
                  {archetype.line}
                </span>
              </span>
            </button>
          );
        })}
      </div>

      {person ? (
        <aside className="surface mt-10 p-6">
          <p className="kicker">Now inhabiting</p>
          <p className="font-display mt-3 text-2xl md:text-3xl">{person.name}</p>
          <p className="mt-3 max-w-2xl text-muted">{thesisFor(person)}</p>
          <div className="mt-6 flex flex-wrap gap-3">
            <Link href="/universe" className="btn btn-primary">
              Open {person.name}&apos;s universe
            </Link>
            <Link href="/arrive" className="btn btn-ghost">
              Become yourself
            </Link>
          </div>
        </aside>
      ) : (
        <p className="mt-10 text-muted">Choose someone. Watch the climate change.</p>
      )}
    </div>
  );
}
