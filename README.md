# Billion Universe

Physical reality-capture network for training world models and robots.

AI labs racing to build world models and robots are bottlenecked on real, richly labeled 3D environment data. Compute is abundant. There is no internet of physical space. Billion Universe deploys capture rigs into warehouses, retail floors, job sites, and streets, and turns each one into a structured **universe**: a mapped, physics-annotated digital twin sold as training data.

Every captured space is one universe in the catalog. The business scales by multiplying environments.

## What it does

Sends capture teams into real spaces with LiDAR, multi-camera, and depth kits. Returns a 3D map with object segmentation, spatial relations, and physics metadata (what moves, what is an obstacle, surface properties, layout logic). Sells library access and custom captures to companies whose models have to act in the physical world.

## What it solves

Language models scraped the internet. Robots cannot. Each robotics company today builds a one-off capture op. Billion Universe is that layer as infrastructure — capital-light versus chips, operationally a service business (trucks, technicians, kits, logistics).

## What it makes possible

- Faster robot training against licensed environments instead of instrumenting every building
- World models trained on real spatial and material data, not only pixels
- A data moat independent of the compute war
- Capture as a default step in embodied AI, the way scraping became default for LLMs
- The same universes sold onward to insurance, real estate, retail analytics, urban planning

## First product

Mobile capture kit + 24-hour pipeline: walkthrough → point cloud, instances, physics → **Universe Bundle (UB-01)**. First vertical: warehouse / logistics.

## First customer

Mid-size robotics and logistics companies who need environment data now. That revenue funds the library, which is the asset later licensed to frontier labs.

## First 90 days

One Walker rig, 10–20 real spaces, one paid pilot. Cash out the door is on the Kit page (~$21k).

## Run

```bash
npm install
npm test
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

```bash
npm run bu -- kit
npm run bu -- synth --seed 1 --vertical warehouse
npm run bu -- catalog
```

| Surface | Path |
| --- | --- |
| Catalog | `/catalog` |
| Universe twin | `/u/univ_wh_0001` |
| Capture kit BOM | `/kit` |
| 24h pipeline lab | `/pipeline` |
| 90-day plan | `/plan` |
| Field ops | `/ops` |
| Dataset spec | `/spec` |
| Thesis | `/thesis` |

Coordinate frame: meters, Z-up, origin at the southwest finished-floor corner. Schema: `lib/schema.ts`. Pipeline: `lib/pipeline/`.

This repo is a working mill — synthesizer, capture simulation, processor, validator, catalog, and viewer — so the kit and the bundle format are buildable, not a slide.
