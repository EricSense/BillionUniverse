import { compilePreview, previewBytes } from "./preview";
import { uid } from "./id";
import type { BackendId, Identity, Job, JobLog, Universe } from "./types";
import { BACKENDS } from "./types";

export type JobTick = {
  job: Job;
  done: boolean;
};

function log(level: JobLog["level"], message: string): JobLog {
  return { t: Date.now(), level, message };
}

export function createJob(
  backendId: BackendId,
  universe: Universe,
  identity: Identity,
): Job {
  const backend = BACKENDS.find((b) => b.id === backendId)!;
  const hardware = universe.nodes.filter((n) => n.kind === "hardware");
  const title =
    backend.kind === "hardware" && hardware[0]
      ? `${backend.label}: ${hardware[0].props.object ?? hardware[0].name}`
      : `${backend.label}: ${universe.name}`;
  return {
    id: uid("job"),
    backendId,
    title,
    status: "queued",
    submittedAt: Date.now(),
    directedFrom: `${identity.name} · ${identity.device}`,
    logs: [
      log("info", `Directed from ${identity.device} (${identity.name})`),
      log("info", `Queued on backend “${backend.label}” (${backend.where})`),
    ],
  };
}

function sleepPlan(backendId: BackendId): { delay: number; message: string; level: JobLog["level"] }[] {
  switch (backendId) {
    case "live-preview":
      return [
        { delay: 180, message: "Walking the graph…", level: "info" },
        { delay: 220, message: "Compiling surfaces to HTML…", level: "info" },
        { delay: 160, message: "Preview artifact ready.", level: "ok" },
      ];
    case "cloud-build":
      return [
        { delay: 240, message: "Uploading graph snapshot to cloud runner…", level: "info" },
        { delay: 420, message: "Remote worker claimed the job.", level: "info" },
        { delay: 380, message: "Compiling artifact on the server…", level: "info" },
        { delay: 200, message: "Cloud build finished.", level: "ok" },
      ];
    case "workshop-printer":
      return [
        { delay: 280, message: "Handshaking with workshop-printer…", level: "info" },
        { delay: 320, message: "Bed 62°C · nozzle 205°C", level: "info" },
        { delay: 420, message: "Layer 1/40 · skirt", level: "info" },
        { delay: 480, message: "Layer 18/40 · infill 18%", level: "info" },
        { delay: 420, message: "Layer 40/40 · cooling", level: "info" },
        { delay: 200, message: "Print complete. Part staged.", level: "ok" },
      ];
    case "robotics-rig":
      return [
        { delay: 240, message: "Locking rig-01 workspace…", level: "info" },
        { delay: 300, message: "Home → approach (120ms)", level: "info" },
        { delay: 340, message: "Gripper close · payload 0.4kg", level: "info" },
        { delay: 360, message: "Place · retract · home", level: "info" },
        { delay: 180, message: "Sequence complete. Rig idle.", level: "ok" },
      ];
    case "lab-instrument":
      return [
        { delay: 260, message: "Instrument online · protocol loaded", level: "info" },
        { delay: 400, message: "Cycle 1/3 · incubate 37°C", level: "info" },
        { delay: 420, message: "Cycle 2/3 · mix 800rpm", level: "info" },
        { delay: 380, message: "Cycle 3/3 · read", level: "info" },
        { delay: 200, message: "Protocol finished. Results attached.", level: "ok" },
      ];
  }
}

export async function runLocalBackend(
  job: Job,
  universe: Universe,
  onTick: (tick: JobTick) => void,
  signal?: { canceled: boolean },
): Promise<Job> {
  let current: Job = {
    ...job,
    status: "running",
    startedAt: Date.now(),
    logs: [...job.logs, log("info", "Execution started (separated from the directing device).")],
  };
  onTick({ job: current, done: false });

  const steps = sleepPlan(job.backendId);
  for (const step of steps) {
    await new Promise((r) => setTimeout(r, step.delay));
    if (signal?.canceled) {
      current = {
        ...current,
        status: "canceled",
        finishedAt: Date.now(),
        logs: [...current.logs, log("warn", "Canceled by director.")],
      };
      onTick({ job: current, done: true });
      return current;
    }
    current = { ...current, logs: [...current.logs, log(step.level, step.message)] };
    onTick({ job: current, done: false });
  }

  const html = compilePreview(universe);
  let result: Job["result"];
  if (job.backendId === "live-preview" || job.backendId === "cloud-build") {
    result = { html, bytes: previewBytes(html), summary: "Graph compiled to preview HTML." };
  } else if (job.backendId === "workshop-printer") {
    result = {
      summary: "Physical part staged at workshop-printer.",
      telemetry: { layers: 40, nozzleC: 205, bedC: 62 },
    };
  } else if (job.backendId === "robotics-rig") {
    result = {
      summary: "Motion sequence finished. Rig idle.",
      telemetry: { moves: 4, payloadKg: 0.4 },
    };
  } else {
    result = {
      summary: "Lab protocol complete.",
      telemetry: { cycles: 3, tempC: 37 },
    };
  }

  current = {
    ...current,
    status: "succeeded",
    finishedAt: Date.now(),
    result,
    logs: [...current.logs, log("ok", "Job closed. Director can stay on any device.")],
  };
  onTick({ job: current, done: true });
  return current;
}

export async function runCloudBuild(universe: Universe): Promise<{
  html: string;
  bytes: number;
  summary: string;
}> {
  const res = await fetch("/api/jobs", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ backendId: "cloud-build", universe }),
  });
  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || "Cloud build failed");
  }
  return res.json();
}
