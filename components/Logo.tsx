import Link from "next/link";

export function Logo({
  href = "/",
  tone = "light",
  size = "md",
}: {
  href?: string | null;
  tone?: "light" | "dark";
  size?: "sm" | "md";
}) {
  const mark = size === "sm" ? "h-7 w-7 text-[13px]" : "h-8 w-8 text-sm";
  const word = size === "sm" ? "text-[15px]" : "text-base";
  const invert = tone === "dark";

  const inner = (
    <span className="inline-flex items-center gap-2.5">
      <span
        className={`${mark} inline-flex items-center justify-center rounded-md font-semibold tracking-tight ${
          invert ? "bg-hq-text text-hq" : "bg-ink text-paper"
        }`}
      >
        B
      </span>
      <span
        className={`${word} font-medium tracking-tight ${invert ? "text-hq-text" : "text-ink"}`}
      >
        Billion Universe
      </span>
    </span>
  );

  if (!href) return inner;
  return (
    <Link href={href} className="inline-flex items-center">
      {inner}
    </Link>
  );
}
