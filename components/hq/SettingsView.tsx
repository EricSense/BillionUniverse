"use client";

import { useStore } from "@/lib/store";
import { SECTORS, STAGES } from "@/lib/catalog";
import type { CompanyStage, Sector } from "@/lib/types";

export function SettingsView() {
  const { company, updateCompany, resetDemo } = useStore();
  if (!company) return null;

  return (
    <div className="mx-auto max-w-3xl">
      <p className="text-xs uppercase tracking-[0.18em] text-hq-mist">Settings</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">Company</h1>
      <div className="mt-8 space-y-4">
        <Field
          label="Name"
          value={company.name}
          onChange={(value) => updateCompany({ name: value })}
        />
        <Field
          label="Tagline"
          value={company.tagline}
          onChange={(value) => updateCompany({ tagline: value })}
        />
        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">Thesis</span>
          <textarea
            value={company.thesis}
            onChange={(event) => updateCompany({ thesis: event.target.value })}
            rows={6}
            className="mt-2 w-full rounded-xl bg-hq-panel px-3 py-2 text-sm outline-none hq-hairline"
          />
        </label>
        <Field label="HQ" value={company.hq} onChange={(value) => updateCompany({ hq: value })} />
        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">Sector</span>
          <select
            value={company.sector}
            onChange={(event) => updateCompany({ sector: event.target.value as Sector })}
            className="mt-2 h-11 w-full rounded-xl bg-hq-panel px-3 text-sm outline-none hq-hairline"
          >
            {SECTORS.map((sector) => (
              <option key={sector.id} value={sector.id}>
                {sector.label}
              </option>
            ))}
          </select>
        </label>
        <label className="block">
          <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">Stage</span>
          <select
            value={company.stage}
            onChange={(event) => updateCompany({ stage: event.target.value as CompanyStage })}
            className="mt-2 h-11 w-full rounded-xl bg-hq-panel px-3 text-sm outline-none hq-hairline"
          >
            {STAGES.map((stage) => (
              <option key={stage.id} value={stage.id}>
                {stage.label}
              </option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-3 text-sm">
          <input
            type="checkbox"
            checked={company.public}
            onChange={(event) => updateCompany({ public: event.target.checked })}
          />
          Public in the directory
        </label>
      </div>
      <button
        type="button"
        onClick={resetDemo}
        className="mt-10 text-sm text-hq-mist"
      >
        Reset this browser to the demo dataset
      </button>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
}) {
  return (
    <label className="block">
      <span className="text-xs uppercase tracking-[0.14em] text-hq-mist">{label}</span>
      <input
        value={value}
        onChange={(event) => onChange(event.target.value)}
        className="mt-2 h-11 w-full rounded-xl bg-hq-panel px-3 text-sm outline-none hq-hairline"
      />
    </label>
  );
}
