import type { ReactNode } from "react";
import type { Metadata } from "next";
import { Instrument_Serif, IBM_Plex_Sans } from "next/font/google";
import "./globals.css";

const serif = Instrument_Serif({
  weight: "400",
  subsets: ["latin"],
  variable: "--font-serif",
});

const sans = IBM_Plex_Sans({
  weight: ["400"],
  subsets: ["latin"],
  variable: "--font-sans",
});

export const metadata: Metadata = {
  title: "Billion Universe",
  description:
    "The engines already exist. Billion Universe is what they were for — a universe that can hold a billion lives, including the ones that are not human.",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${serif.variable} ${sans.variable}`}>
      <body className="font-sans">{children}</body>
    </html>
  );
}
