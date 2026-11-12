/** Public address of the live site (used for canonical links, sitemap, RSS). */
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL ?? "https://bryandts.netlify.app").replace(/\/$/, "");

export const SITE_NAME = "Bryan Delton Tawarikh Sibarani";
export const SITE_SHORT_NAME = "Bryan Delton";
export const SITE_DESCRIPTION =
  "Data scientist writing about mathematics, statistics and machine learning. Projects, experience and blog.";

/** Shared link-preview fields; pages that set their own openGraph must spread these in. */
export const OPEN_GRAPH_DEFAULTS = {
  type: "website" as const,
  siteName: SITE_NAME,
  locale: "en_US",
};

export const SOCIAL_LINKS = {
  github: "https://github.com/bryandts7",
  linkedin: "https://linkedin.com/in/bryandeltontawarikhsibarani/",
  instagram: "https://instagram.com/bryndts_",
};

/** About 200 words a minute; at least one minute. */
export function readingMinutes(markdown: string): number {
  const words = markdown
    .replace(/```[\s\S]*?```/g, " ")
    .replace(/\$\$[\s\S]*?\$\$/g, " ")
    .split(/\s+/)
    .filter(Boolean).length;
  return Math.max(1, Math.round(words / 200));
}
