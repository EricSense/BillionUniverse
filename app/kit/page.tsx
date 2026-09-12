import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { KitView } from "@/components/kit/KitView";

export const metadata: Metadata = { title: "Capture kit" };

export default function Page() {
  return (
    <Chrome>
      <KitView />
    </Chrome>
  );
}
