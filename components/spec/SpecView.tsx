export function SpecView() {
  return (
    <article className="mx-auto max-w-3xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">UB-01</p>
      <h1 className="serif mt-2 text-4xl md:text-5xl">Universe Bundle specification</h1>
      <p className="mt-4 text-mist">
        This is what “structured dataset” means. A buyer trains on the JSON plus referenced geometry.
        The TypeScript source of truth is <span className="mono text-paper">lib/schema.ts</span>.
      </p>

      <h2 className="serif mt-12 text-3xl">Coordinate frame</h2>
      <ul className="mt-3 list-disc space-y-1 pl-5 text-sm text-mist">
        <li>Meters, right-handed</li>
        <li>X along the building long axis, Y along the short axis, Z up</li>
        <li>Origin at the southwest corner of the captured AABB; Z = 0 at finished floor</li>
        <li>Yaw about Z, radians, 0 = +X</li>
      </ul>

      <h2 className="serif mt-12 text-3xl">On-disk layout</h2>
      <pre className="mono mt-4 overflow-auto border border-line bg-ink p-4 text-[12px] text-mist">{`universe/
  universe.json          # this spec (manifest, site, rig, stats, qa)
  layout.json            # floors + zones (duplicated in universe.json for small sites)
  objects.jsonl          # one instance per line
  relations.jsonl
  physics.json           # material library + overrides
  geometry/
    cloud.laz
    mesh.glb
    occupancy.npy        # 5 cm, layers at 0.15 / 1.2 / 2.0 m
  imagery/
    rgb/{frame}.jpg
    depth/{frame}.png
    poses.jsonl
  calibration/
    extrinsics.yaml
    timestamps.csv
  qa.json`}</pre>

      <h2 className="serif mt-12 text-3xl">Instance record</h2>
      <p className="mt-3 text-sm text-mist">
        Every object carries class, AABB, yaw, zone, affordances, and physics: body type, estimated
        mass, material, friction, restitution, whether it is a support surface, whether a robot may
        traverse it, whether it is movable. Confidence is the pipeline’s vote from overlapping
        observations.
      </p>

      <h2 className="serif mt-12 text-3xl">Physics layer</h2>
      <p className="mt-3 text-sm text-mist">
        Class → prior (steel rack is static, pallet is dynamic, forklift is kinematic). Mass scales
        with observed load. This is not a full FEM model — it is the annotation world-model and
        robotics teams actually train on: what can move, what is an obstacle, what can be stacked,
        what a foot or wheel may cross.
      </p>

      <h2 className="serif mt-12 text-3xl">Privacy</h2>
      <p className="mt-3 text-sm text-mist">
        Public catalog cards keep location at coarse metro. Addresses, tenant names beyond the site
        alias, faces, and license plates do not ship in the training bundle without a signed
        custom-capture contract.
      </p>

      <h2 className="serif mt-12 text-3xl">SLA</h2>
      <p className="mt-3 text-sm text-mist">
        Capture today, bundle tomorrow. <span className="text-paper">sla_hours: 24</span> is a field
        on every universe. QA status is pass / warn / fail. Fail does not ship.
      </p>
    </article>
  );
}
