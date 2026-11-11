/**
 * Where to send someone after login. Only paths on this site are allowed
 * ("/admin", "/blog/x"), never another host, so a crafted login link cannot
 * redirect a visitor elsewhere.
 */
export function safeNextPath(next: string | null | undefined): string {
  if (!next || !next.startsWith("/") || next.startsWith("//") || next.includes("\\")) {
    return "/";
  }
  return next;
}
