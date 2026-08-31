import type { Metadata } from "next";
import Link from "next/link";
import { MarketingChrome } from "@/components/landing/MarketingChrome";

export const metadata: Metadata = {
  title: "Pricing",
};

const PLANS = [
  {
    name: "Founder",
    price: "$0",
    period: "to start",
    points: [
      "One company HQ",
      "Markets, path, bets, and public page",
      "Directory listing",
    ],
  },
  {
    name: "Growth",
    price: "$49",
    period: "/ month",
    points: [
      "Everything in Founder",
      "Unlimited markets and seats (up to 10)",
      "Export and investor link",
    ],
  },
  {
    name: "Scale",
    price: "$199",
    period: "/ month",
    points: [
      "Studios and funds: multiple companies",
      "Team workspace",
      "Priority in the directory",
    ],
  },
];

export default function PricingPage() {
  return (
    <MarketingChrome>
      <div className="mx-auto max-w-6xl px-5 py-16 md:py-24">
        <p className="text-xs uppercase tracking-[0.22em] text-mist">Pricing</p>
        <h1 className="font-display mt-4 max-w-3xl text-5xl tracking-tight">
          Free until the company is real. Paid when the market is.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-ink-soft">
          This build runs locally in your browser. Hosted plans are what the
          waitlist is for. The product is the HQ — not a seat tax on ambition.
        </p>
        <div className="mt-14 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => (
            <article key={plan.name} className="rounded-2xl bg-paper-2/40 p-6 hairline">
              <h2 className="text-lg font-medium">{plan.name}</h2>
              <p className="mt-4 font-display text-4xl">
                {plan.price}
                <span className="ml-1 text-base text-mist">{plan.period}</span>
              </p>
              <ul className="mt-6 space-y-2 text-sm text-ink-soft">
                {plan.points.map((point) => (
                  <li key={point}>{point}</li>
                ))}
              </ul>
            </article>
          ))}
        </div>
        <Link
          href="/join"
          className="mt-12 inline-flex rounded-full bg-accent px-5 py-3 text-sm font-medium text-paper"
        >
          Open a Founder HQ
        </Link>
      </div>
    </MarketingChrome>
  );
}
