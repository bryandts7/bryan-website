/** "Lying with Statistics!" -> "lying-with-statistics" */
export function slugify(input: string, max = 80): string {
  return input
    .normalize("NFKD")
    .replace(/[̀-ͯ]/g, "") // strip accents
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, max)
    .replace(/-+$/, "");
}

/** Same rule as the database check on posts.slug and projects.slug. */
export const SLUG_PATTERN = /^[A-Za-z0-9_-]+$/;
