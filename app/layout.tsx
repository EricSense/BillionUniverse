import type { Metadata } from "next";
import type { ReactNode } from "react";
import { Geist, Geist_Mono, Newsreader } from "next/font/google";
import { Providers } from "@/components/Providers";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const newsreader = Newsreader({
  variable: "--font-newsreader",
  subsets: ["latin"],
  style: ["normal", "italic"],
});

export const metadata: Metadata = {
  title: {
    default: "Billion Universe",
    template: "%s · Billion Universe",
  },
  description:
    "The operating system for companies built to reach a billion people. Name the market, measure who you actually reach, and run the path from first user to one billion.",
  applicationName: "Billion Universe",
  keywords: [
    "Billion Universe",
    "company operating system",
    "scale",
    "global markets",
    "startup",
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} ${newsreader.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col bg-paper text-ink">
        <Providers>{children}</Providers>
      </body>
    </html>
  );
}
