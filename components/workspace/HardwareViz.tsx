"use client";

import type { Job } from "@/lib/types";

export function HardwareViz({ job }: { job?: Job }) {
  if (!job || (job.backendId !== "workshop-printer" && job.backendId !== "robotics-rig" && job.backendId !== "lab-instrument")) {
    return (
      <div className="flex h-full min-h-[200px] items-center justify-center rounded-[1.6rem] border border-dashed border-white/10 text-sm text-mute">
        Hardware telemetry appears when a physical backend is running.
      </div>
    );
  }

  const progress =
    job.status === "succeeded"
      ? 1
      : job.status === "queued"
        ? 0.05
        : Math.min(0.95, job.logs.length / 8);

  return (
    <div className="rounded-[1.6rem] border border-white/8 bg-[#07070f] p-4">
      <p className="font-mono text-[11px] text-violet">
        {job.backendId} · {job.status}
      </p>
      <div className="mt-4 grid place-items-center">
        {job.backendId === "workshop-printer" && <Printer progress={progress} running={job.status === "running"} />}
        {job.backendId === "robotics-rig" && <Rig progress={progress} />}
        {job.backendId === "lab-instrument" && <Lab progress={progress} />}
      </div>
      <div className="mt-4 h-1.5 overflow-hidden rounded-full bg-white/8">
        <div className="h-full rounded-full bg-lime" style={{ width: `${Math.round(progress * 100)}%` }} />
      </div>
      {job.result?.telemetry && (
        <div className="mt-3 flex flex-wrap gap-2 font-mono text-[10px] text-mute">
          {Object.entries(job.result.telemetry).map(([k, v]) => (
            <span key={k} className="rounded-full border border-white/10 px-2 py-0.5">
              {k} {v}
            </span>
          ))}
        </div>
      )}
    </div>
  );
}

function Printer({ progress, running }: { progress: number; running: boolean }) {
  const x = 20 + progress * 140;
  return (
    <svg width="220" height="140" viewBox="0 0 220 140">
      <rect x="20" y="110" width="180" height="8" rx="2" fill="#1a1a28" stroke="rgba(255,255,255,.12)" />
      <rect x="24" y={110 - progress * 36} width="172" height={progress * 36} fill="#d6ff4b" opacity={0.35} />
      <rect x="16" y="18" width="188" height="10" rx="3" fill="#8b7cff" />
      <rect x={x} y="28" width="18" height="48" rx="3" fill="#f4f1ea" className={running ? "drift" : ""} />
      <line x1={x + 9} y1="76" x2={x + 9} y2={110 - progress * 36} stroke="#5ce1e6" strokeDasharray="3 3" />
    </svg>
  );
}

function Rig({ progress }: { progress: number }) {
  const angle = -30 + progress * 70;
  return (
    <svg width="220" height="140" viewBox="0 0 220 140">
      <circle cx="70" cy="110" r="10" fill="#8b7cff" />
      <g transform={`translate(70 110) rotate(${angle})`}>
        <rect x="0" y="-6" width="90" height="12" rx="4" fill="#f4f1ea" />
        <rect x="84" y="-14" width="10" height="28" rx="2" fill="#d6ff4b" />
      </g>
      <rect x="150" y="96" width="36" height="22" rx="4" fill="#5ce1e6" opacity={0.5 + progress * 0.5} />
    </svg>
  );
}

function Lab({ progress }: { progress: number }) {
  return (
    <svg width="220" height="140" viewBox="0 0 220 140">
      <rect x="50" y="30" width="120" height="80" rx="12" fill="#12121c" stroke="#5ce1e6" />
      <rect x="70" y="50" width="80" height="44" rx="8" fill="#0b0b12" />
      <rect x="74" y={90 - progress * 36} width="72" height={progress * 36} rx="6" fill="#5ce1e6" opacity={0.45} />
      <circle cx="160" cy="44" r="5" fill={progress > 0.5 ? "#d6ff4b" : "#ff6b9d"} />
    </svg>
  );
}
