import type { Metadata } from "next";
import { MarketingChrome } from "@/components/landing/MarketingChrome";

export const metadata: Metadata = {
  title: "Thesis",
};

export default function ThesisPage() {
  return (
    <MarketingChrome>
      <article className="mx-auto max-w-3xl px-5 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.22em] text-mist">Thesis</p>
        <h1 className="font-display mt-4 text-5xl tracking-tight md:text-6xl">
          The next century belongs to companies that serve a billion people.
        </h1>
        <div className="mt-10 space-y-6 text-lg leading-8 text-ink-soft">
          <p>
            Billion Universe is not a metaphor. It is a standard. If you cannot
            name the people, the countries, and the languages — and you cannot
            show how many of them you actually reach — you are not building for
            a billion. You are decorating a small business with large words.
          </p>
          <p>
            Most of the world still pays too much to move money, waits too long
            for care, farms without a forecast, learns without a credential that
            travels, and works without a system that notices them. Those are not
            niche problems. They are population problems. The software to match
            them will be built by operators who treat scale as an operating
            discipline, not a fundraising line.
          </p>
          <p>
            We built an HQ around four objects: markets, coverage, the path, and
            the capital that buys the next country. The path is always the same
            axis — one person to one billion — because every other dashboard
            lets you hide. Signups are not people. Flags are not markets. A deck
            is not a company.
          </p>
          <p>
            The name is the ambition. Billion: the number. Universe: every
            person who has the problem — not a corner of one city. The work is
            reaching them.
          </p>
          <p>
            If you are building something that only works for a zip code, this
            is the wrong product. If you are building something a billion people
            might one day touch — payroll, records, food, learning, identity,
            trade — this is the operating system.
          </p>
        </div>
      </article>
    </MarketingChrome>
  );
}
