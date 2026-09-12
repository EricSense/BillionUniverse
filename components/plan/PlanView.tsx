import { usd, ninetyDayTotal } from "@/lib/kit";

const WEEKS = [
  {
    when: "Days 1–14",
    title: "One rig that actually walks",
    body: "Order Walker v0. Print AprilTags. Calibrate extrinsics on a tape-measured bay. Capture a friendly warehouse or a large industrial shop you already have access to. Run the pipeline. Ship universe 0001 even if it is ugly. The point is a closed loop: floor → bag → UB-01.",
  },
  {
    when: "Days 15–45",
    title: "Ten warehouses, 24-hour habit",
    body: "Book 8–12 logistics sites (3PLs, regional grocery DCs, a robotics-lab mock floor). Same operator, same cart, same height. Process overnight. Catalog cards go up as each bundle passes QA. This is the 10–20 space target.",
  },
  {
    when: "Days 46–70",
    title: "Package it like a product",
    body: "Freeze UB-01. Write the one-pager a perception lead can hand to legal. Add two retail floors so the library is not only racks. Strip PII to metro. Put three similar DCs in a slice a mid-size AMR company can train on immediately.",
  },
  {
    when: "Days 71–90",
    title: "One paid pilot",
    body: "Not a frontier lab. A warehouse robotics or last-mile company that already pays for mapping and cannot staff a capture team. Deliver the slice, sit on-site for one integration week, invoice. That proof is what makes the rest fundable.",
  },
];

export function PlanView() {
  return (
    <div className="mx-auto max-w-3xl px-5 py-12">
      <p className="mono text-[11px] tracking-widest text-scan uppercase">First 90 days</p>
      <h1 className="serif mt-2 text-4xl md:text-5xl">
        Build one rig. Capture real spaces. Sell one pilot.
      </h1>
      <p className="mt-4 text-mist">
        Cash out the door: {usd(ninetyDayTotal())}. The long-term asset is the library. The 90-day
        job is to prove a space can be turned into a training-ready universe on a clock a buyer
        believes.
      </p>
      <ol className="mt-12 space-y-8">
        {WEEKS.map((w) => (
          <li key={w.when} className="border-t border-line pt-6">
            <p className="mono text-[11px] text-scan">{w.when}</p>
            <h2 className="serif mt-1 text-3xl">{w.title}</h2>
            <p className="mt-3 text-sm leading-relaxed text-mist">{w.body}</p>
          </li>
        ))}
      </ol>
    </div>
  );
}
