import type { Metadata, Viewport } from "next";
import { Inter, JetBrains_Mono } from "next/font/google";
import localFont from "next/font/local";
import type { ReactNode } from "react";
import Footer from "@/components/Footer";
import NavBar from "@/components/NavBar";
import { OPEN_GRAPH_DEFAULTS, SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "@/lib/site";
import "./globals.css";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter", display: "swap" });
const jetbrains = JetBrains_Mono({ subsets: ["latin"], variable: "--font-jetbrains", display: "swap" });
const pixelify = localFont({
  src: "../fonts/PixelifySans-VariableFont_wght.ttf",
  variable: "--font-pixelify",
  display: "swap",
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: SITE_NAME,
    template: `%s | ${SITE_NAME}`,
  },
  description: SITE_DESCRIPTION,
  openGraph: OPEN_GRAPH_DEFAULTS,
  twitter: { card: "summary_large_image" },
  // Each page sets its own canonical address; a default here would point
  // every page at the home page.
  alternates: {
    types:{ "application/rss+xml": [{ url: "/feed.xml", title: `${SITE_NAME} – Blog` }] },
  },
  verification: {
    google: "nsCRH4yuz0eWgY6hmeggKSzE3bO5v0QIkYu8-JfbdT8",
  },
};

export const viewport: Viewport = {
  themeColor: [
    { media: "(prefers-color-scheme: light)", color: "#ffffff" },
    { media: "(prefers-color-scheme: dark)", color: "#0b0b0e" },
  ],
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={`${inter.variable} ${jetbrains.variable} ${pixelify.variable}`}>
      <body className="flex min-h-screen flex-col">
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:top-2 focus:left-2 focus:z-[60] focus:rounded-md focus:bg-card focus:px-3 focus:py-2 focus:text-sm focus:shadow"
        >
          Skip to content
        </a>
        <NavBar />
        <main id="main" className="flex grow flex-col">
          {children}
        </main>
        <Footer />
      </body>
    </html>
  );
}
