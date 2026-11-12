"use client";

import { useRouter } from "next/navigation";
import { Fragment, type ReactNode } from "react";

/**
 * Next.js keeps recently visited pages alive (hidden) so their state survives
 * navigation. For admin forms that would show stale input: after creating a
 * post, "New post" would open with the old text still in it. Keying on
 * bfcacheId starts a fresh form on every new visit, while the browser's
 * back/forward buttons still restore what was typed.
 */
export default function ResetOnNavigate({ children }: { children: ReactNode }) {
  const { bfcacheId } = useRouter();
  return <Fragment key={bfcacheId}>{children}</Fragment>;
}
