import { CompanyPublic } from "@/components/hq/CompanyPublic";

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  return <CompanyPublic slug={slug} />;
}
