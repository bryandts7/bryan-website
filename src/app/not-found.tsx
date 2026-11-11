import Link from "next/link";
import { buttonSecondary } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex grow flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-pixel text-6xl text-ink">404</p>
      <h1 className="mt-4 text-lg font-semibold text-ink">This page could not be found.</h1>
      <p className="mt-1 text-muted">It may have moved, or the link may be mistyped.</p>
      <Link href="/" className={`${buttonSecondary} mt-8`}>
        Back to home
      </Link>
    </div>
  );
}
