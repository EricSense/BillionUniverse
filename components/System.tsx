"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { faculties } from "@/lib/mind";
import { loadChat, loadMemory, saveChat, saveMemory } from "@/lib/store";
import type { ChatTurn, Faculty, MemoryItem, ThinkResult } from "@/lib/types";

export function System() {
  const [chat, setChat] = useState<ChatTurn[]>([]);
  const [memory, setMemory] = useState<MemoryItem[]>([]);
  const [input, setInput] = useState("");
  const [busy, setBusy] = useState(false);
  const [active, setActive] = useState<Faculty | null>(null);
  const bottom = useRef<HTMLDivElement>(null);

  useEffect(() => {
    setChat(loadChat());
    setMemory(loadMemory());
  }, []);

  useEffect(() => {
    bottom.current?.scrollIntoView({ behavior: "smooth" });
  }, [chat, busy]);

  async function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q || busy) return;
    setInput("");
    const nextChat: ChatTurn[] = [...chat, { role: "user", text: q }];
    setChat(nextChat);
    setBusy(true);
    setActive("sense");
    const res = await fetch("/api/think", {
      method: "POST",
      headers: { "content-type": "application/json" },
      body: JSON.stringify({ input: q, memory }),
    });
    const result = (await res.json()) as ThinkResult;
    for (const t of result.trace) {
      setActive(t.faculty);
      await new Promise((r) => setTimeout(r, 90));
    }
    const done: ChatTurn[] = [
      ...nextChat,
      { role: "billion", text: result.reply, trace: result.trace },
    ];
    setChat(done);
    setMemory(result.memory);
    saveChat(done);
    saveMemory(result.memory);
    setActive(null);
    setBusy(false);
  }

  return (
    <div className="flex min-h-screen flex-col">
      <header className="flex items-center justify-between border-b border-line px-5 py-3">
        <div>
          <p className="text-sm">Billion Universe</p>
          <p className="mono text-[11px] text-mist">Universal AI system</p>
        </div>
        <div className="flex items-center gap-4 text-[12px] text-mist">
          <Link href="/system" className="hover:text-paper">
            Faculties
          </Link>
          <span className="mono text-mind">{memory.length} mem</span>
        </div>
      </header>

      <div className="flex flex-wrap gap-2 border-b border-line px-5 py-2">
        {faculties().map((f) => (
          <span
            key={f}
            className={`mono text-[10px] tracking-widest uppercase ${
              active === f ? "text-mind" : "text-mist"
            }`}
          >
            {f}
          </span>
        ))}
      </div>

      <div className="mx-auto flex w-full max-w-2xl flex-1 flex-col gap-6 px-5 py-8">
        {chat.length === 0 ? (
          <div className="text-mist">
            <h1 className="text-3xl text-paper">One mind. Every domain.</h1>
            <p className="mt-3 text-sm leading-relaxed">
              Not a chatbot on one model. A system with memory, reason, and acts — the intelligence
              the engines of the world were for. Ask what I am. Give me your name. Ask me to plan.
            </p>
            <div className="mt-6 flex flex-wrap gap-2">
              {["What are you?", "My name is Ada", "Plan a universe for a billion lives"].map(
                (s) => (
                  <button
                    key={s}
                    type="button"
                    className="border border-line px-3 py-1.5 text-[13px] hover:border-mind"
                    onClick={() => send(s)}
                  >
                    {s}
                  </button>
                ),
              )}
            </div>
          </div>
        ) : null}
        {chat.map((t, i) => (
          <article key={i} className={t.role === "user" ? "text-mist" : "text-paper"}>
            <p className="mono text-[10px] tracking-widest uppercase text-mind">
              {t.role === "user" ? "you" : "billion"}
            </p>
            <pre className="mt-1 whitespace-pre-wrap font-sans text-[15px] leading-relaxed">
              {t.text}
            </pre>
            {t.trace?.length ? (
              <p className="mono mt-2 text-[10px] text-mist">
                {t.trace.map((s) => s.faculty).join(" → ")}
              </p>
            ) : null}
          </article>
        ))}
        {busy ? <p className="mono text-[11px] text-mind">{active ?? "sense"}…</p> : null}
        <div ref={bottom} />
      </div>

      <form
        className="border-t border-line px-5 py-4"
        onSubmit={(e) => {
          e.preventDefault();
          void send();
        }}
      >
        <div className="mx-auto flex max-w-2xl gap-2">
          <textarea
            rows={2}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter" && !e.shiftKey) {
                e.preventDefault();
                void send();
              }
            }}
            placeholder="Speak to the system"
            className="flex-1 resize-none bg-transparent text-[15px] outline-none placeholder:text-mist"
          />
          <button
            type="submit"
            disabled={busy}
            className="self-end bg-mind px-3 py-1.5 text-[13px] text-void disabled:opacity-40"
          >
            Think
          </button>
        </div>
      </form>
    </div>
  );
}
