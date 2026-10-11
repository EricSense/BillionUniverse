import { Chrome } from "@/components/Chrome";
import Link from "next/link";

export default function NotFound() {
  return (
    <Chrome>
      <main className="mx-auto flex min-h-[60vh] max-w-6xl flex-col items-center justify-center px-6 text-center">
        <p className="text-[11px] tracking-[0.22em] text-ring uppercase">404</p>
        <h1 className="mt-3 font-display text-4xl">Outside the field.</h1>
        <Link href="/" className="mt-8 text-sm tracking-[0.18em] text-core uppercase">
          Return to core
        </Link>
      </main>
    </Chrome>
  );
}
