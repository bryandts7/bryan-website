"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Suspense, useState } from "react";
import { useT } from "@/lib/lang-client";
import type { MessageKey } from "@/lib/i18n";
import LangToggle from "./LangToggle";
import { T } from "./Lang";
import ThemeToggle from "./ThemeToggle";

const links: { href: string; label: MessageKey }[] = [
  { href: "/", label: "nav.about" },
  { href: "/experiences", label: "nav.experience" },
  { href: "/portfolio", label: "nav.projects" },
  { href: "/blogs", label: "nav.blog" },
];

function isActive(pathname: string | null, href: string) {
  if (pathname === null) return false;
  if (href === "/") return pathname === "/";
  if (href === "/blogs") return pathname === "/blogs" || pathname.startsWith("/blog/");
  return pathname === href || pathname.startsWith(`${href}/`);
}

/**
 * The current address is only known at request time, so the navbar first
 * renders without an active link (part of the static page) and the highlight
 * streams in once the address is available.
 */
export default function NavBar() {
  return (
    <Suspense fallback={<NavBarView pathname={null} />}>
      <NavBarWithPath />
    </Suspense>
  );
}

function NavBarWithPath() {
  return <NavBarView pathname={usePathname()} />;
}

function NavBarView({ pathname }: { pathname: string | null }) {
  const [open, setOpen] = useState(false);
  const t = useT();

  return (
    <header className="sticky top-0 z-50 border-b border-line bg-page/80 backdrop-blur supports-[backdrop-filter]:bg-page/70">
      <nav className="mx-auto flex h-16 w-full max-w-5xl items-center justify-between px-4 sm:px-6" aria-label="Main">
        <Link href="/" className="font-pixel text-xl text-ink" onClick={() => setOpen(false)}>
          Bryan Delton
        </Link>

        <div className="flex items-center gap-1">
          {/* Desktop */}
          <ul className="hidden items-center gap-1 md:flex">
            {links.map(({ href, label }) => {
              const active = isActive(pathname, href);
              return (
                <li key={href}>
                  <Link
                    href={href}
                    aria-current={active ? "page" : undefined}
                    className={`rounded-md px-3 py-2 text-sm font-medium transition-colors ${
                      active ? "bg-surface text-ink" : "text-muted hover:text-ink"
                    }`}
                  >
                    <T k={label} />
                  </Link>
                </li>
              );
            })}
          </ul>

          <LangToggle />
          <ThemeToggle />

          {/* Mobile */}
          <button
            type="button"
            className="-mr-2 rounded-md p-2 text-ink md:hidden"
            aria-label={open ? t("nav.closeMenu") : t("nav.openMenu")}
            aria-expanded={open}
            aria-controls="mobile-menu"
            onClick={() => setOpen((value) => !value)}
          >
            <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2} aria-hidden>
              {open ? (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
              ) : (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4 7h16M4 12h16M4 17h16" />
              )}
            </svg>
          </button>
        </div>
      </nav>

      {open && (
        <ul id="mobile-menu" className="border-t border-line bg-page px-4 py-2 md:hidden">
          {links.map(({ href, label }) => {
            const active = isActive(pathname, href);
            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? "page" : undefined}
                  onClick={() => setOpen(false)}
                  className={`block rounded-md px-3 py-3 text-base font-medium ${
                    active ? "bg-surface text-ink" : "text-muted hover:text-ink"
                  }`}
                >
                  <T k={label} />
                </Link>
              </li>
            );
          })}
        </ul>
      )}
    </header>
  );
}
