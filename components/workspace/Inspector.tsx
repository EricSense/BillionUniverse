"use client";

import { BACKENDS, NODE_META, type BackendId, type Universe, type UniverseNode } from "@/lib/types";

type Props = {
  universe: Universe;
  selected?: UniverseNode;
  onPatch: (id: string, patch: Partial<UniverseNode> & { props?: Record<string, string> }) => void;
  onDelete: (id: string) => void;
  onAdd: (kind: UniverseNode["kind"]) => void;
  onComment: (body: string) => void;
  onRun: (backendId: BackendId) => void;
};

export function Inspector({ universe, selected, onPatch, onDelete, onAdd, onComment, onRun }: Props) {
  return (
    <aside className="scroll-thin flex h-full flex-col gap-4 overflow-auto">
      <section className="panel rounded-3xl p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Palette</p>
        <div className="mt-3 grid grid-cols-2 gap-1.5">
          {(Object.keys(NODE_META) as UniverseNode["kind"][]).map((kind) => (
            <button
              key={kind}
              type="button"
              onClick={() => onAdd(kind)}
              className="rounded-xl border border-white/8 px-2 py-1.5 text-left text-xs hover:border-white/20"
            >
              <span style={{ color: NODE_META[kind].accent }}>{NODE_META[kind].label}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel rounded-3xl p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Inspector</p>
        {!selected && <p className="mt-3 text-sm text-mute">Select a node on the graph.</p>}
        {selected && (
          <div className="mt-3 space-y-2">
            <Field
              label="Name"
              value={selected.name}
              onChange={(v) => onPatch(selected.id, { name: v })}
            />
            {["value", "label", "href", "path", "device", "operation", "object", "material", "placeholder"].map(
              (key) => (
                <Field
                  key={key}
                  label={key}
                  value={selected.props[key] ?? ""}
                  onChange={(v) =>
                    onPatch(selected.id, { props: { ...selected.props, [key]: v } })
                  }
                />
              ),
            )}
            <button
              type="button"
              onClick={() => onDelete(selected.id)}
              className="w-full rounded-full border border-rose/30 py-1.5 text-xs text-rose"
            >
              Remove node
            </button>
          </div>
        )}
      </section>

      <section className="panel rounded-3xl p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Run a job</p>
        <p className="mt-2 text-[12px] leading-5 text-mute">
          Directing stays here. Execution is a backend.
        </p>
        <div className="mt-3 space-y-1.5">
          {BACKENDS.map((b) => (
            <button
              key={b.id}
              type="button"
              onClick={() => onRun(b.id)}
              className="w-full rounded-2xl border border-white/8 px-3 py-2 text-left hover:border-lime/35"
            >
              <span className="flex items-center justify-between text-sm">
                {b.label}
                <span className="font-mono text-[10px] text-violet">{b.kind}</span>
              </span>
              <span className="mt-0.5 block text-[11px] text-mute">{b.where}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="panel rounded-3xl p-4">
        <p className="text-[11px] uppercase tracking-[0.18em] text-mute">Comments</p>
        <div className="mt-3 space-y-2">
          {universe.comments.length === 0 && (
            <p className="text-sm text-mute">No comments yet.</p>
          )}
          {universe.comments.map((c) => (
            <div key={c.id} className="rounded-2xl bg-white/4 px-3 py-2">
              <p className="text-[11px]" style={{ color: c.color }}>
                {c.author}
              </p>
              <p className="text-sm leading-5">{c.body}</p>
            </div>
          ))}
        </div>
        <CommentForm onComment={onComment} />
      </section>
    </aside>
  );
}

function Field({
  label,
  value,
  onChange,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <label className="block">
      <span className="font-mono text-[10px] text-mute">{label}</span>
      <input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="mt-0.5 w-full rounded-xl border border-white/10 bg-black/30 px-2.5 py-1.5 text-sm outline-none"
      />
    </label>
  );
}

function CommentForm({ onComment }: { onComment: (body: string) => void }) {
  return (
    <form
      className="mt-3 flex gap-2"
      onSubmit={(e) => {
        e.preventDefault();
        const fd = new FormData(e.currentTarget);
        const body = String(fd.get("body") ?? "").trim();
        if (!body) return;
        onComment(body);
        e.currentTarget.reset();
      }}
    >
      <input
        name="body"
        placeholder="Leave a note…"
        className="flex-1 rounded-full border border-white/10 bg-black/30 px-3 py-1.5 text-xs outline-none"
      />
      <button type="submit" className="rounded-full bg-white/10 px-3 text-xs">
        Add
      </button>
    </form>
  );
}
