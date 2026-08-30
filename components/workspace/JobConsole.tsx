"use client";

import type { Job } from "@/lib/types";
import { BACKENDS } from "@/lib/types";

type Props = {
  jobs: Job[];
  activeId?: string;
  onSelect: (id: string) => void;
  onCancel: (id: string) => void;
};

export function JobConsole({ jobs, activeId, onSelect, onCancel }: Props) {
  const ordered = [...jobs].sort((a, b) => b.submittedAt - a.submittedAt);
  const active = ordered.find((j) => j.id === activeId) ?? ordered[0];

  return (
    <div className="grid h-full gap-3 lg:grid-cols-[220px_1fr]">
      <div className="scroll-thin overflow-auto rounded-2xl border border-white/8">
        {ordered.length === 0 && (
          <p className="px-3 py-4 text-xs text-mute">No jobs yet. Run a backend from the inspector.</p>
        )}
        {ordered.map((job) => (
          <button
            key={job.id}
            type="button"
            onClick={() => onSelect(job.id)}
            className={`block w-full border-b border-white/6 px-3 py-2.5 text-left ${
              job.id === active?.id ? "bg-white/6" : ""
            } ${job.status === "running" ? "job-running" : ""}`}
          >
            <span className="flex items-center justify-between gap-2">
              <span className="truncate text-xs">{job.title}</span>
              <StatusDot status={job.status} />
            </span>
            <span className="mt-0.5 block font-mono text-[10px] text-mute">
              {BACKENDS.find((b) => b.id === job.backendId)?.where} · {job.status}
            </span>
          </button>
        ))}
      </div>
      <div className="flex min-h-[160px] flex-col overflow-hidden rounded-2xl border border-white/8 bg-black/25">
        {active ? (
          <>
            <div className="flex items-center justify-between border-b border-white/8 px-3 py-2">
              <div>
                <p className="text-sm">{active.title}</p>
                <p className="font-mono text-[10px] text-mute">
                  directed from {active.directedFrom}
                </p>
              </div>
              {active.status === "running" && (
                <button
                  type="button"
                  onClick={() => onCancel(active.id)}
                  className="rounded-full border border-white/12 px-2 py-1 text-[11px] text-mute"
                >
                  Cancel
                </button>
              )}
            </div>
            <div className="scroll-thin flex-1 overflow-auto px-3 py-2 font-mono text-[11px] leading-5">
              {active.logs.map((line, i) => (
                <p
                  key={`${line.t}-${i}`}
                  className={
                    line.level === "ok"
                      ? "text-lime"
                      : line.level === "error"
                        ? "text-rose"
                        : line.level === "warn"
                          ? "text-amber"
                          : "text-mute"
                  }
                >
                  <span className="opacity-50">{new Date(line.t).toLocaleTimeString()}</span> {line.message}
                </p>
              ))}
              {active.result?.summary && (
                <p className="mt-2 text-text">{active.result.summary}</p>
              )}
            </div>
          </>
        ) : (
          <p className="p-4 text-sm text-mute">Jobs stream status here while execution happens elsewhere.</p>
        )}
      </div>
    </div>
  );
}

function StatusDot({ status }: { status: Job["status"] }) {
  const color =
    status === "succeeded"
      ? "bg-lime"
      : status === "running"
        ? "bg-cyan"
        : status === "failed"
          ? "bg-rose"
          : status === "canceled"
            ? "bg-amber"
            : "bg-mute";
  return <span className={`h-1.5 w-1.5 shrink-0 rounded-full ${color}`} />;
}
