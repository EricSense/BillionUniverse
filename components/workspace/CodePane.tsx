"use client";

type Props = {
  value: string;
  error?: string;
  onChange: (value: string) => void;
  onApply: () => void;
  onReset: () => void;
};

export function CodePane({ value, error, onChange, onApply, onReset }: Props) {
  return (
    <div className="flex h-full min-h-[420px] flex-col overflow-hidden rounded-[1.6rem] border border-white/8 bg-[#07070f]">
      <div className="flex items-center justify-between border-b border-white/8 px-4 py-2.5">
        <div>
          <p className="font-mono text-[11px] text-lime">graph.bu</p>
          <p className="text-[11px] text-mute">Same graph as the canvas. Apply writes nodes back.</p>
        </div>
        <div className="flex gap-2">
          <button
            type="button"
            onClick={onReset}
            className="rounded-full border border-white/10 px-3 py-1 text-xs text-mute"
          >
            Reset
          </button>
          <button
            type="button"
            onClick={onApply}
            className="rounded-full bg-lime px-3 py-1 text-xs font-semibold text-black"
          >
            Apply to graph
          </button>
        </div>
      </div>
      <textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        spellCheck={false}
        className="scroll-thin min-h-0 flex-1 resize-none bg-transparent px-4 py-3 font-mono text-[12.5px] leading-6 text-[#e8e4d8] outline-none"
        aria-label="Universe graph as code"
      />
      {error && (
        <p className="border-t border-rose/30 bg-rose/10 px-4 py-2 font-mono text-xs text-rose">{error}</p>
      )}
    </div>
  );
}
