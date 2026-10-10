import Link from "next/link";
import { Shell } from "@/components/Shell";

export default function NotFound() {
  return (
    <Shell>
      <div className="mx-auto max-w-xl px-5 py-24">
        <p className="text-lamp">Unmapped</p>
        <h1 className="serif mt-2 text-4xl">This plot is empty.</h1>
        <Link href="/atlas" className="mt-6 inline-block text-sm text-lamp">
          Back to the atlas
        </Link>
      </div>
    </Shell>
  );
}
