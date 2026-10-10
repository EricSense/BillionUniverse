import Link from "next/link";
import { FLEET } from "@/lib/nodes";

const LABEL: Record<string, string> = {
  online: "ONLINE",
  degraded: "DEGRADED",
  deploying: "DEPLOYING",
  planned: "PLANNED",
};

export function FleetView() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="mono text-[11px] tracking-[0.22em] text-heat uppercase">Fleet</p>
      <h1 className="mt-2 max-w-3xl text-4xl font-medium md:text-5xl">
        A constellation of places, not satellites.
      </h1>
      <p className="mt-4 max-w-2xl text-sm text-mist">
        Starlink put a dish on a roof. We put a Node on the dirt. Enough Nodes and the universe is
        not a metaphor. It is a network you can stand in.
      </p>
      <div className="mt-10 overflow-x-auto">
        <table className="w-full min-w-[720px] text-left text-[13px]">
          <thead>
            <tr className="border-b border-line text-mist">
              <th className="py-2 font-medium">ID</th>
              <th className="py-2 font-medium">Site</th>
              <th className="py-2 font-medium">Kind</th>
              <th className="py-2 font-medium">Status</th>
              <th className="py-2 font-medium">People</th>
              <th className="py-2 font-medium">Link</th>
            </tr>
          </thead>
          <tbody>
            {FLEET.map((n) => (
              <tr key={n.id} className="border-b border-line/80">
                <td className="py-3 mono">
                  <Link href="/node" className="hover:text-heat">
                    {n.id}
                  </Link>
                </td>
                <td className="py-3">
                  {n.name}
                  <span className="block text-[12px] text-mist">{n.region}</span>
                </td>
                <td className="py-3">{n.kind}</td>
                <td className={`py-3 mono ${n.status === "online" ? "text-paper" : "text-heat"}`}>
                  {LABEL[n.status]}
                </td>
                <td className="py-3 mono">{n.people}</td>
                <td className="py-3 mono">{n.link_pct ? `${n.link_pct}%` : "—"}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
