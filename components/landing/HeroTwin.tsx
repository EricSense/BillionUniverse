"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import type { Universe } from "@/lib/schema";

const Scene = dynamic(() => import("@/components/universe/UniverseScene").then((m) => m.UniverseScene), {
  ssr: false,
  loading: () => <div className="h-full bg-ink" />,
});

export function HeroTwin({ universe }: { universe: Universe }) {
  const [selected, setSelected] = useState<string | null>(null);
  return (
    <div className="h-full min-h-[380px]">
      <Scene universe={universe} mode="segment" selectedId={selected} onSelect={setSelected} />
    </div>
  );
}
