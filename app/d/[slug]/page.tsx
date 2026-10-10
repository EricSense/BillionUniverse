import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { DistrictView } from "@/components/DistrictView";
import { DISTRICTS, getDistrict } from "@/lib/world";

type Props = { params: Promise<{ slug: string }> };

export function generateStaticParams() {
  return DISTRICTS.map((d) => ({ slug: d.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  return { title: getDistrict(slug)?.name ?? "District" };
}

export default async function Page({ params }: Props) {
  const { slug } = await params;
  const d = getDistrict(slug);
  if (!d) notFound();
  return <DistrictView district={d} />;
}
