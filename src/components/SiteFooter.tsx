import Link from "next/link";

export function SiteFooter() {
  return (
    <footer className="mt-24 border-t border-white/[0.06]">
      <div className="mx-auto flex max-w-6xl flex-col gap-6 px-5 py-10 sm:flex-row sm:items-end sm:justify-between">
        <div>
          <p className="font-serif text-2xl text-star">Billion Universe</p>
          <p className="mt-2 max-w-md text-sm leading-relaxed text-star-dim">
            The platform for AI-mediated interoperability — connecting billions of people&apos;s
            creations, and eventually every existing company&apos;s software, every machine, and
            every AI agent, into a single network that anything can plug into.
          </p>
        </div>
        <div className="flex gap-6 text-sm text-star-dim">
          <Link href="/pricing" className="link-underline">
            Pricing
          </Link>
          <Link href="/how" className="link-underline">
            How it works
          </Link>
          <Link href="/trust" className="link-underline">
            Trust
          </Link>
        </div>
      </div>
    </footer>
  );
}
