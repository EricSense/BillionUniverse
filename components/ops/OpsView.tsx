import { catalog } from "@/lib/catalog";
import { JOBS, STAGE_LABEL } from "@/lib/ops";
import { m2 } from "@/lib/format";

const ORDER: (typeof JOBS)[number]["stage"][] = [
  "access",
  "scheduled",
  "capturing",
  "ingest",
  "slam",
  "segment",
  "qa",
  "shipped",
];

export function OpsView() {
  const lib = catalog();
  const jobs = JOBS.map((j) => {
    const u = lib.find((x) => x.universe_id === j.universe_id);
    return { ...j, area_m2: u?.site.area_m2 ?? j.area_m2 };
  });
  const shipped = jobs.filter((j) => j.stage === "shipped").length;

  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">Field ops</p>
      <h1 className="serif mt-2 text-4xl md:text-5xl">Trucks, technicians, kits, logistics.</h1>
      <p className="mt-4 max-w-2xl text-mist">
        This is a real-world service business. The software is the mill; the moat is being the crew
        that shows up. {shipped} universes shipped in this 90-day board.
      </p>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-mist">
              <th className="py-2 font-medium">Job</th>
              <th className="py-2 font-medium">Site</th>
              <th className="py-2 font-medium">Vertical</th>
              <th className="py-2 font-medium">Day</th>
              <th className="py-2 font-medium">Area</th>
              <th className="py-2 font-medium">Stage</th>
            </tr>
          </thead>
          <tbody>
            {jobs.map((j) => (
              <tr key={j.id} className="border-b border-line/80">
                <td className="py-2 mono text-mist">{j.id}</td>
                <td className="py-2">
                  {j.site}
                  <span className="block text-[12px] text-mist">{j.metro}</span>
                </td>
                <td className="py-2">{j.vertical}</td>
                <td className="py-2 mono">{j.day}</td>
                <td className="py-2 mono">{j.area_m2 ? m2(j.area_m2) : "—"}</td>
                <td className="py-2">
                  <Stage stage={j.stage} />
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <p className="mt-6 text-[12px] text-mist">
        Pipeline order: {ORDER.map((s) => STAGE_LABEL[s]).join(" → ")}.
      </p>
    </div>
  );
}

function Stage({ stage }: { stage: (typeof JOBS)[number]["stage"] }) {
  const done = stage === "shipped";
  return (
    <span className={`mono text-[12px] ${done ? "text-scan" : "text-paper"}`}>
      {STAGE_LABEL[stage]}
    </span>
  );
}
