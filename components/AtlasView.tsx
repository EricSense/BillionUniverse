"use client";

import Link from "next/link";
import { useEffect, useMemo, useState } from "react";
import { DISTRICTS, NEIGHBORS } from "@/lib/world";
import { coordLabel, readPerson, type Person } from "@/lib/person";
import { Shell } from "./Shell";

export function AtlasView() {
  const [person, setPerson] = useState<Person | null>(null);
  const [focus, setFocus] = useState<string | null>(null);
  useEffect(() => {
    setPerson(readPerson());
  }, []);

  const lights = useMemo(() => {
    const extra = Array.from({ length: 220 }, (_, i) => {
      const a = (i * 1.618) % 1;
      const b = (i * 0.317) % 1;
      return {
        id: `g${i}`,
        x: 0.06 + a * 0.88,
        y: 0.14 + ((Math.sin(i) + 1) / 2) * 0.7 * (0.35 + b * 0.65),
      };
    });
    return extra;
  }, []);

  const district = DISTRICTS.find((d) => d.slug === focus);
  const neighbor = NEIGHBORS.find((n) => n.name === focus);
  const you = Boolean(person && focus === "you");

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-[12px] tracking-[0.25em] text-lamp uppercase">Atlas</p>
        <h1 className="serif mt-2 text-4xl md:text-5xl">Everyone has coordinates.</h1>
        <p className="mt-3 max-w-xl text-sm text-mist">
          Gold is a district. Pale lights are lives. Your plot, if you claimed one, is the ring.
          This is not a map of nations. It is a map of inhabited rooms.
        </p>

        <div className="relative mt-8 aspect-[16/10] overflow-hidden border border-line bg-night">
          <svg viewBox="0 0 1000 625" className="h-full w-full">
            <rect width="1000" height="625" fill="#10131c" />
            {lights.map((l) => (
              <circle
                key={l.id}
                cx={l.x * 1000}
                cy={l.y * 625}
                r="1.4"
                fill="#7ab0c8"
                opacity="0.35"
              />
            ))}
            {NEIGHBORS.map((n) => (
              <circle
                key={n.name}
                cx={n.x * 1000}
                cy={n.y * 625}
                r="4"
                fill="#f3ead6"
                className="cursor-pointer"
                onClick={() => setFocus(n.name)}
              />
            ))}
            {DISTRICTS.map((d) => (
              <g
                key={d.slug}
                className="cursor-pointer"
                onClick={() => setFocus(d.slug)}
              >
                <circle cx={d.x * 1000} cy={d.y * 625} r="7" fill="#e8c07a" />
                <text
                  x={d.x * 1000 + 12}
                  y={d.y * 625 + 4}
                  fill="#e8c07a"
                  fontSize="13"
                  fontFamily="serif"
                >
                  {d.name}
                </text>
              </g>
            ))}
            {person ? (
              <g className="cursor-pointer" onClick={() => setFocus("you")}>
                <circle
                  cx={person.x * 1000}
                  cy={person.y * 625}
                  r="11"
                  fill="none"
                  stroke="#e8c07a"
                  strokeWidth="2"
                />
                <circle cx={person.x * 1000} cy={person.y * 625} r="3" fill="#e8c07a" />
              </g>
            ) : null}
          </svg>
        </div>

        <div className="mt-5 min-h-20 border border-line bg-panel p-4 text-sm">
          {district ? (
            <div>
              <p className="text-lamp">{district.name}</p>
              <p className="mt-1 text-mist">{district.line}</p>
              <Link href={`/d/${district.slug}`} className="mt-2 inline-block text-paper underline">
                Walk in
              </Link>
            </div>
          ) : neighbor ? (
            <div>
              <p className="text-paper">{neighbor.name}</p>
              <p className="mt-1 text-mist">
                {neighbor.city} · {neighbor.making}
              </p>
            </div>
          ) : you && person ? (
            <div>
              <p className="text-lamp">You · {coordLabel(person.x, person.y)}</p>
              <p className="mt-1 text-mist">
                {person.city} · {person.making}
              </p>
            </div>
          ) : (
            <p className="text-mist">Touch a light or a district.</p>
          )}
        </div>
      </div>
    </Shell>
  );
}
