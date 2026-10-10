import Link from "next/link";
import { Chrome } from "@/components/Chrome";

export default function NotFound() {
  return (
    <Chrome>
      <div className="mx-auto max-w-xl px-5 py-24">
        <p className="mono text-heat">NO SITE</p>
        <h1 className="mt-2 text-4xl font-medium">This plot is not a Node yet.</h1>
        <Link href="/fleet" className="mt-6 inline-block text-sm text-heat">
          Fleet
        </Link>
      </div>
    </Chrome>
  );
}
