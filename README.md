# Billion Universe

The platform for AI-mediated interoperability — a network anything can plug into.

A person's creation, a company's existing software, a machine, or an AI agent joins as a **node**. The network reads what each node actually does, finds matches by meaning, and builds a bridge between interfaces that were never designed to meet. Trust decides how far a node may reach. Every connection is also a transaction.

## What this is

A working first product of the thesis, not a brochure:

1. **Creation** — describe what you have or want; the network represents it as a node with a purpose and an interface.
2. **Understanding** — matches are ranked by complementary capabilities and meaning, not keywords.
3. **Connection** — a bridge is generated between two nodes, including multi-hop paths (a hobbyist mesh reaching a printer through a slicer).
4. **Action** — a path can execute, writing a trust event and a settlement.
5. **Trust** — digital, business, and physical tiers. Physical reach requires a verified record and an enterprise guarantee.
6. **Value** — connections are priced by stakes; value splits across every hop that made the path possible.

The seed network is the five stories from the thesis: a game mechanic and an art pack; a bakery inventory linked to shipping and a buying agent; a lattice script that reaches a printer in two hops; a CRM that joined instead of waiting for an integration project; two company agents settling a buy.

## Run

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

Runtime state lives in `.data/network.json` (created on first write). `DELETE /api/network` restores the seed.

## Stack

Next.js 15 (App Router), TypeScript, Tailwind. The interoperability engine is local and deterministic so the product works without an API key. The same six-layer contract is what a later model-backed reader would implement.
