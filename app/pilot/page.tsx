import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { PilotView } from "@/components/pilot/PilotView";

export const metadata: Metadata = { title: "Request a pilot" };

export default function Page() {
  return (
    <Chrome>
      <PilotView />
    </Chrome>
  );
}
