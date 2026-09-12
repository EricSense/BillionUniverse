import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { ThesisView } from "@/components/thesis/ThesisView";

export const metadata: Metadata = { title: "Thesis" };

export default function Page() {
  return (
    <Chrome>
      <ThesisView />
    </Chrome>
  );
}
