"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Mark } from "./Mark";
import { readPerson, type Person } from "@/lib/person";
import { THESIS } from "@/lib/copy";

export function Gate() {
  const [person, setPerson] = useState<Person | null | "wait">("wait");
  useEffect(() => {
    setPerson(readPerson());
  }, []);

  return (
    <div className="grain relative min-h-screen">
      <div className="mx-auto flex min-h-screen max-w-3xl flex-col justify-between px-6 py-10">
        <div className="flex items-center gap-2 text-mist">
          <Mark />
          <span className="text-sm tracking-wide">Billion Universe</span>
        </div>
        <div>
          <p className="text-[12px] tracking-[0.25em] text-lamp uppercase">Enter</p>
          <h1 className="serif mt-4 text-5xl leading-[1.05] md:text-7xl">{THESIS.line}</h1>
          <p className="mt-6 max-w-md text-mist">
            Not an app. A world. Claim a room, take a plot, walk the districts. The atlas is already
            lit by other lives.
          </p>
          <div className="mt-10 flex flex-wrap gap-3">
            {person && person !== "wait" ? (
              <>
                <Link href="/room" className="bg-lamp px-5 py-2.5 text-void">
                  Return to your room
                </Link>
                <Link href="/atlas" className="border border-line px-5 py-2.5 hover:border-lamp">
                  Open the atlas
                </Link>
              </>
            ) : (
              <>
                <Link href="/arrive" className="bg-lamp px-5 py-2.5 text-void">
                  Claim a room
                </Link>
                <Link href="/atlas" className="border border-line px-5 py-2.5 hover:border-lamp">
                  Look at the atlas first
                </Link>
              </>
            )}
          </div>
          {person && person !== "wait" ? (
            <p className="mt-6 text-sm text-mist">
              {person.name} · {person.city} · still burning
            </p>
          ) : null}
        </div>
        <p className="text-[12px] text-mist">A billion is a constraint, not a slogan.</p>
      </div>
    </div>
  );
}
