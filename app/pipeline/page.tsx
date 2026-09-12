import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { PipelineView } from "@/components/pipeline/PipelineView";

export const metadata: Metadata = { title: "Pipeline" };

export default function Page() {
  return (
    <Chrome>
      <PipelineView />
    </Chrome>
  );
}
