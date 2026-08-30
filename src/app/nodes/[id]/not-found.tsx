import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-star-mute">Not on the network</p>
      <h1 className="mt-4 font-serif text-4xl text-star">This node isn&apos;t reachable.</h1>
      <Link href="/network" className="mt-8 inline-block text-sm text-gold link-underline">
        Return to the constellation
      </Link>
    </div>
  );
}
