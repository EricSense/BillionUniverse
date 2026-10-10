import type { Metadata } from "next";
import { AtlasView } from "@/components/AtlasView";

export const metadata: Metadata = { title: "Atlas" };

export default function Page() {
  return <AtlasView />;
}
