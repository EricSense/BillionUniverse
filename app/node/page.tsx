import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { NodeConsole } from "@/components/NodeConsole";

export const metadata: Metadata = { title: "Node" };

export default function Page() {
  return (
    <Chrome>
      <NodeConsole />
    </Chrome>
  );
}
