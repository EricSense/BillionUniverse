import type { Metadata } from "next";
import { Arrive } from "@/components/Arrive";

export const metadata: Metadata = { title: "Arrive" };

export default function Page() {
  return <Arrive />;
}
