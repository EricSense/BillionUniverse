import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { PlanView } from "@/components/PlanView";

export const metadata: Metadata = { title: "Plan" };

export default function Page() {
  return (
    <Chrome>
      <PlanView />
    </Chrome>
  );
}
