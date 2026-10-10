import { DREAM, ENGINES } from "@/lib/dream";

export default function Page() {
  return (
    <main className="mx-auto flex min-h-screen max-w-2xl flex-col justify-between px-6 py-12 md:py-20">
      <p className="text-[13px] tracking-[0.2em] text-mute uppercase">{DREAM.name}</p>
      <div>
        <h1 className="serif text-4xl leading-[1.15] md:text-5xl">{DREAM.line}</h1>
        <p className="mt-8 text-[13px] leading-relaxed text-mute">
          {ENGINES.join(" · ")}
        </p>
        <div className="mt-12 space-y-6 text-[15px] leading-relaxed text-paper/90">
          {DREAM.body.map((p) => (
            <p key={p}>{p}</p>
          ))}
        </div>
      </div>
      <p className="mt-16 text-[12px] text-mute">Not a product. The destination of the stack.</p>
    </main>
  );
}
