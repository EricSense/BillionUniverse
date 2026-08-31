import Link from "next/link";
import { Logo } from "@/components/Logo";

export default function NotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-paper px-6">
      <Logo />
      <h1 className="font-display mt-10 text-4xl">This page is not on the path.</h1>
      <Link href="/" className="mt-4 text-sm text-mist">
        Back to Billion Universe
      </Link>
    </div>
  );
}
