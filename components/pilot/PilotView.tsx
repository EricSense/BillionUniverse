"use client";

import { useState, type FormEvent } from "react";

export function PilotView() {
  const [state, setState] = useState<"idle" | "sent" | "err">("idle");
  const [company, setCompany] = useState("");
  const [email, setEmail] = useState("");
  const [need, setNeed] = useState("Warehouse AMR / fulfillment");

  async function onSubmit(e: FormEvent) {
    e.preventDefault();
    const res = await fetch("/api/pilot", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ company, email, need }),
    });
    setState(res.ok ? "sent" : "err");
  }

  return (
    <div className="mx-auto max-w-xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">Pilot</p>
      <h1 className="serif mt-2 text-4xl">Sell the first slice, not the frontier lab.</h1>
      <p className="mt-4 text-sm text-mist">
        Mid-size robotics and logistics teams who need environment data now. A pilot is three
        similar warehouses as UB-01 bundles, plus a week on the integration. Indicative: custom
        capture $8k–$25k per facility; vertical slice license $50k–$150k / year.
      </p>
      {state === "sent" ? (
        <p className="mt-10 border border-scan px-4 py-6 text-sm">
          Logged. In this demo nothing leaves the browser session — the route acknowledges the
          request so the motion is real.
        </p>
      ) : (
        <form onSubmit={onSubmit} className="mt-10 space-y-4">
          <label className="block text-sm">
            Company
            <input
              required
              value={company}
              onChange={(e) => setCompany(e.target.value)}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            Work email
            <input
              required
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            />
          </label>
          <label className="block text-sm">
            What you train
            <select
              value={need}
              onChange={(e) => setNeed(e.target.value)}
              className="mt-1 w-full border border-line bg-ink px-3 py-2"
            >
              <option>Warehouse AMR / fulfillment</option>
              <option>Last-mile / sidewalk robot</option>
              <option>World model / video-to-action</option>
              <option>Retail inventory robot</option>
              <option>Construction / site safety</option>
            </select>
          </label>
          <button type="submit" className="bg-scan px-4 py-2 text-sm text-void">
            Request the warehouse slice
          </button>
          {state === "err" ? <p className="text-sm text-copper">Could not submit.</p> : null}
        </form>
      )}
    </div>
  );
}
