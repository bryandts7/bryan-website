import type { Metadata } from "next";
import type { ReactNode } from "react";
import localFont from "next/font/local";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";
import "./globals.css";

const pixelifySans = localFont({
  src: "../fonts/PixelifySans-VariableFont_wght.ttf",
  variable: "--font-pixelify",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "Bryan Delton Tawarikh Sibarani",
    template: "%s | Bryan Delton Tawarikh Sibarani",
  },
  description:
    "Personal website of Bryan Delton Tawarikh Sibarani: about me, experience, projects and blog.",
  verification: {
    google: "nsCRH4yuz0eWgY6hmeggKSzE3bO5v0QIkYu8-JfbdT8",
  },
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en" className={pixelifySans.variable}>
      <body className="flex min-h-screen flex-col">
        <NavBar />
        <main className="flex grow flex-col">{children}</main>
        <Footer />
      </body>
    </html>
  );
}
