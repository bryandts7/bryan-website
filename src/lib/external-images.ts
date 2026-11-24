/**
 * Image hosts allowed besides the Supabase media bucket: the preview images of
 * work projects, shown straight from the employer's public website. Used by
 * next.config (to let next/image load them) and by the admin form check.
 */
export const EXTERNAL_IMAGE_SOURCES = [
  { hostname: "www.pixalate.com", pathPrefix: "/hubfs/" },
  { hostname: "2364596.fs1.hubspotusercontent-na1.net", pathPrefix: "/hubfs/2364596/" },
] as const;

export function isAllowedExternalImage(value: string): boolean {
  try {
    const url = new URL(value);
    return (
      url.protocol === "https:" &&
      EXTERNAL_IMAGE_SOURCES.some(
        ({ hostname, pathPrefix }) => url.hostname === hostname && url.pathname.startsWith(pathPrefix)
      )
    );
  } catch {
    return false;
  }
}
