# Billion Universe

**Direct from anywhere. Execute anywhere else.**

A browser-native studio where anyone can build anything — from any device, alone or together — because the interface you *direct* with is not the place the work *executes*.

Most “build from anywhere” tools conflate four problems: remote access, no-code abstraction, real-time collaboration, and physical execution. They do not have to be conflated. The one idea that unifies them:

> Separate where the work is directed from where the work executes.

Once a project is a **job you submit** — not a file you edit on a specific machine — a phone in a coffee shop, a visual builder, raw code, and a 3D printer in another room are different front ends and different backends pointed at the same job system.

## Layers (one product)

| Layer | What it does |
| --- | --- |
| **Access** | Browser only. Session state lives with the universe, not the device. Phone and laptop are the same studio. |
| **Build** | A spectrum: prompt → visual graph → drop into code. Same `graph.bu` representation. Not two products bolted together. |
| **Collaboration** | Presence, cursors, comments, multi-tab sync via a broadcast channel. Multiplayer is the default, not a retrofit. |
| **Execution** | Submit a job. Stream status back. Software (live preview, cloud compile) and hardware (printer, robotics rig, lab instrument) use the same envelope. |

Hardware is a genuinely different *product* than a software builder. Architecturally it is the same job with a different backend. That is the point.

## Studio

- **Visual** — constellation canvas. Drag nodes, zoom, inspect, comment.
- **Code** — `graph.bu` DSL. Apply writes the same nodes the canvas uses.
- **Prompt** — natural language that mutates the graph (the right front end on a phone).
- **Jobs** — live preview, cloud build (`POST /api/jobs`), workshop printer, robotics rig, lab instrument.

Starters: **Aurora Café** (software surface) and **Orb One** (one graph, two backends — a product page and a print).

Open the same universe in two tabs to see presence and graph sync.

## Run locally

```bash
pnpm install
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
pnpm test
pnpm lint
pnpm build
```

## Deploy

This is a Next.js app. Import [github.com/EricSense/BillionUniverse](https://github.com/EricSense/BillionUniverse) in the Vercel dashboard, or:

```bash
npx vercel --prod
```

No database. Universes persist in the browser and sync across tabs on the same origin. Export a `.universe.json` snapshot from the workspace to move a graph between devices.

## Architecture

```
Front ends (direct)          Graph                 Backends (execute)
─────────────────────        ─────                 ──────────────────
Visual canvas          ──┐
Code (graph.bu)        ──┼──► nodes + edges ──┐    live-preview (browser)
Prompt                 ──┘                    ├──► cloud-build (server)
Presence / comments                           ├──► workshop-printer
                                              ├──► robotics-rig
                                              └──► lab-instrument
```

The job object records **who directed** and **from which device**. Execution is a backend concern. That split is the product.
