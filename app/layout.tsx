import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Outfit, Sora } from "next/font/google";
import { NAME, THESIS } from "@/lib/universe";
import "./globals.css";

const sans = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
});

const display = Sora({
  subsets: ["latin"],
  variable: "--font-sora",
});

export const metadata: Metadata = {
  metadataBase: new URL("https://billionuniverse.vercel.app"),
  title: NAME,
  description: THESIS.line,
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${sans.variable} ${display.variable}`}>
      <body>{children}</body>
    </html>
  );
}
