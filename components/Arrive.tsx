"use client";

import { useRouter } from "next/navigation";
import { useMemo, useState, type FormEvent } from "react";
import { hueFromName, plotFromName } from "@/lib/hash";
import { makePerson, writePerson } from "@/lib/person";
import { Shell } from "./Shell";

export function Arrive() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [city, setCity] = useState("");
  const [making, setMaking] = useState("");
  const [err, setErr] = useState("");

  const preview = useMemo(() => {
    if (!name.trim()) return null;
    const plot = plotFromName(name);
    return { plot, hue: hueFromName(name) };
  }, [name]);

  function onSubmit(e: FormEvent) {
    e.preventDefault();
    try {
      const person = makePerson({ name, city, making });
      writePerson(person);
      router.push("/room");
    } catch (ex) {
      setErr(ex instanceof Error ? ex.message : "Could not claim.");
    }
  }

  return (
    <Shell>
      <div className="mx-auto grid max-w-5xl gap-10 px-5 py-12 md:grid-cols-2">
        <div>
          <p className="text-[12px] tracking-[0.25em] text-lamp uppercase">Harbor</p>
          <h1 className="serif mt-3 text-4xl md:text-5xl">Arrive with a name. Keep a room.</h1>
          <p className="mt-4 text-sm text-mist">
            Three fields. The plot is assigned from your name so the same person always stands in
            the same place. Nothing leaves this device.
          </p>
          <form onSubmit={onSubmit} className="mt-8 space-y-4">
            <Field label="Your name" value={name} onChange={setName} required />
            <Field label="City you stand in" value={city} onChange={setCity} />
            <Field
              label="What you are making"
              value={making}
              onChange={setMaking}
              placeholder="a thing that has to exist in the world"
            />
            {err ? <p className="text-sm text-lamp">{err}</p> : null}
            <button type="submit" className="bg-lamp px-4 py-2 text-sm text-void">
              Light the room
            </button>
          </form>
        </div>
        <aside className="border border-line bg-night p-6">
          <p className="text-[12px] tracking-widest text-mist uppercase">Plot preview</p>
          {preview ? (
            <div className="mt-6">
              <div
                className="h-40 w-full"
                style={{
                  background: `radial-gradient(circle at ${preview.plot.x * 100}% ${preview.plot.y * 100}%, hsl(${preview.hue} 40% 40%), #10131c 42%)`,
                }}
              />
              <p className="serif mt-4 text-2xl">{name.trim() || "—"}</p>
              <p className="mt-1 text-sm text-mist">
                Plot {preview.plot.x.toFixed(3)}, {preview.plot.y.toFixed(3)}
              </p>
              <p className="mt-3 text-sm text-paper">{making || "still arriving"}</p>
            </div>
          ) : (
            <p className="mt-6 text-sm text-mist">Type a name and the universe chooses a plot.</p>
          )}
        </aside>
      </div>
    </Shell>
  );
}

function Field({
  label,
  value,
  onChange,
  required,
  placeholder,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  required?: boolean;
  placeholder?: string;
}) {
  return (
    <label className="block text-sm">
      {label}
      <input
        required={required}
        value={value}
        placeholder={placeholder}
        onChange={(e) => onChange(e.target.value)}
        className="mt-1 w-full border border-line bg-void px-3 py-2 text-paper outline-none focus:border-lamp"
      />
    </label>
  );
}
