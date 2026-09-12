#!/usr/bin/env node
import { mkdir, readFile, writeFile } from "node:fs/promises";
import { dirname, join } from "node:path";
import { kitTotal, usd, WALKER_V0, WALKER_V1, PROCESS_STATION, NINETY_DAY_BUDGET, ninetyDayTotal } from "../lib/kit";
import { runPipeline, synthesize, simulateCapture, processCapture, validateUniverse } from "../lib/pipeline";
import { CATALOG_SEEDS } from "../lib/catalog";
import type { Vertical } from "../lib/schema";

function arg(flag: string, fallback?: string): string | undefined {
  const i = process.argv.indexOf(flag);
  if (i >= 0 && process.argv[i + 1]) return process.argv[i + 1];
  return fallback;
}

function has(flag: string): boolean {
  return process.argv.includes(flag);
}

async function writeJson(path: string, data: unknown) {
  await mkdir(dirname(path), { recursive: true });
  await writeFile(path, JSON.stringify(data, null, 2));
}

async function synth() {
  const seed = Number(arg("--seed", "1"));
  const vertical = arg("--vertical") as Vertical | undefined;
  const out = arg("--out", "samples") ?? "samples";
  const scene = synthesize(seed, vertical);
  const raw = simulateCapture(scene);
  const universe = processCapture(raw);
  const v = validateUniverse(universe);
  await writeJson(join(out, "raw", `${raw.capture_id}.json`), raw);
  await writeJson(join(out, "universes", `${universe.universe_id}.json`), universe);
  console.log(
    JSON.stringify(
      {
        universe_id: universe.universe_id,
        site: universe.site.name,
        vertical: universe.site.vertical,
        objects: universe.stats.object_count,
        zones: universe.stats.zone_count,
        qa: universe.qa.status,
        valid: v.ok,
        issues: v.issues,
        files: {
          raw: join(out, "raw", `${raw.capture_id}.json`),
          universe: join(out, "universes", `${universe.universe_id}.json`),
        },
      },
      null,
      2,
    ),
  );
}

async function processCmd() {
  const file = process.argv[3];
  if (!file) {
    console.error("usage: bu process <raw.json> [--out samples/universes]");
    process.exit(1);
  }
  const raw = JSON.parse(await readFile(file, "utf8"));
  const universe = processCapture(raw);
  const outDir = arg("--out", "samples/universes") ?? "samples/universes";
  const dest = join(outDir, `${universe.universe_id}.json`);
  await writeJson(dest, universe);
  const v = validateUniverse(universe);
  console.log(JSON.stringify({ dest, ok: v.ok, stats: universe.stats, qa: universe.qa, issues: v.issues }, null, 2));
}

async function validateCmd() {
  const file = process.argv[3];
  if (!file) {
    console.error("usage: bu validate <universe.json>");
    process.exit(1);
  }
  const data = JSON.parse(await readFile(file, "utf8"));
  const v = validateUniverse(data);
  console.log(JSON.stringify(v, null, 2));
  if (!v.ok) process.exit(2);
}

function kit() {
  const rows = [
    { kit: WALKER_V0.name, usd: kitTotal(WALKER_V0) },
    { kit: WALKER_V1.name, usd: kitTotal(WALKER_V1), note: "incl. optional RTK" },
    { kit: `${WALKER_V1.name} (indoor)`, usd: kitTotal(WALKER_V1, false) },
    { kit: PROCESS_STATION.name, usd: kitTotal(PROCESS_STATION) },
    { kit: "First 90 days all-in", usd: ninetyDayTotal() },
  ];
  console.log(JSON.stringify({ kits: rows.map((r) => ({ ...r, usd_pretty: usd(r.usd) })), budget: NINETY_DAY_BUDGET }, null, 2));
}

function catalog() {
  const rows = CATALOG_SEEDS.map((s) => {
    const r = runPipeline(s.seed);
    return {
      seed: s.seed,
      note: s.note,
      id: r.universe.universe_id,
      site: r.universe.site.name,
      vertical: r.universe.site.vertical,
      objects: r.universe.stats.object_count,
      qa: r.universe.qa.status,
      ok: r.validation.ok,
    };
  });
  console.log(JSON.stringify(rows, null, 2));
}

const cmd = process.argv[2];
const help = `Billion Universe CLI
  npm run bu -- synth --seed 1 [--vertical warehouse] [--out samples]
  npm run bu -- process <raw.json> [--out samples/universes]
  npm run bu -- validate <universe.json>
  npm run bu -- kit
  npm run bu -- catalog
`;

async function main() {
  if (!cmd || cmd === "help" || has("--help")) {
    console.log(help);
  } else if (cmd === "synth") {
    await synth();
  } else if (cmd === "process") {
    await processCmd();
  } else if (cmd === "validate") {
    await validateCmd();
  } else if (cmd === "kit") {
    kit();
  } else if (cmd === "catalog") {
    catalog();
  } else {
    console.error(help);
    process.exit(1);
  }
}

main();
