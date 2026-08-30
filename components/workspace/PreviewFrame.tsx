"use client";

export function PreviewFrame({ html, title }: { html?: string; title: string }) {
  if (!html) {
    return (
      <div className="flex h-full min-h-[240px] items-center justify-center rounded-[1.6rem] border border-dashed border-white/10 px-6 text-center text-sm text-mute">
        Run Live preview or Cloud build to compile this graph into a surface.
      </div>
    );
  }
  return (
    <iframe
      title={`${title} preview`}
      className="h-full min-h-[240px] w-full rounded-[1.6rem] border border-white/10 bg-black"
      sandbox="allow-scripts"
      srcDoc={html}
    />
  );
}
