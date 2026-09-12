import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { SpecView } from "@/components/spec/SpecView";

export const metadata: Metadata = { title: "Universe Bundle spec" };

export default function Page() {
  return (
    <Chrome>
      <SpecView />
    </Chrome>
  );
}
