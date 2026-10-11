import Link from "next/link";
import { Mark } from "@/components/Mark";

export default function NotFound() {
  return (
    <main className="mx-auto flex min-h-screen max-w-3xl flex-col items-center justify-center px-6 text-center">
      <Mark className="h-12 w-12" />
      <h1 className="mt-8 font-display text-3xl">Outside the universe.</h1>
      <Link href="/" className="mt-6 text-sm tracking-[0.18em] text-core uppercase">
        Enter
      </Link>
    </main>
  );
}
