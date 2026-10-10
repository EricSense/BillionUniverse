import { KIT, kitTotal } from "@/lib/nodes";

export function StackView() {
  const total = kitTotal();
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mono text-[11px] tracking-[0.22em] text-heat uppercase">Stack</p>
      <h1 className="mt-2 text-4xl font-medium md:text-5xl">The article you can copy.</h1>
      <p className="mt-4 text-sm text-mist">
        Falcon 9 is a rocket you fly again. A Node is a site you stand up again. We do not build a
        constellation in orbit. We buy the link (Starlink / LTE), then own everything from the mast
        to the roster.
      </p>
      <table className="mt-10 w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-line text-mist">
            <th className="py-2 font-medium">Item</th>
            <th className="py-2 font-medium">Role</th>
            <th className="py-2 font-medium text-right">USD</th>
          </tr>
        </thead>
        <tbody>
          {KIT.map((k) => (
            <tr key={k.item} className="border-b border-line/80">
              <td className="py-3">{k.item}</td>
              <td className="py-3 text-mist">{k.role}</td>
              <td className="py-3 text-right mono">{k.usd ? k.usd.toLocaleString() : "included"}</td>
            </tr>
          ))}
          <tr>
            <td className="py-3 font-medium">Node 1 hardware</td>
            <td />
            <td className="py-3 text-right mono text-heat">{total.toLocaleString()}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-6 text-sm text-mist">
        Under $8k before labor. That is the point. Starlink terminals were cheap enough to multiply.
        Nodes have to be too.
      </p>
    </div>
  );
}
