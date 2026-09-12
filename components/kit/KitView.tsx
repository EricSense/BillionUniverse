import {
  kitTotal,
  usd,
  WALKER_V0,
  WALKER_V1,
  PROCESS_STATION,
  NINETY_DAY_BUDGET,
  ninetyDayTotal,
  type Kit,
} from "@/lib/kit";

export function KitView() {
  return (
    <div className="mx-auto max-w-6xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">Capture kit</p>
      <h1 className="serif mt-2 max-w-3xl text-4xl md:text-5xl">
        One technician, one cart, one shift. A warehouse becomes a universe by morning.
      </h1>
      <p className="mt-4 max-w-2xl text-mist">
        First product is a mobile kit plus a 24-hour processing pipeline. Parts are orderable now.
        Nothing here requires a custom silicon program.
      </p>

      <KitTable kit={WALKER_V0} accent="Prove-it" />
      <KitTable kit={WALKER_V1} accent="Production" />
      <KitTable kit={PROCESS_STATION} accent="Overnight" />

      <h2 className="serif mt-16 text-3xl">First 90 days, cash out the door</h2>
      <table className="mt-4 w-full text-left text-sm">
        <tbody>
          {NINETY_DAY_BUDGET.map((row) => (
            <tr key={row.label} className="border-b border-line">
              <td className="py-2 text-mist">{row.label}</td>
              <td className="py-2 text-right mono">{usd(row.usd)}</td>
            </tr>
          ))}
          <tr>
            <td className="py-3 font-medium">Total</td>
            <td className="py-3 text-right mono text-scan">{usd(ninetyDayTotal())}</td>
          </tr>
        </tbody>
      </table>
      <p className="mt-4 text-sm text-mist">
        Indoor production kit without RTK is {usd(kitTotal(WALKER_V1, false))}. Add Reach RS3 when you
        step outside.
      </p>
    </div>
  );
}

function KitTable({ kit, accent }: { kit: Kit; accent: string }) {
  return (
    <section className="mt-12">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <p className="mono text-[11px] text-scan">{accent}</p>
          <h2 className="serif text-3xl">{kit.name}</h2>
          <p className="mt-2 max-w-2xl text-sm text-mist">{kit.summary}</p>
        </div>
        <p className="mono text-xl text-scan">{usd(kitTotal(kit))}</p>
      </div>
      <table className="mt-5 w-full text-left text-[13px]">
        <thead>
          <tr className="border-b border-line text-mist">
            <th className="py-2 font-medium">Item</th>
            <th className="py-2 font-medium">Role</th>
            <th className="py-2 font-medium text-right">Qty</th>
            <th className="py-2 font-medium text-right">Ext</th>
          </tr>
        </thead>
        <tbody>
          {kit.items.map((item) => (
            <tr key={item.sku} className="border-b border-line/80">
              <td className="py-2">
                {item.name}
                {item.optional ? <span className="ml-2 text-[11px] text-mist">optional</span> : null}
              </td>
              <td className="py-2 text-mist">{item.role}</td>
              <td className="py-2 text-right mono">{item.qty}</td>
              <td className="py-2 text-right mono">{usd(item.qty * item.unit_usd)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </section>
  );
}
