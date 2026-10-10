import Link from "next/link";
import type { District } from "@/lib/world";
import { NEIGHBORS, PLAN } from "@/lib/world";
import { THESIS } from "@/lib/copy";
import { Shell } from "./Shell";

export function DistrictView({ district }: { district: District }) {
  return (
    <Shell>
      <article className="mx-auto max-w-2xl px-5 py-12">
        <p className="text-[12px] tracking-[0.25em] text-lamp uppercase">{district.kind}</p>
        <h1 className="serif mt-2 text-5xl">{district.name}</h1>
        <p className="mt-4 text-lg text-mist">{district.line}</p>
        <p className="mt-6 text-sm leading-relaxed text-mist">{district.body}</p>

        {district.slug === "library" ? <Library /> : null}
        {district.slug === "workshop" ? <Workshop /> : null}
        {district.slug === "commons" ? <Commons /> : null}
        {district.slug === "harbor" ? <Harbor /> : null}

        <p className="mt-12 text-sm">
          <Link href="/atlas" className="text-lamp">
            ← Atlas
          </Link>
        </p>
      </article>
    </Shell>
  );
}

function Library() {
  return (
    <div className="mt-12 space-y-10">
      <section>
        <h2 className="serif text-3xl">What it does</h2>
        <p className="mt-3 text-sm leading-relaxed text-mist">{THESIS.does}</p>
      </section>
      <section>
        <h2 className="serif text-3xl">What it solves</h2>
        <p className="mt-3 text-sm leading-relaxed text-mist">{THESIS.solves}</p>
      </section>
      <section>
        <h2 className="serif text-3xl">What it makes possible</h2>
        <ul className="mt-4 space-y-4">
          {THESIS.possible.map((p) => (
            <li key={p.title}>
              <p className="text-paper">{p.title}</p>
              <p className="mt-1 text-sm text-mist">{p.body}</p>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}

function Workshop() {
  return (
    <ol className="mt-12 space-y-8">
      {PLAN.map((w) => (
        <li key={w.when} className="border-t border-line pt-6">
          <p className="text-[12px] text-lamp">{w.when}</p>
          <h2 className="serif mt-1 text-3xl">{w.title}</h2>
          <p className="mt-3 text-sm text-mist">{w.body}</p>
        </li>
      ))}
    </ol>
  );
}

function Commons() {
  return (
    <ul className="mt-10 space-y-3">
      {NEIGHBORS.map((n) => (
        <li key={n.name} className="border border-line bg-night px-4 py-3">
          <p className="text-paper">{n.name}</p>
          <p className="text-sm text-mist">
            {n.city} · {n.making}
          </p>
        </li>
      ))}
    </ul>
  );
}

function Harbor() {
  return (
    <div className="mt-10 border border-line bg-night p-5">
      <p className="text-sm text-mist">
        The Harbor is the only form. Name, city, what you are making. Then a room.
      </p>
      <Link href="/arrive" className="mt-4 inline-block bg-lamp px-4 py-2 text-sm text-void">
        Arrive
      </Link>
    </div>
  );
}
