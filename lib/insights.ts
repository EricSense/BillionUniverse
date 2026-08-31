import { BILLION, coveragePct } from "./format";
import type { Bet, Company, Insight, Market } from "./types";

export function companyInsights(
  company: Company,
  markets: Market[],
  bets: Bet[],
): Insight[] {
  const named = markets.reduce((sum, market) => sum + market.population, 0);
  const reachedInMarkets = markets.reduce((sum, market) => sum + market.peopleReached, 0);
  const live = markets.filter((market) => market.status === "live" || market.status === "scaled");
  const insights: Insight[] = [];

  if (markets.length === 0) {
    insights.push({
      id: "no-markets",
      companyId: company.id,
      kind: "gap",
      text: "No markets named yet. A billion-person company has to say which people, in which countries, speaking which languages.",
    });
  }

  if (named > 0 && named < 100_000_000) {
    insights.push({
      id: "small-named",
      companyId: company.id,
      kind: "gap",
      text: `Named market is ${Math.round(named / 1_000_000)}M people. That is a country, not a path to a billion. Add the next markets you intend to enter.`,
    });
  }

  if (live.length === 1 && markets.length > 1) {
    insights.push({
      id: "one-live",
      companyId: company.id,
      kind: "risk",
      text: `${live[0].name} is the only live market. Concentration is fine at early stage. It is fatal if it is still true at 10M people.`,
    });
  }

  if (company.peopleReached > 0 && ofPath(company.peopleReached) < 0.01) {
    insights.push({
      id: "early-path",
      companyId: company.id,
      kind: "momentum",
      text: `You are at ${company.peopleReached.toLocaleString("en-US")} people — ${((company.peopleReached / BILLION) * 100).toFixed(4)}% of a billion. The work now is a repeatable wedge, not a map of the whole world.`,
    });
  }

  const coverage = coveragePct(reachedInMarkets, named);
  if (named > 0 && coverage < 0.5 && company.stage !== "pre-product") {
    insights.push({
      id: "thin-coverage",
      companyId: company.id,
      kind: "gap",
      text: `You reach ${coverage.toFixed(2)}% of the people in markets you already named. Depth in a live market compounds. Flags on a slide do not.`,
    });
  }

  if (company.runwayMonths > 0 && company.runwayMonths < 10 && markets.some((m) => m.status === "research")) {
    insights.push({
      id: "runway-expansion",
      companyId: company.id,
      kind: "risk",
      text: `${company.runwayMonths} months of runway and markets still in research. Expansion is a cash decision. Pause a country or raise.`,
    });
  }

  if (bets.filter((bet) => bet.status === "active").length > 4) {
    insights.push({
      id: "too-many-bets",
      companyId: company.id,
      kind: "risk",
      text: "Too many active bets. Companies that reach a billion usually win one distribution motion, then repeat it.",
    });
  }

  if (company.peopleReached >= 1_000_000 && company.teamSize < 20) {
    insights.push({
      id: "lean-scale",
      companyId: company.id,
      kind: "momentum",
      text: "Past a million people with a small team. That is leverage. The next constraint is likely licensing, language, or distribution — not headcount for its own sake.",
    });
  }

  return insights.slice(0, 4);
}

function ofPath(people: number): number {
  return (people / BILLION) * 100;
}
