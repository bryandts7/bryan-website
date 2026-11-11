/**
 * All dates on the site are shown in one time zone, so a post's date is the
 * same on the blog, the post page and in the admin console, whoever views it.
 */
export const SITE_TIME_ZONE = "Asia/Jakarta";

/** "March 7, 2025", or null when there is no date. */
export function formatDate(iso: string | null): string | null {
  if (!iso) return null;
  return new Date(iso).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
    timeZone: SITE_TIME_ZONE,
  });
}
