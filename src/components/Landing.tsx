"use client";

import Link from "next/link";
import { ARCHETYPES } from "@/lib/archetypes";
import { usePerson } from "./PersonProvider";
import { Sigil } from "./Sigil";

export function Landing() {
  const { person, ready } = usePerson();

  return (
    <div className="relative z-10">
      <section className="mx-auto max-w-6xl px-6 pb-20 pt-10 md:pb-28 md:pt-16">
        <p className="kicker">A personal operating surface</p>
        <h1 className="font-display mt-6 max-w-5xl text-5xl font-semibold leading-[0.95] md:text-8xl">
          Adapt to the <em className="not-italic text-accent">person</em>,
          <br />
          not the <span className="strike">platform</span>.
        </h1>
        <p className="mt-8 max-w-2xl text-lg leading-relaxed text-muted md:text-xl">
          Platforms ask a billion people to become the same user. Billion Universe inverts
          that: light, language, density, and gravity rearrange around who you are — privately,
          on this device, without an account.
        </p>
        <div className="mt-10 flex flex-wrap gap-3">
          <Link href={person ? "/universe" : "/arrive"} className="btn btn-primary">
            {person ? `Continue as ${person.name}` : "Enter your universe"}
          </Link>
          <Link href="/witness" className="btn btn-ghost">
            Witness three people
          </Link>
        </div>
        {ready && person ? (
          <p className="mt-6 font-mono text-xs uppercase tracking-[0.16em] text-muted">
            Universe already shaped for {person.name}
          </p>
        ) : null}
      </section>

      <section className="border-y border-line">
        <div className="mx-auto grid max-w-6xl gap-0 px-6 md:grid-cols-2">
          <article className="border-line py-14 md:border-r md:pr-12">
            <p className="kicker">The costume</p>
            <h2 className="font-display mt-4 text-3xl md:text-4xl">You already adapt all day.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Slack wants short. Notion wants nested. LinkedIn wants performative. Every product
              is a building with one floor plan. A billion people walk in and learn the stairs.
            </p>
          </article>
          <article className="py-14 md:pl-12">
            <p className="kicker">The room</p>
            <h2 className="font-display mt-4 text-3xl md:text-4xl">The interface should be last to stay the same.</h2>
            <p className="mt-5 leading-relaxed text-muted">
              Identity, pace, climate, and intent are the source of truth. Layout is a
              consequence. If two people open Billion Universe, they should not see the same
              world.
            </p>
          </article>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-20">
        <p className="kicker">How it learns you</p>
        <div className="mt-10 grid gap-6 md:grid-cols-3">
          {[
            {
              n: "01",
              t: "Sense",
              d: "A few human questions — name, pace, gravity, light, grain. No feed, no account, no surveillance score.",
            },
            {
              n: "02",
              t: "Shape",
              d: "Typography, spacing, palette, and modules rearrange in real time. Theme is not a coat of paint. It is architecture.",
            },
            {
              n: "03",
              t: "Stay",
              d: "The universe remembers you here. You can reshape it, inhabit someone else, or walk away. The person is the platform.",
            },
          ].map((step) => (
            <article key={step.n} className="surface p-6">
              <p className="kicker">{step.n}</p>
              <h3 className="font-display mt-4 text-2xl">{step.t}</h3>
              <p className="mt-3 text-sm leading-relaxed text-muted">{step.d}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 pb-24">
        <div className="flex flex-wrap items-end justify-between gap-4">
          <div>
            <p className="kicker">Same product</p>
            <h2 className="font-display mt-3 text-3xl md:text-5xl">Four people. Four worlds.</h2>
          </div>
          <Link href="/witness" className="btn btn-ghost">
            Inhabit them
          </Link>
        </div>
        <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {ARCHETYPES.map((person) => (
            <article key={person.name} className="surface p-5">
              <Sigil name={person.name} size={56} />
              <h3 className="font-display mt-4 text-2xl">{person.name}</h3>
              <p className="mt-1 text-xs uppercase tracking-[0.16em] text-accent">{person.role}</p>
              <p className="mt-3 text-sm leading-relaxed text-muted">{person.line}</p>
            </article>
          ))}
        </div>
      </section>
    </div>
  );
}
