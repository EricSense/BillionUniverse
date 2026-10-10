import type { Metadata } from "next";
import { RoomView } from "@/components/RoomView";

export const metadata: Metadata = { title: "Your room" };

export default function Page() {
  return <RoomView />;
}
