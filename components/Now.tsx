"use client";

import { useEffect, useState } from "react";

function stamp(ms: number) {
  return new Intl.DateTimeFormat("en", {
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
    timeZone: "UTC",
    hour12: false,
  }).format(new Date(ms));
}

/** The universe uses this world's time. */
export function Now() {
  const [ms, setMs] = useState<number | null>(null);

  useEffect(() => {
    setMs(Date.now());
    const id = window.setInterval(() => setMs(Date.now()), 1000);
    return () => window.clearInterval(id);
  }, []);

  return (
    <p className="font-mono text-[13px] tracking-[0.14em] text-mute">
      {ms === null ? "—" : `${stamp(ms)} UTC`}
    </p>
  );
}
