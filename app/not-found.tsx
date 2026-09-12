import Link from "next/link";
import { Chrome } from "@/components/Chrome";

export default function NotFound() {
  return (
    <Chrome>
      <div className="mx-auto max-w-xl px-5 py-24">
        <p className="mono text-[11px] text-scan">404</p>
        <h1 className="serif mt-2 text-4xl">No universe at this coordinate.</h1>
        <Link href="/catalog" className="mt-6 inline-block text-sm text-scan">
          Back to catalog
        </Link>
      </div>
    </Chrome>
  );
}
