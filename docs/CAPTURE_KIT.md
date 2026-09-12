# Capture kit

Two walkable rigs plus a overnight process station. Prices are street quotes for parts you can order; not a custom silicon program.

## Walker v0 — prove-it (~$4.8k)

Livox Mid-360, ZED 2i, two OAK-D Pro W, MicroStrain 3DM-CV7, Jetson Orin NX 16GB, 2 TB NVMe, hot-swap 98 Wh packs, aluminum cart/mast, AprilTag set, sync harness.

One technician. Indoor warehouses and retail floors. Target: a full DC walk in a shift, bundle by morning.

## Walker v1 — production (~$12k indoor, ~$22k with RTK)

Ouster OS1-128, four global-shutter cameras, ZED X, 3DM-GV7, optional Emlid Reach RS3, AGX Orin, dual 4 TB NVMe, survey cart.

Use after the first ten sites, or as soon as a buyer needs survey-grade clouds.

## Process station (~$4.2k)

RTX 4090 workstation + 20 TB NAS. First twenty sites do not need a cluster.

## 90-day cash

Kit + station + access + travel + insurance ≈ **$21k**. See `/kit` or `npm run bu -- kit`.

## Field method

1. Place floor AprilTags at aisle ends and dock corners.
2. Walk a snake through every aisle, then a dock pass.
3. Keep sensor height at 1.55–1.65 m.
4. Pull SSD, hash, ingest. Pipeline SLA is 24 hours.
