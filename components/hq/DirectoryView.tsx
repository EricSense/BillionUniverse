"use client";

import Link from "next/link";
import { formatPeople, formatPeopleLong, sectorLabel } from "@/lib/format";
import { ScalePath } from "@/components/ScalePath";
import { useStore } from "@/lib/store";

export function DirectoryView() {
  const { companies } = useStore();
  const list = companies.filter((company) => company.public);

  return (
    <div className="mx-auto max-w-6xl">
      <p className="text-xs uppercase tracking-[0.18em] text-hq-mist">Directory</p>
      <h1 className="font-display mt-3 text-4xl tracking-tight">Companies on the path.</h1>
      <p className="mt-3 max-w-2xl text-hq-mist">
        Public HQs. Same axis for everyone: people reached toward one billion.
      </p>
      <div className="mt-8 space-y-4">
        {list.map((company) => (
          <Link
            key={company.id}
            href={`/c/${company.slug}`}
            className="block rounded-2xl bg-hq-panel p-5 hq-hairline"
          >
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="text-lg font-medium">{company.name}</p>
                <p className="mt-1 text-sm text-hq-mist">{company.tagline}</p>
              </div>
              <p className="font-mono text-sm">{formatPeople(company.peopleReached)}</p>
            </div>
            <div className="mt-5">
              <ScalePath people={company.peopleReached} tone="dark" compact />
            </div>
            <p className="mt-4 text-xs text-hq-mist">
              {sectorLabel(company.sector)} · {company.hq} · {company.stage}
            </p>
          </Link>
        ))}
      </div>
      {list.length === 0 ? (
        <p className="mt-10 text-hq-mist">No public companies yet.</p>
      ) : (
        <p className="mt-8 font-mono text-xs text-hq-mist">
          {list.length} companies · {formatPeopleLong(list.reduce((s, c) => s + c.peopleReached, 0))} people reached combined
        </p>
      )}
    </div>
  );
}
