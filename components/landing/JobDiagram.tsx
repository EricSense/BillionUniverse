"use client";

import { useEffect, useState } from "react";

const FRONTS = ["Phone", "Laptop", "Prompt", "Code"];
const BACKS = ["Preview", "Cloud", "Printer", "Rig"];

export function JobDiagram() {
  const [front, setFront] = useState(0);
  const [back, setBack] = useState(2);

  useEffect(() => {
    const id = setInterval(() => {
      setFront((f) => (f + 1) % FRONTS.length);
      setBack((b) => (b + 1) % BACKS.length);
    }, 1800);
    return () => clearInterval(id);
  }, []);

  return (
    <div className="panel rounded-3xl p-5 sm:p-7">
      <p className="text-[11px] uppercase tracking-[0.22em] text-mute">The job envelope</p>
      <div className="mt-5 grid grid-cols-[1fr_auto_1fr] items-center gap-3 sm:gap-5">
        <div className="space-y-2">
          {FRONTS.map((label, i) => (
            <div
              key={label}
              className={`rounded-2xl border px-3 py-2 text-sm transition-all ${
                i === front
                  ? "border-lime/50 bg-lime/10 text-text"
                  : "border-white/8 text-mute"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
        <div className="flex flex-col items-center gap-2">
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-lime to-transparent sm:w-14" />
          <div className="rounded-full border border-lime/40 bg-lime/15 px-3 py-1 font-mono text-[11px] text-lime">
            JOB
          </div>
          <div className="h-px w-8 bg-gradient-to-r from-transparent via-violet to-transparent sm:w-14" />
        </div>
        <div className="space-y-2">
          {BACKS.map((label, i) => (
            <div
              key={label}
              className={`rounded-2xl border px-3 py-2 text-sm transition-all ${
                i === back
                  ? "border-violet/50 bg-violet/15 text-text"
                  : "border-white/8 text-mute"
              }`}
            >
              {label}
            </div>
          ))}
        </div>
      </div>
      <p className="mt-5 text-sm leading-6 text-mute">
        Front ends direct. Backends execute. The graph in the middle does not care which pair you
        picked.
      </p>
    </div>
  );
}
