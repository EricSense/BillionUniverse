"use client";

import { useState } from "react";
import { ArrowUp } from "lucide-react";
import type { PromptTurn } from "@/lib/types";

const SUGGESTIONS = [
  "Make a landing page for a studio called Northwind",
  "Add a contact form",
  "print a 40mm cube on the workshop printer",
  "Add a button",
];

type Props = {
  history: PromptTurn[];
  onSubmit: (text: string) => void;
};

export function PromptPane({ history, onSubmit }: Props) {
  const [text, setText] = useState("");

  function send(value = text) {
    const next = value.trim();
    if (!next) return;
    onSubmit(next);
    setText("");
  }

  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#07070f]">
      <div className="border-b border-white/8 px-4 py-3">
        <p className="text-sm">Prompt is a front end, not a product.</p>
        <p className="mt-1 text-[12px] text-mute">
          It writes the same graph as the visual builder and the code pane. On a phone, this is usually
          the right way to direct.
        </p>
      </div>
      <div className="scroll-thin flex-1 space-y-3 overflow-auto px-4 py-4">
        {history.length === 0 && (
          <p className="text-sm text-mute">Try one of these, or say what you want in the graph.</p>
        )}
        {history.map((turn) => (
          <div
            key={turn.id}
            className={`max-w-[90%] rounded-2xl px-3 py-2 text-sm leading-6 ${
              turn.role === "user"
                ? "ml-auto bg-lime/15 text-text"
                : "bg-white/5 text-mute"
            }`}
          >
            {turn.text}
          </div>
        ))}
      </div>
      <div className="flex flex-wrap gap-1.5 px-4 pb-2">
        {SUGGESTIONS.map((s) => (
          <button
            key={s}
            type="button"
            onClick={() => send(s)}
            className="rounded-full border border-white/10 px-2.5 py-1 text-[11px] text-mute hover:text-text"
          >
            {s}
          </button>
        ))}
      </div>
      <form
        className="flex gap-2 border-t border-white/8 p-3"
        onSubmit={(e) => {
          e.preventDefault();
          send();
        }}
      >
        <input
          value={text}
          onChange={(e) => setText(e.target.value)}
          placeholder="Describe a change to the graph…"
          className="flex-1 rounded-full border border-white/10 bg-black/30 px-4 py-2 text-sm outline-none"
        />
        <button
          type="submit"
          className="grid h-10 w-10 place-items-center rounded-full bg-lime text-black"
          aria-label="Send prompt"
        >
          <ArrowUp size={16} />
        </button>
      </form>
    </div>
  );
}
