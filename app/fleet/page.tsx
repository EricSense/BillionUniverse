import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { FleetView } from "@/components/FleetView";

export const metadata: Metadata = { title: "Fleet" };

export default function Page() {
  return (
    <Chrome>
      <FleetView />
    </Chrome>
  );
}
