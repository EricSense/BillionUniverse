# Billion Universe

The operating system for companies built to reach a billion people.

Billion Universe is not a space theme. The name is the ambition: **billion** is the number of humans, **universe** is the whole addressable world of people who have the problem. The product is an HQ — markets, coverage, a logarithmic path from 1 to 1,000,000,000, capital, and talent.

## Product

- **HQ** — people reached, path to a billion, weekly focus, and a short read on what is actually going on
- **Markets** — named countries, languages, population, live coverage
- **Scale** — the same axis for every company (1k → 10k → 100k → 1M → 10M → 100M → 1B) plus the bets that have to be true
- **Capital / Team** — runway, rounds, hires for the next market
- **Directory** — public company pages that state the number

## Run

```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Demo HQ: `founder@billionuniverse.com` / `scale1B` (Relay, a wage-rail company).

Data lives in the browser (`localStorage`). Reset from Settings.

## Stack

Next.js, TypeScript, Tailwind CSS. No backend required for the HQ; waitlist posts to `/api/waitlist`.
