"use client";

import Link from "next/link";
import { useState } from "react";

const links = [
  { href: "/", label: "About Me" },
  { href: "/experiences", label: "Experiences" },
  { href: "/portfolio", label: "Projects" },
  { href: "/blogs", label: "Blog" },
];

export default function NavBar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="sticky top-0 z-50 mb-5 bg-gray-900 text-white shadow-md">
      <div className="flex h-16 items-center justify-between px-6 md:px-12">
        <Link href="/" className="font-pixelify-sans">
          Bryan Delton
        </Link>

        {/* Desktop menu */}
        <ul className="hidden h-full md:flex">
          {links.map(({ href, label }) => (
            <li key={href} className="h-full">
              <Link
                href={href}
                className="flex h-full items-center px-5 text-sm transition-colors duration-300 hover:bg-white hover:text-black"
              >
                {label}
              </Link>
            </li>
          ))}
        </ul>

        {/* Mobile menu button */}
        <button
          type="button"
          className="p-2 md:hidden"
          aria-label="Open menu"
          aria-expanded={open}
          onClick={() => setOpen(true)}
        >
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-6 w-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            strokeWidth={2}
          >
            <path strokeLinecap="round" strokeLinejoin="round" d="M4 6h16M4 12h16M4 18h16" />
          </svg>
        </button>
      </div>

      {/* Mobile drawer */}
      {open && (
        <div className="fixed inset-0 z-50 md:hidden">
          <button
            type="button"
            className="absolute inset-0 h-full w-full cursor-default bg-black/50"
            aria-label="Close menu"
            onClick={() => setOpen(false)}
          />
          <div className="absolute inset-y-0 left-0 flex w-72 max-w-[80%] flex-col bg-gray-900 shadow-xl">
            <div className="flex h-16 items-center justify-between border-b border-gray-700 px-6">
              <span className="font-semibold">Menu</span>
              <button
                type="button"
                className="p-2"
                aria-label="Close menu"
                onClick={() => setOpen(false)}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth={2}
                >
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6 6l12 12M18 6L6 18" />
                </svg>
              </button>
            </div>
            <ul>
              {links.map(({ href, label }) => (
                <li key={href}>
                  <Link
                    href={href}
                    className="block px-6 py-4 transition-colors duration-300 hover:bg-white hover:text-black"
                    onClick={() => setOpen(false)}
                  >
                    {label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </div>
      )}
    </nav>
  );
}
