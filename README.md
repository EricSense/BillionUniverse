# Billion Universe

**Multi-system intelligence platform** — maps how complex systems interact so organizations can see connections, model cascades, and navigate a world defined by intersecting forces.

- **Origin:** AI × Systems Theory  
- **North star:** From hours of analyst work across fragmented tools → a single query that surfaces cross-system insight in real time.

---

## Quick start

```bash
npm install
cp .env.example .env.local   # add keys when you have them
npm run dev
```

Open [http://localhost:3000](http://localhost:3000). Landing → **Get early access** / **Open dashboard** → Signal feed + feedback.

---

## Repo structure

| Path | Purpose |
|------|--------|
| `src/app/` | Next.js App Router: landing, dashboard, API routes |
| `src/components/` | UI: SignalFeed, SignalCard, FeedbackSection |
| `src/types/` | Shared types (e.g. `Signal`) |
| `docs/` | ROADMAP, STARTUP_PLAYBOOK, product/ops notes |

---

## Product (from pitch)

- **MVP1 (0–4 mo):** Multi-System Signal Dashboard — curated feed from 3–5 systems, AI-surfaced cross-system anomalies, freemium.
- **MVP2 (4–9 mo):** Scenario Simulation Engine — “If X changes in system A, what happens in B, C, D?” — first paid tier, design partners.
- **MVP3 (9–18 mo):** Full graph platform, real-time ingestion, causal layer, enterprise SaaS.

Target customers: strategic intelligence teams (CSO, Fortune 500), institutional investors, policy/defense analysts.

---

## Tech stack

- **App:** Next.js 14 (App Router), React, TypeScript, Tailwind.
- **Planned:** Auth (Clerk/NextAuth), DB (Postgres/Supabase), AI (OpenAI/Anthropic), data feeds for signals.

---

## Contributing and hiring

See [CONTRIBUTING.md](CONTRIBUTING.md) for how to contribute. For hiring and funding, see [docs/STARTUP_PLAYBOOK.md](docs/STARTUP_PLAYBOOK.md).

---

## License and confidentiality

Proprietary. © 2026 Billion Universe. Confidential.
