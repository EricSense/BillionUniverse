import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { PlanView } from "@/components/plan/PlanView";

export const metadata: Metadata = { title: "First 90 days" };

export default function Page() {
  return (
    <Chrome>
      <PlanView />
    </Chrome>
  );
}
