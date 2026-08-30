import Link from "next/link";

export default function NotFound() {
  return (
    <div className="mx-auto max-w-xl px-5 py-24 text-center">
      <p className="text-[11px] uppercase tracking-[0.28em] text-star-mute">Unreachable</p>
      <h1 className="mt-4 font-serif text-4xl text-star">Nothing here to plug into.</h1>
      <Link href="/" className="mt-8 inline-block text-sm text-gold link-underline">
        Back to Billion Universe
      </Link>
    </div>
  );
}
