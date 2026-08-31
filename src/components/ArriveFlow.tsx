"use client";

import { useEffect, useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import {
  CLIMATE_OPTIONS,
  GRAIN_OPTIONS,
  GRAVITY_OPTIONS,
  PACE_OPTIONS,
} from "@/lib/copy";
import type { Climate, Grain, Gravity, Pace, Person } from "@/lib/person";
import { usePerson } from "./PersonProvider";

type Draft = {
  name: string;
  pace: Pace;
  gravity: Gravity;
  climate: Climate;
  grain: Grain;
};

const steps = ["Name", "Pace", "Gravity", "Light", "Grain"] as const;

export function ArriveFlow() {
  const router = useRouter();
  const { person, inhabit } = usePerson();
  const [step, setStep] = useState(0);
  const [draft, setDraft] = useState<Draft>({
    name: person?.name ?? "",
    pace: person?.pace ?? "spacious",
    gravity: person?.gravity ?? "create",
    climate: person?.climate ?? "dusk",
    grain: person?.grain ?? "warm",
  });

  const preview = useMemo<Person>(
    () => ({
      name: draft.name.trim() || "You",
      pace: draft.pace,
      gravity: draft.gravity,
      climate: draft.climate,
      grain: draft.grain,
      arrivedAt: new Date().toISOString(),
    }),
    [draft],
  );

  useEffect(() => {
    if (person?.name && person.name !== "You" && !draft.name) {
      setDraft({
        name: person.name,
        pace: person.pace,
        gravity: person.gravity,
        climate: person.climate,
        grain: person.grain,
      });
    }
  }, [person, draft.name]);

  useEffect(() => {
    inhabit(preview, false);
    // Apply the live room once on arrival so climate and grain start from this draft.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const applyPreview = (next: Partial<Draft>) => {
    const merged = { ...draft, ...next };
    setDraft(merged);
    inhabit(
      {
        name: merged.name.trim() || "You",
        pace: merged.pace,
        gravity: merged.gravity,
        climate: merged.climate,
        grain: merged.grain,
        arrivedAt: new Date().toISOString(),
      },
      false,
    );
  };

  const complete = () => {
    const named = draft.name.trim();
    if (!named) {
      setStep(0);
      return;
    }
    inhabit(
      {
        ...preview,
        name: named,
        arrivedAt: new Date().toISOString(),
      },
      true,
    );
    router.push("/universe");
  };

  return (
    <div className="relative z-10 mx-auto max-w-3xl px-6 py-10 md:py-16">
      <p className="kicker">
        Arrival {String(step + 1).padStart(2, "0")} / 05 — {steps[step]}
      </p>
      <div className="mt-4 h-1 overflow-hidden rounded-person bg-line">
        <div
          className="h-full bg-accent transition-all duration-500"
          style={{ width: `${((step + 1) / steps.length) * 100}%` }}
        />
      </div>

      {step === 0 ? (
        <section className="mt-10">
          <h1 className="font-display text-4xl md:text-6xl">What should we call you?</h1>
          <p className="mt-4 max-w-xl text-muted">
            Not a username. A name the room can speak. It stays on this device.
          </p>
          <label className="mt-10 block">
            <span className="kicker">Name</span>
            <input
              autoFocus
              value={draft.name}
              onChange={(event) => applyPreview({ name: event.target.value })}
              placeholder="Your name"
              maxLength={40}
              className="mt-3 w-full border-b border-line bg-transparent py-3 text-3xl outline-none placeholder:text-muted"
            />
          </label>
        </section>
      ) : null}

      {step === 1 ? (
        <section className="mt-10">
          <h1 className="font-display text-4xl md:text-6xl">How do you like to move?</h1>
          <p className="mt-4 text-muted">Spacing and density will follow this — immediately.</p>
          <div className="mt-8 grid gap-3">
            {PACE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="choice"
                aria-pressed={draft.pace === option.id}
                onClick={() => applyPreview({ pace: option.id })}
              >
                <span className="font-display text-xl">{option.title}</span>
                <span className="mt-1 block text-sm text-muted">{option.detail}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 2 ? (
        <section className="mt-10">
          <h1 className="font-display text-4xl md:text-6xl">What pulls you here?</h1>
          <p className="mt-4 text-muted">Gravity chooses which room the universe becomes.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {GRAVITY_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="choice"
                aria-pressed={draft.gravity === option.id}
                onClick={() => applyPreview({ gravity: option.id })}
              >
                <span className="font-display text-xl">{option.title}</span>
                <span className="mt-1 block text-sm text-muted">{option.detail}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 3 ? (
        <section className="mt-10">
          <h1 className="font-display text-4xl md:text-6xl">What light do you work in?</h1>
          <p className="mt-4 text-muted">Climate is not a theme toggle. It is the hour of the room.</p>
          <div className="mt-8 grid gap-3 sm:grid-cols-2">
            {CLIMATE_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="choice"
                aria-pressed={draft.climate === option.id}
                onClick={() => applyPreview({ climate: option.id })}
              >
                <span className="font-display text-xl">{option.title}</span>
                <span className="mt-1 block text-sm text-muted">{option.detail}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      {step === 4 ? (
        <section className="mt-10">
          <h1 className="font-display text-4xl md:text-6xl">How should it feel?</h1>
          <p className="mt-4 text-muted">Grain changes the voice: serif warmth, sharp instrument, or soft cloth.</p>
          <div className="mt-8 grid gap-3">
            {GRAIN_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className="choice"
                aria-pressed={draft.grain === option.id}
                onClick={() => applyPreview({ grain: option.id })}
              >
                <span className="font-display text-xl">{option.title}</span>
                <span className="mt-1 block text-sm text-muted">{option.detail}</span>
              </button>
            ))}
          </div>
        </section>
      ) : null}

      <div className="mt-12 flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          className="btn btn-ghost"
          onClick={() => setStep((current) => Math.max(0, current - 1))}
          disabled={step === 0}
        >
          Back
        </button>
        {step < steps.length - 1 ? (
          <button
            type="button"
            className="btn btn-primary"
            onClick={() => {
              if (step === 0 && !draft.name.trim()) return;
              setStep((current) => current + 1);
            }}
            disabled={step === 0 && !draft.name.trim()}
          >
            Continue
          </button>
        ) : (
          <button type="button" className="btn btn-primary" onClick={complete}>
            Open the universe
          </button>
        )}
      </div>
    </div>
  );
}
