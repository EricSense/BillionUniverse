"use client";

import { FormEvent, useEffect, useState } from "react";
import {
  BILLION,
  STORAGE_KEY,
  createLife,
  formatEntered,
  parseLife,
  type Life as LifeRecord,
} from "@/lib/universe";

export function Life() {
  const [life, setLife] = useState<LifeRecord | null>(null);
  const [ready, setReady] = useState(false);
  const [name, setName] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    setLife(parseLife(window.localStorage.getItem(STORAGE_KEY)));
    setReady(true);
  }, []);

  function enter(event: FormEvent) {
    event.preventDefault();
    try {
      const next = createLife(name);
      window.localStorage.setItem(STORAGE_KEY, JSON.stringify(next));
      setLife(next);
      setError("");
    } catch (err) {
      setError(err instanceof Error ? err.message : "Could not enter.");
    }
  }

  function leave() {
    window.localStorage.removeItem(STORAGE_KEY);
    setLife(null);
    setName("");
  }

  if (!ready) {
    return <div className="h-40" />;
  }

  if (life) {
    return (
      <section className="rounded-2xl border border-line px-8 py-10">
        <p className="text-[11px] tracking-[0.22em] text-ring uppercase">A life</p>
        <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">{life.name}</h2>
        <p className="mt-4 text-[15px] leading-relaxed text-mute">
          You live here. Entered {formatEntered(life.enteredAt)}. You are 1 of{" "}
          {BILLION.toLocaleString("en")}.
        </p>
        <button
          type="button"
          onClick={leave}
          className="mt-8 text-[12px] tracking-[0.18em] text-mute uppercase hover:text-ink"
        >
          Leave
        </button>
      </section>
    );
  }

  return (
    <section className="rounded-2xl border border-line px-8 py-10">
      <p className="text-[11px] tracking-[0.22em] text-ring uppercase">Radius one</p>
      <h2 className="mt-3 font-display text-3xl tracking-tight text-ink">Become a life.</h2>
      <p className="mt-4 max-w-md text-[15px] leading-relaxed text-mute">
        A universe starts with someone in it. This is not an account. It is you, here.
      </p>
      <form onSubmit={enter} className="mt-8 flex flex-col gap-4 sm:flex-row">
        <label className="sr-only" htmlFor="life-name">
          Your name
        </label>
        <input
          id="life-name"
          value={name}
          onChange={(event) => setName(event.target.value)}
          maxLength={48}
          placeholder="Your name"
          autoComplete="name"
          className="h-12 flex-1 rounded-full border border-line bg-paper px-5 text-[15px] text-ink outline-none placeholder:text-mute focus:border-ring"
        />
        <button
          type="submit"
          className="h-12 rounded-full bg-core px-7 text-[12px] font-medium tracking-[0.18em] text-paper uppercase"
        >
          Enter
        </button>
      </form>
      {error ? <p className="mt-3 text-sm text-core">{error}</p> : null}
    </section>
  );
}
