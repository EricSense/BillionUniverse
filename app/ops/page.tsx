import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { OpsView } from "@/components/ops/OpsView";

export const metadata: Metadata = { title: "Field ops" };

export default function Page() {
  return (
    <Chrome>
      <OpsView />
    </Chrome>
  );
}
