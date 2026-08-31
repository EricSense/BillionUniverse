import type { Metadata } from "next";
import { Fraunces, IBM_Plex_Mono, Outfit, Syne } from "next/font/google";
import { Field } from "@/components/Field";
import { Nav } from "@/components/Nav";
import { PersonProvider } from "@/components/PersonProvider";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  variable: "--font-fraunces",
  display: "swap",
});

const syne = Syne({
  subsets: ["latin"],
  variable: "--font-syne",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

const mono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-mono",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Billion Universe — Adapt to the person, not the platform",
  description:
    "Billion Universe is a personal operating surface. Light, language, density, and gravity rearrange around who you are — not around a platform's wireframe.",
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html
      lang="en"
      className={`${fraunces.variable} ${syne.variable} ${outfit.variable} ${mono.variable}`}
      suppressHydrationWarning
    >
      <body className="min-h-screen antialiased">
        <PersonProvider>
          <Field />
          <div className="relative z-10 flex min-h-screen flex-col">
            <Nav />
            <main className="flex-1">{children}</main>
            <footer className="relative z-10 border-t border-line px-6 py-8">
              <div className="mx-auto flex max-w-6xl flex-wrap items-center justify-between gap-3 text-xs uppercase tracking-[0.18em] text-muted">
                <p>Billion Universe</p>
                <p>Adapt to the person, not the platform.</p>
              </div>
            </footer>
          </div>
        </PersonProvider>
      </body>
    </html>
  );
}
