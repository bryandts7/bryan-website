/**
 * All dates on the site are shown in one time zone, so a post's date is the
 * same on the blog, the post page and in the admin console, whoever views it.
 */
export const SITE_TIME_ZONE = "Asia/Jakarta";

/** "Nov 12, 2026, 2:05 PM" */
export function formatDateTime(iso: string): string {
  return new Date(iso).toLocaleString("en-US", {
    year: "numeric",
    month: "short",
    day: "numeric",
    hour: "numeric",
    minute: "2-digit",
    timeZone: SITE_TIME_ZONE,
  });
}

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
