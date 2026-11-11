import Link from "next/link";
import { SITE_NAME, SOCIAL_LINKS } from "@/lib/site";
import { GitHubIcon, InstagramIcon, LinkedInIcon, RssIcon } from "./icons";

const social = [
  { href: SOCIAL_LINKS.github, label: "GitHub", Icon: GitHubIcon },
  { href: SOCIAL_LINKS.linkedin, label: "LinkedIn", Icon: LinkedInIcon },
  { href: SOCIAL_LINKS.instagram, label: "Instagram", Icon: InstagramIcon },
];

export default function Footer() {
  return (
    <footer className="mt-16 border-t border-line">
      <div className="mx-auto flex w-full max-w-5xl flex-col items-center justify-between gap-4 px-4 py-8 text-sm text-muted sm:flex-row sm:px-6">
        <p>© {SITE_NAME}</p>
        <div className="flex items-center gap-1">
          {social.map(({ href, label, Icon }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={label}
              className="rounded-md p-2 text-muted transition-colors hover:text-ink"
            >
              <Icon />
            </a>
          ))}
          <Link href="/feed.xml" aria-label="RSS feed of the blog" className="rounded-md p-2 text-muted transition-colors hover:text-ink">
            <RssIcon />
          </Link>
        </div>
      </div>
    </footer>
  );
}
