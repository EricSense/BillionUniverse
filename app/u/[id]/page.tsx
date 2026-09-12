import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Chrome } from "@/components/Chrome";
import { UniverseView } from "@/components/universe/UniverseView";
import { catalog, getUniverse } from "@/lib/catalog";

type Props = { params: Promise<{ id: string }> };

export function generateStaticParams() {
  return catalog().map((u) => ({ id: u.universe_id }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = await params;
  const u = getUniverse(id);
  return { title: u?.site.name ?? "Universe" };
}

export default async function Page({ params }: Props) {
  const { id } = await params;
  const u = getUniverse(id);
  if (!u) notFound();
  return (
    <Chrome>
      <UniverseView universe={u} />
    </Chrome>
  );
}
