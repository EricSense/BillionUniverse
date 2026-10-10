import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { StackView } from "@/components/StackView";

export const metadata: Metadata = { title: "Stack" };

export default function Page() {
  return (
    <Chrome>
      <StackView />
    </Chrome>
  );
}
