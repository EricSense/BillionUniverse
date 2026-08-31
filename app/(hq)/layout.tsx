import type { ReactNode } from "react";
import { AppShell } from "@/components/hq/AppShell";

export default function HqLayout({ children }: { children: ReactNode }) {
  return <AppShell>{children}</AppShell>;
}
