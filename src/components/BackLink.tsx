import Link from "next/link";
import { ArrowLeftIcon } from "./icons";

export default function BackLink({ href, children }: { href: string; children: string }) {
  return (
    <Link
      href={href}
      className="inline-flex items-center gap-1.5 text-sm font-medium text-muted transition-colors hover:text-ink"
    >
      <ArrowLeftIcon />
      {children}
    </Link>
  );
}
