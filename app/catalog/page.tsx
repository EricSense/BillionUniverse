import type { Metadata } from "next";
import { Chrome } from "@/components/Chrome";
import { CatalogView } from "@/components/catalog/CatalogView";

export const metadata: Metadata = { title: "Catalog" };

export default function Page() {
  return (
    <Chrome>
      <CatalogView />
    </Chrome>
  );
}
