import { PLAN } from "@/lib/copy";

export function PlanView() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mono text-[11px] tracking-[0.22em] text-heat uppercase">First 90 days</p>
      <h1 className="mt-2 text-4xl font-medium md:text-5xl">One article. Then copy it.</h1>
      <p className="mt-4 text-sm text-mist">
        SpaceX did not open Mars in year one. It flew a rocket that did not explode, then another.
        We stand up a Node, sell the second, freeze the kit.
      </p>
      <ol className="mt-12 space-y-8">
        {PLAN.map((w) => (
          <li key={w.when} className="border-t border-line pt-6">
            <p className="mono text-[11px] text-heat">{w.when}</p>
            <h2 className="mt-1 text-2xl font-medium">{w.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">{w.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
