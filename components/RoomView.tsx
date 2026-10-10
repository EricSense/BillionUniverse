"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { hueFromName } from "@/lib/hash";
import { clearPerson, coordLabel, readPerson, type Person } from "@/lib/person";
import { Shell } from "./Shell";

export function RoomView() {
  const [person, setPerson] = useState<Person | null | "wait">("wait");
  useEffect(() => {
    setPerson(readPerson());
  }, []);

  if (person === "wait") {
    return (
      <Shell>
        <p className="px-5 py-20 text-mist">Looking for your light…</p>
      </Shell>
    );
  }

  if (!person) {
    return (
      <Shell>
        <div className="mx-auto max-w-xl px-5 py-20">
          <h1 className="serif text-4xl">No room is lit on this device.</h1>
          <Link href="/arrive" className="mt-6 inline-block bg-lamp px-4 py-2 text-sm text-void">
            Claim one
          </Link>
        </div>
      </Shell>
    );
  }

  const hue = hueFromName(person.name);

  return (
    <Shell>
      <div className="mx-auto max-w-5xl px-5 py-10">
        <p className="text-[12px] tracking-[0.25em] text-lamp uppercase">Your room</p>
        <h1 className="serif mt-2 text-5xl">{person.name}</h1>
        <p className="mt-2 text-mist">
          {person.city} · {coordLabel(person.x, person.y)} · claimed{" "}
          {new Date(person.claimedAt).toLocaleDateString()}
        </p>

        <div className="mt-10 overflow-hidden border border-line">
          <div
            className="relative h-72 md:h-96"
            style={{
              background: `linear-gradient(180deg, hsl(${hue} 25% 12%), #07080c 70%)`,
            }}
          >
            <div className="absolute inset-x-10 top-8 h-24 border border-white/10 bg-black/20">
              <div
                className="h-full w-full opacity-80"
                style={{
                  background: `radial-gradient(circle at ${person.x * 100}% ${person.y * 100}%, #e8c07a, transparent 28%), #10131c`,
                }}
              />
            </div>
            <div className="absolute bottom-0 left-0 right-0 border-t border-line bg-night/90 p-5">
              <p className="text-[12px] tracking-widest text-mist uppercase">On the table</p>
              <p className="serif mt-1 text-2xl">{person.making}</p>
            </div>
          </div>
        </div>

        <div className="mt-8 flex flex-wrap gap-3 text-sm">
          <Link href="/atlas" className="border border-line px-4 py-2 hover:border-lamp">
            Stand on the atlas
          </Link>
          <Link href="/d/commons" className="border border-line px-4 py-2 hover:border-lamp">
            Walk to the Commons
          </Link>
          <button
            type="button"
            className="text-mist underline-offset-4 hover:text-paper hover:underline"
            onClick={() => {
              clearPerson();
              setPerson(null);
            }}
          >
            Extinguish this room
          </button>
        </div>
      </div>
    </Shell>
  );
}
