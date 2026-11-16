import Link from "next/link";
import { T } from "@/components/Lang";
import { buttonSecondary } from "@/components/ui";

export default function NotFound() {
  return (
    <div className="flex grow flex-col items-center justify-center px-4 py-24 text-center">
      <p className="font-pixel text-6xl text-ink">404</p>
      <h1 className="mt-4 text-lg font-semibold text-ink">
        <T k="notFound.title" />
      </h1>
      <p className="mt-1 text-muted">
        <T k="notFound.body" />
      </p>
      <Link href="/" className={`${buttonSecondary} mt-8`}>
        <T k="notFound.home" />
      </Link>
    </div>
  );
}
