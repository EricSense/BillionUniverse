"use client";

import Link from "next/link";
import { useMemo, useRef, useState } from "react";
import {
  Braces,
  Download,
  LayoutGrid,
  MessageSquareText,
  Play,
} from "lucide-react";
import { Mark } from "@/components/Mark";
import { Canvas } from "@/components/workspace/Canvas";
import { CodePane } from "@/components/workspace/CodePane";
import { HardwareViz } from "@/components/workspace/HardwareViz";
import { Inspector } from "@/components/workspace/Inspector";
import { JobConsole } from "@/components/workspace/JobConsole";
import { PreviewFrame } from "@/components/workspace/PreviewFrame";
import { PromptPane } from "@/components/workspace/PromptPane";
import { parseDsl, serializeDsl, addNode } from "@/lib/dsl";
import { uid } from "@/lib/id";
import { createJob, runCloudBuild, runLocalBackend } from "@/lib/jobs";
import { interpretPrompt } from "@/lib/prompt";
import {
  getUniverse,
  publishPresence,
  useClientReady,
  useStore,
  upsertUniverse,
} from "@/lib/store";
import type { BackendId, Job, StudioMode, Universe } from "@/lib/types";

export function Workspace({ universeId }: { universeId: string }) {
  const ready = useClientReady();
  const store = useStore();
  const [mode, setMode] = useState<StudioMode>("visual");
  const [mobile, setMobile] = useState<"build" | "jobs" | "preview">("build");
  const [selectedId, setSelectedId] = useState<string>();
  const [dslDraft, setDslDraft] = useState<string | null>(null);
  const [codeError, setCodeError] = useState<string>();
  const [activeJobId, setActiveJobId] = useState<string>();
  const [previewHtml, setPreviewHtml] = useState<string>();
  const cancelRef = useRef<Record<string, { canceled: boolean }>>({});

  const universe = ready ? getUniverse(universeId) : undefined;
  const dsl = dslDraft ?? (universe ? serializeDsl(universe.nodes, universe.edges) : "");

  const selected = universe?.nodes.find((n) => n.id === selectedId);
  const cursors = store.presence
    .filter((p) => p.id !== store.identity.id && p.universeId === universeId && p.cursor)
    .map((p) => ({ id: p.id, name: p.name, color: p.color, x: p.cursor!.x, y: p.cursor!.y }));
  const activeJob = universe?.jobs.find((j) => j.id === activeJobId) ?? universe?.jobs[0];
  const hardwareJob = [...(universe?.jobs ?? [])]
    .reverse()
    .find((j) => j.backendId !== "live-preview" && j.backendId !== "cloud-build");

  function save(next: Universe) {
    upsertUniverse({ ...next, updatedAt: Date.now() });
  }

  async function run(backendId: BackendId) {
    if (!universe) return;
    const job = createJob(backendId, universe, store.identity);
    cancelRef.current[job.id] = { canceled: false };
    save({ ...universe, jobs: [job, ...universe.jobs] });
    setActiveJobId(job.id);
    setMobile("jobs");

    const patch = (nextJob: Job) => {
      const current = getUniverse(universeId);
      if (!current) return;
      save({
        ...current,
        jobs: current.jobs.map((j) => (j.id === nextJob.id ? nextJob : j)),
      });
      if (nextJob.result?.html) setPreviewHtml(nextJob.result.html);
    };

    try {
      if (backendId === "cloud-build") {
        await runLocalBackend(job, universe, ({ job: tick }) => patch(tick), cancelRef.current[job.id]);
        const artifact = await runCloudBuild(getUniverse(universeId) ?? universe);
        const current = getUniverse(universeId);
        const existing = current?.jobs.find((j) => j.id === job.id);
        if (current && existing) {
          const finished: Job = {
            ...existing,
            status: "succeeded",
            finishedAt: Date.now(),
            result: artifact,
            logs: [
              ...existing.logs,
              {
                t: Date.now(),
                level: "ok",
                message: `Remote worker returned ${artifact.bytes} bytes.`,
              },
            ],
          };
          patch(finished);
          setPreviewHtml(artifact.html);
          setMobile("preview");
        }
        return;
      }

      const finished = await runLocalBackend(
        job,
        universe,
        ({ job: tick }) => patch(tick),
        cancelRef.current[job.id],
      );
      if (finished.result?.html) setMobile("preview");
    } catch (err) {
      const current = getUniverse(universeId);
      const existing = current?.jobs.find((j) => j.id === job.id);
      if (current && existing) {
        patch({
          ...existing,
          status: "failed",
          finishedAt: Date.now(),
          logs: [
            ...existing.logs,
            {
              t: Date.now(),
              level: "error",
              message: err instanceof Error ? err.message : "Job failed",
            },
          ],
        });
      }
    }
  }

  const modes = useMemo(
    () =>
      [
        { id: "visual" as const, label: "Visual", icon: LayoutGrid },
        { id: "code" as const, label: "Code", icon: Braces },
        { id: "prompt" as const, label: "Prompt", icon: MessageSquareText },
      ],
    [],
  );

  if (!ready) {
    return <div className="flex flex-1 items-center justify-center text-sm text-mute">Loading universe…</div>;
  }

  if (!universe) {
    return (
      <div className="flex flex-1 flex-col items-center justify-center gap-3">
        <p className="text-mute">That universe isn’t on this device.</p>
        <Link href="/studio" className="rounded-full bg-lime px-4 py-2 text-sm font-semibold text-black">
          Back to studio
        </Link>
      </div>
    );
  }

  return (
    <div className="flex min-h-full flex-1 flex-col bg-void">
      <header className="flex flex-wrap items-center gap-3 border-b border-white/8 px-3 py-2.5 sm:px-4">
        <Link href="/studio" className="flex items-center gap-2">
          <Mark size={18} />
          <span className="hidden text-sm sm:inline">Billion Universe</span>
        </Link>
        <span className="text-mute">/</span>
        <h1 className="max-w-[40vw] truncate text-sm sm:text-base">{universe.name}</h1>
        <div className="ml-auto flex items-center gap-1 rounded-full border border-white/10 p-0.5">
          {modes.map((m) => (
            <button
              key={m.id}
              type="button"
              onClick={() => {
                setMode(m.id);
                setMobile("build");
                publishPresence({ universeId, mode: m.id });
              }}
              className={`inline-flex items-center gap-1 rounded-full px-2.5 py-1 text-xs ${
                mode === m.id ? "bg-lime text-black" : "text-mute"
              }`}
            >
              <m.icon size={12} />
              <span className="hidden sm:inline">{m.label}</span>
            </button>
          ))}
        </div>
        <div className="flex items-center gap-1">
          {store.presence
            .filter((p) => !p.universeId || p.universeId === universeId)
            .slice(0, 6)
            .map((p) => (
              <span
                key={p.id}
                title={`${p.name} · ${p.device}`}
                className="grid h-6 w-6 place-items-center rounded-full text-[10px] text-black"
                style={{ background: p.color }}
              >
                {p.name.slice(0, 1)}
              </span>
            ))}
        </div>
        <button
          type="button"
          onClick={() => {
            const blob = new Blob([JSON.stringify(universe, null, 2)], { type: "application/json" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${universe.name.replaceAll(" ", "-").toLowerCase()}.universe.json`;
            a.click();
            URL.revokeObjectURL(url);
          }}
          className="hidden rounded-full border border-white/10 p-2 text-mute sm:inline-flex"
          aria-label="Export snapshot"
        >
          <Download size={14} />
        </button>
        <button
          type="button"
          onClick={() => run(universe.nodes.some((n) => n.kind === "hardware") ? "workshop-printer" : "live-preview")}
          className="inline-flex items-center gap-1.5 rounded-full bg-lime px-3 py-1.5 text-xs font-semibold text-black"
        >
          <Play size={12} /> Run
        </button>
      </header>

      <div className="grid flex-1 gap-3 overflow-hidden p-3 lg:grid-cols-[minmax(0,1fr)_280px] lg:p-4">
        <div className={`min-h-0 ${mobile === "build" ? "" : "hidden lg:block"}`}>
          {mode === "visual" && (
            <Canvas
              universe={universe}
              selectedId={selectedId}
              selfColor={store.identity.color}
              cursors={cursors}
              onSelect={setSelectedId}
              onCursor={(x, y) => publishPresence({ universeId, mode, cursor: { x, y } })}
              onMove={(id, x, y) =>
                save({
                  ...universe,
                  nodes: universe.nodes.map((n) => (n.id === id ? { ...n, x, y } : n)),
                })
              }
            />
          )}
          {mode === "code" && (
            <CodePane
              value={dsl}
              error={codeError}
              onChange={(v) => {
                setDslDraft(v);
                setCodeError(undefined);
              }}
              onReset={() => setDslDraft(null)}
              onApply={() => {
                try {
                  const parsed = parseDsl(dsl);
                  save({ ...universe, nodes: parsed.nodes, edges: parsed.edges });
                  setDslDraft(null);
                  setCodeError(undefined);
                  setMode("visual");
                } catch (err) {
                  setCodeError(err instanceof Error ? err.message : "Could not parse");
                }
              }}
            />
          )}
          {mode === "prompt" && (
            <PromptPane
              history={universe.promptHistory}
              onSubmit={(text) => {
                const { reply, ops } = interpretPrompt(text, universe);
                const next = ops.reduce((u, op) => op.apply(u), universe);
                save({
                  ...next,
                  promptHistory: [
                    ...universe.promptHistory,
                    { id: uid("p"), role: "user", text, t: Date.now() },
                    { id: uid("p"), role: "system", text: reply, t: Date.now() },
                  ],
                });
                setDslDraft(null);
              }}
            />
          )}
        </div>
        <div className="hidden min-h-0 lg:block">
          <Inspector
            universe={universe}
            selected={selected}
            onPatch={(id, patch) =>
              save({
                ...universe,
                nodes: universe.nodes.map((n) =>
                  n.id === id
                    ? {
                        ...n,
                        ...patch,
                        props: patch.props ?? n.props,
                      }
                    : n,
                ),
              })
            }
            onDelete={(id) =>
              save({
                ...universe,
                nodes: universe.nodes.filter((n) => n.id !== id && n.parentId !== id),
                edges: universe.edges.filter((e) => e.from !== id && e.to !== id),
              })
            }
            onAdd={(kind) => {
              const next = addNode(universe.nodes, universe.edges, {
                kind,
                parentId: selected && kind !== "page" && kind !== "hardware" ? selected.id : undefined,
              });
              save({ ...universe, nodes: next.nodes, edges: next.edges });
              setSelectedId(next.node.id);
            }}
            onComment={(body) =>
              save({
                ...universe,
                comments: [
                  ...universe.comments,
                  {
                    id: uid("c"),
                    author: store.identity.name,
                    color: store.identity.color,
                    body,
                    createdAt: Date.now(),
                    nodeId: selectedId,
                  },
                ],
              })
            }
            onRun={run}
          />
        </div>
        <div className={`min-h-0 space-y-3 lg:col-span-2 ${mobile === "jobs" ? "" : "hidden lg:block"}`}>
          <JobConsole
            jobs={universe.jobs}
            activeId={activeJobId}
            onSelect={setActiveJobId}
            onCancel={(id) => {
              if (cancelRef.current[id]) cancelRef.current[id]!.canceled = true;
            }}
          />
        </div>
        <div className={`grid min-h-[240px] gap-3 lg:col-span-2 lg:grid-cols-2 ${mobile === "preview" ? "" : "hidden lg:grid"}`}>
          <PreviewFrame html={previewHtml} title={universe.name} />
          <HardwareViz job={hardwareJob ?? activeJob} />
        </div>
      </div>

      <nav className="grid grid-cols-3 border-t border-white/8 lg:hidden">
        {(
          [
            ["build", "Direct"],
            ["jobs", "Jobs"],
            ["preview", "Execute"],
          ] as const
        ).map(([id, label]) => (
          <button
            key={id}
            type="button"
            onClick={() => setMobile(id)}
            className={`py-3 text-xs ${mobile === id ? "text-lime" : "text-mute"}`}
          >
            {label}
          </button>
        ))}
      </nav>
    </div>
  );
}
